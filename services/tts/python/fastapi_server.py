import os
import logging
import hashlib
import json
import asyncio
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Request, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import azure.cognitiveservices.speech as speechsdk
import redis
from dotenv import load_dotenv

from stem_parser import STEMParser
from ssml_gen import SSMLGenerator
from formula_narrator import FormulaNarrator

# Load environment variables
load_dotenv()

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tts-service")

app = FastAPI(title="QuantumMint TTS Orchestration Service")

# CORS Configuration
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Components
parser = STEMParser()
ssml_gen = SSMLGenerator()
formula_narrator = FormulaNarrator()

# Redis Configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
redis_password = os.getenv('REDIS_PASSWORD')
try:
    cache = redis.Redis(
        host=redis_host,
        port=redis_port,
        password=redis_password,
        decode_responses=False
    )
    cache.ping()
    logger.info("Connected to Redis")
except Exception as e:
    logger.warning(f"Redis unavailable: {e}. Operating without cache.")
    cache = None

# Azure Speech Configuration
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

# Models
class BreakdownRequest(BaseModel):
    formula: str

class BreakdownResponse(BaseModel):
    formula: str
    tokens: List[Dict[str, str]]

class TTSSegment(BaseModel):
    text: str
    voice: Optional[str] = "en-US-AriaNeural"
    type: Optional[str] = "narrative"  # narrative, formula, dialogue, step
    speed: Optional[float] = 1.0
    personal_voice_id: Optional[str] = None # For Azure Personal Voice

class TTSRequest(BaseModel):
    text: str
    user_id: str
    book_id: Optional[str] = None
    voice_map: Optional[Dict[str, str]] = None
    output_format: Optional[str] = "audio-16khz-32kbitrate-mono-mp3"

class TTSResponse(BaseModel):
    audio_url: Optional[str] = None
    audio_bytes: Optional[List[int]] = None
    segments: List[Dict[str, Any]]
    word_boundaries: Optional[List[Dict[str, Any]]] = None
    complexity: float
    duration_seconds: float

# Helper functions
def get_cache_key(text: str, voice: str, speed: float):
    key_str = f"{text}:{voice}:{speed}"
    return hashlib.sha256(key_str.encode()).hexdigest()

async def synthesize_speech_azure_stream(ssml: str, output_format: str):
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        logger.error("Azure Speech credentials missing")
        raise HTTPException(status_code=500, detail="TTS Provider not configured")

    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    # Set output format
    if output_format == "audio-16khz-32kbitrate-mono-mp3":
        speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitrateMonoMp3)
    
    # Use pull audio output stream for streaming
    pull_stream = speechsdk.audio.PullAudioOutputStream()
    audio_config = speechsdk.audio.AudioOutputConfig(stream=pull_stream)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    # Synthesis is async
    result_future = synthesizer.speak_ssml_async(ssml)
    
    def generator():
        buffer = bytearray(4096)
        while True:
            size = pull_stream.read(buffer)
            if size == 0:
                break
            yield bytes(buffer[:size])
            
    return StreamingResponse(generator(), media_type="audio/mpeg")

async def synthesize_speech_azure(ssml: str, output_format: str, personal_voice_id: str = None):
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        logger.error("Azure Speech credentials missing")
        raise HTTPException(status_code=500, detail="TTS Provider not configured")

    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    
    # Enable Personal Voice if ID provided
    if personal_voice_id:
        # Note: In a real production environment, you'd use PersonalVoiceSynthesisConfig
        # For this demo, we'll set the speaker profile ID property
        speech_config.set_property(speechsdk.PropertyId.SpeechServiceConnection_SpeakerId, personal_voice_id)

    if output_format == "audio-16khz-32kbitrate-mono-mp3":
        speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitrateMonoMp3)
    
    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=False)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    # Word Boundary Event to capture precise timestamps
    word_boundaries = []
    def word_boundary_handler(evt):
        word_boundaries.append({
            "text": evt.text,
            "audio_offset": evt.audio_offset / 10000,  # Convert to milliseconds
            "duration": evt.duration / 10000,
            "text_offset": evt.text_offset,
            "word_length": evt.word_length
        })

    synthesizer.word_boundary.connect(word_boundary_handler)

    # Synthesis is async
    result = await asyncio.get_event_loop().run_in_executor(
        None, lambda: synthesizer.speak_ssml_async(ssml).get()
    )

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return result.audio_data, result.audio_duration.total_seconds(), word_boundaries
    else:
        error_details = result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonErrorDetails)
        logger.error(f"Speech synthesis failed: {result.reason}. Details: {error_details}")
        raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {result.reason}")

def calculate_complexity(segments: List[Dict[str, Any]]) -> float:
    score = 0
    for seg in segments:
        if seg["type"] == "math":
            score += 2.0
        elif seg["type"] == "chemistry":
            score += 1.5
        elif seg["type"] == "step":
            score += 1.0
    return min(score, 10.0)

class MultiTTSRequest(BaseModel):
    segments: List[TTSSegment]
    user_id: str
    book_id: Optional[str] = None

# Endpoints
@app.post("/tts/breakdown", response_model=BreakdownResponse)
async def breakdown_formula(request: BreakdownRequest):
    """
    Interactive Breakdown: Returns tokens with definitions for a formula.
    """
    tokens = formula_narrator.get_breakdown(request.formula)
    return BreakdownResponse(formula=request.formula, tokens=tokens)

@app.post("/tts/multi")
async def process_multi_tts(request: MultiTTSRequest, background_tasks: BackgroundTasks):
    """
    Multi-Voice Orchestration: Combines narrator, tutor, and character voices.
    """
    # Convert segments to the format expected by SSML generator
    segments_data = []
    for seg in request.segments:
        segments_data.append({
            "type": seg.type,
            "content": seg.text,
            "voice": seg.voice,
            "speed": seg.speed
        })
    
    # Generate SSML for the whole sequence
    ssml = ssml_gen.generate_ssml(segments_data)
    
    # Synthesize
    audio_data, duration = await synthesize_speech_azure(ssml, "audio-16khz-32kbitrate-mono-mp3")
    
    # Billing Hook
    if request.user_id:
        background_tasks.add_task(report_usage, request.user_id, request.book_id, duration)
        
    return {
        "audio_bytes": list(audio_data),
        "duration_seconds": duration,
        "segments": segments_data
    }

@app.post("/tts/stream")
async def stream_tts(request: TTSRequest, background_tasks: BackgroundTasks):
    """
    Streaming TTS: Directly streams audio from Azure.
    Useful for long content to reduce initial latency.
    """
    try:
        segments = parser.detect_stem_fragments(request.text)
        # Fill in gaps logic (simplified for stream)
        if not segments:
            segments = [{"type": "narrative", "content": request.text, "original": request.text, "start": 0, "end": len(request.text)}]
        else:
            # (In a real system, we'd reuse the full segmenting logic)
            pass

        ssml = ssml_gen.generate_ssml(segments, request.voice_map)
        
        # We don't cache streams easily, so we just stream
        # Billing would need to be handled via post-stream reporting or estimation
        
        return await synthesize_speech_azure_stream(ssml, request.output_format)

    except Exception as e:
        logger.error(f"Error in stream_tts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts/process", response_model=TTSResponse)
async def process_tts(request: TTSRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Segment text
        segments = parser.detect_stem_fragments(request.text)
        # If no fragments detected, treat whole text as narrative
        if not segments:
            segments = [{"type": "narrative", "content": request.text, "original": request.text, "start": 0, "end": len(request.text)}]
        else:
            # Fill in the gaps with narrative text
            full_segments = []
            last_end = 0
            for seg in sorted(segments, key=lambda x: x["start"]):
                if seg["start"] > last_end:
                    full_segments.append({
                        "type": "narrative",
                        "content": request.text[last_end:seg["start"]],
                        "original": request.text[last_end:seg["start"]],
                        "start": last_end,
                        "end": seg["start"]
                    })
                full_segments.append(seg)
                last_end = seg["end"]
            if last_end < len(request.text):
                full_segments.append({
                    "type": "narrative",
                    "content": request.text[last_end:],
                    "original": request.text[last_end:],
                    "start": last_end,
                    "end": len(request.text)
                })
            segments = full_segments

        # 2. Generate SSML
        ssml = ssml_gen.generate_ssml(segments, request.voice_map)
        
        # 3. Check Cache
        cache_key = get_cache_key(ssml, "multi", 1.0)
        if cache and cache.exists(cache_key):
            logger.info("Cache hit for TTS")
            cached_data = cache.get(cache_key)
            # For simplicity, we assume duration is also cached or we just return the bytes
            # In production, we'd cache a JSON with metadata and bytes separately
            return TTSResponse(
                audio_bytes=list(cached_data),
                segments=segments,
                complexity=calculate_complexity(segments),
                duration_seconds=0 # Would need to cache this
            )

        # 4. Synthesize
        audio_data, duration, word_boundaries = await synthesize_speech_azure(ssml, request.output_format)

        # 5. Cache Result (async)
        if cache:
            background_tasks.add_task(cache.setex, cache_key, 3600 * 24, audio_data)

        # 6. Billing Hook (async)
        if request.user_id:
            background_tasks.add_task(report_usage, request.user_id, request.book_id, duration)

        return TTSResponse(
            audio_bytes=list(audio_data),
            segments=segments,
            word_boundaries=word_boundaries,
            complexity=calculate_complexity(segments),
            duration_seconds=duration
        )

    except Exception as e:
        logger.error(f"Error in process_tts: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

async def report_usage(user_id: str, book_id: str, duration: float):
    """
    Reports usage to the PayGO billing service.
    """
    PAYGO_SERVICE_URL = os.getenv("PAYGO_SERVICE_URL", "http://localhost:5005")
    try:
        import httpx
        payload = {
            "userId": user_id,
            "productId": book_id,
            "productType": "audiobook",
            "durationSeconds": duration,
            "metadata": {"source": "tts-service", "method": "synthesis"}
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PAYGO_SERVICE_URL}/api/usage/report", json=payload)
            if response.status_code == 200:
                logger.info(f"Reported usage for user {user_id}: {duration}s")
            else:
                logger.error(f"Failed to report usage: {response.text}")
    except Exception as e:
        logger.error(f"Failed to report usage: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

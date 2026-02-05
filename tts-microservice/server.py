from flask import Flask, request, jsonify
import re
from flask_cors import CORS
import redis
import hashlib
import os
from stem_parser import STEMParser
from ssml_gen import SSMLGenerator

app = Flask(__name__)
CORS(app)

# Initialize components
parser = STEMParser()
ssml_gen = SSMLGenerator()

# Redis configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
cache = redis.Redis(host=redis_host, port=redis_port, decode_responses=False)

def get_cache_key(text, voice_id, speed):
    key_str = f"{text}:{voice_id}:{speed}"
    return hashlib.md5(key_str.encode()).hexdigest()

def calculate_complexity(segments):
    """Heuristic for complexity based on STEM content"""
    score = 0
    for seg in segments:
        if seg["type"] == "math":
            # Rough proxy for complexity: length and special chars
            score += 2.0
            score += len(re.findall(r'\\|[\^_{}]', seg["content"])) * 0.5
        elif seg["type"] == "chemistry":
            score += 1.5
    return score

@app.route('/process', methods=['POST'])
def process_text():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    segments = parser.segment_text(text)
    complexity = calculate_complexity(segments)
    ssml = ssml_gen.generate_ssml(segments, complexity)
    
    return jsonify({
        "segments": segments,
        "complexity": complexity,
        "ssml": ssml
    })

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.json
    text = data.get('text', '')
    voice_id = data.get('voice_id', 'default')
    speed = data.get('speed', 1.0)
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    # Check Cache
    cache_key = get_cache_key(text, voice_id, speed)
    cached_audio = cache.get(cache_key)
    
    if cached_audio:
        return cached_audio, 200, {'Content-Type': 'audio/mpeg', 'X-Cache': 'HIT'}
        
    # If not cached, process and "synthesize"
    segments = parser.segment_text(text)
    complexity = calculate_complexity(segments)
    ssml = ssml_gen.generate_ssml(segments, complexity)
    
    # MOCK SYNTHESIS: In a real app, call Google Cloud TTS or ElevenLabs here
    # For now, we return a mock response or just acknowledge the SSML
    # audio_content = real_tts_call(ssml, voice_id)
    
    # We'll simulate a 1-second delay for synthesis
    import time
    time.sleep(1)
    
    # Mock audio content (1 second of silence or dummy bytes)
    mock_audio = b"\xff\xfb\x90\x44" * 100 
    
    # Cache it
    cache.setex(cache_key, 3600, mock_audio) # Cache for 1 hour
    
    return mock_audio, 200, {'Content-Type': 'audio/mpeg', 'X-Cache': 'MISS'}

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5005))
    app.run(host='0.0.0.0', port=port)

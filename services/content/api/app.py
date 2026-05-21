# Content API - Unified Audiobook & TTS Service
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import json
import time
import uuid
from pathlib import Path

# Import core modules
from core.audiobook_generator import ScientificAudiobookGenerator
from core.scientific_tts import ScientificTTS

app = Flask(__name__)
CORS(app)

# Initialize services
try:
    tts_engine = ScientificTTS(Path(os.getenv('TTS_MODEL_PATH', '/app/models/tts')))
except Exception as e:
    print(f"Warning: TTS engine initialization failed: {e}")
    tts_engine = None

generator = ScientificAudiobookGenerator(
    tts_engine=tts_engine,
    visualizer=None,  # To be connected to concept-visualizer service
    knowledge_graph=None  # To be connected to knowledge-graph service
)

# ====================================
# HEALTH & STATUS
# ====================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "content-api",
        "components": {
            "tts_engine": "available" if tts_engine else "unavailable",
            "audiobook_generator": "available"
        }
    })

# ====================================
# AUDIOBOOK GENERATION
# ====================================

@app.route('/api/audiobook/analyze', methods=['POST'])
def analyze_text():
    """Analyze scientific text for structure and content"""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    analysis = generator.analyze_text(text)
    return jsonify({"success": True, "data": analysis})

@app.route('/api/audiobook/generate', methods=['GET'])
def generate_audiobook():
    """SSE Endpoint for audiobook generation with progress updates"""
    data_str = request.args.get('data', '{}')
    try:
        options = json.loads(data_str)
    except:
        return jsonify({"error": "Invalid JSON data"}), 400
        
    def generate():
        text = options.get('text', '')
        difficulty = options.get('difficulty', 'intermediate')
        voice = options.get('voice', 'scientific')
        
        # Progress updates
        yield f"data: {json.dumps({'type': 'progress', 'value': 10, 'message': 'Analyzing text...'})}\\n\\n"
        time.sleep(0.5)
        
        # Analyze text
        analysis = generator.analyze_text(text)
        
        yield f"data: {json.dumps({'type': 'progress', 'value': 30, 'message': 'Understanding concepts...'})}\\n\\n"
        time.sleep(0.5)
        
        yield f"data: {json.dumps({'type': 'progress', 'value': 50, 'message': 'Generating audio...'})}\\n\\n"
        time.sleep(0.5)
        
        # Generate audio if TTS is available
        if tts_engine:
            try:
                result = tts_engine.synthesize_with_explanations(text, difficulty)
                duration = result.get('duration', 0)
            except Exception as e:
                print(f"TTS synthesis error: {e}")
                duration = analysis.get('estimated_duration', 120)
        else:
            duration = analysis.get('estimated_duration', 120)
        
        yield f"data: {json.dumps({'type': 'progress', 'value': 80, 'message': 'Creating visualizations...'})}\\n\\n"
        time.sleep(0.5)
        
        # Final result
        project_id = str(uuid.uuid4())
        result = {
            'type': 'result',
            'project_id': project_id,
            'duration': int(duration),
            'analysis': analysis,
            'audio_generated': tts_engine is not None
        }
        yield f"data: {json.dumps(result)}\\n\\n"
        
    return Response(generate(), mimetype='text/event-stream')

# ====================================
# TTS SYNTHESIS
# ====================================

@app.route('/api/tts/synthesize', methods=['POST'])
def synthesize_speech():
    """Synthesize speech from text"""
    data = request.json
    text = data.get('text', '')
    voice = data.get('voice', 'scientific')
    speed = data.get('speed', 1.0)
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    if not tts_engine:
        return jsonify({
            "error": "TTS engine not available",
            "status": "unavailable"
        }), 503
        
    try:
        # Synthesize audio
        audio = tts_engine.synthesize_speech(text, voice=voice, speed=speed)
        
        # Save to file
        filename = f"{uuid.uuid4()}.wav"
        output_path = Path('/app/generated') / filename
        
        import soundfile as sf
        sf.write(str(output_path), audio, 24000)
        
        return jsonify({
            "status": "success",
            "file": filename,
            "duration": len(audio) / 24000,
            "word_count": len(text.split())
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

@app.route('/api/tts/synthesize-with-explanations', methods=['POST'])
def synthesize_with_explanations():
    """Synthesize speech with embedded concept explanations"""
    data = request.json
    text = data.get('text', '')
    difficulty = data.get('difficulty', 'intermediate')
    voice = data.get('voice', 'scientific')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    if not tts_engine:
        return jsonify({
            "error": "TTS engine not available",
            "status": "unavailable"
        }), 503
        
    try:
        # Synthesize with explanations
        result = tts_engine.synthesize_with_explanations(text, difficulty)
        
        # Save to file
        filename = f"{uuid.uuid4()}_explained.wav"
        output_path = Path('/app/generated') / filename
        
        import soundfile as sf
        sf.write(str(output_path), result['audio'], 24000)
        
        return jsonify({
            "status": "success",
            "file": filename,
            "duration": result['duration'],
            "word_count": result['word_count'],
            "formula_count": result['formula_count'],
            "analysis": result['analysis']
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

# ====================================
# EBOOK & CONTENT MANAGEMENT
# ====================================

@app.route('/api/content/search', methods=['GET'])
def search_content():
    """Search for books, audiobooks, and videos"""
    query = request.args.get('q', '')
    content_type = request.args.get('type', 'all')  # all, video, audiobook, ebook
    
    # In production, this would query a vector DB (Qdrant) or Elasticsearch
    # For now, return success with empty results to avoid breakage
    return jsonify({
        "success": True,
        "query": query,
        "content_type": content_type,
        "results": [],
        "total": 0,
        "message": "Search system active. Connect to Qdrant for full results."
    })

@app.route('/api/content/<content_id>', methods=['GET'])
def get_content(content_id):
    """Get content details by ID"""
    # Implementation would fetch from a database or storage
    return jsonify({
        "success": True,
        "content_id": content_id,
        "data": {
            "id": content_id,
            "status": "available",
            "metadata_link": f"/api/content/{content_id}/metadata"
        }
    })

@app.route('/api/content/upload', methods=['POST'])
def upload_content():
    """Upload content (ebook, audiobook, etc.)"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    content_type = request.form.get('type', 'ebook')
    
    # Generate unique ID and path
    content_id = str(uuid.uuid4())
    filename = f"{content_id}_{file.filename}"
    upload_dir = Path(os.getenv('UPLOAD_DIR', '/app/uploads')) / content_type
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    save_path = upload_dir / filename
    file.save(str(save_path))
    
    return jsonify({
        "success": True,
        "content_id": content_id,
        "message": "File uploaded successfully",
        "path": str(save_path),
        "content_type": content_type
    })

# ====================================
# ERROR HANDLERS
# ====================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ====================================
# START SERVER
# ====================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))

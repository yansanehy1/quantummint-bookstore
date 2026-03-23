from flask import Flask, request, jsonify
import re
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import hashlib
import os
from stem_parser import STEMParser
from ssml_gen import SSMLGenerator
import logging

app = Flask(__name__)

# Hardened CORS
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
try:
    frontend_origin = frontend_url if frontend_url.startswith('http') else f'http://{frontend_url}'
except:
    frontend_origin = 'http://localhost:5173'

CORS(app, origins=[frontend_origin], methods=['POST', 'GET'], allow_headers=['Content-Type'])

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["30 per 15 minutes"],
    storage_uri="memory://"
)

# Initialize components
parser = STEMParser()
ssml_gen = SSMLGenerator()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis configuration with authentication
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
redis_password = os.getenv('REDIS_PASSWORD')
redis_db = int(os.getenv('REDIS_DB', 0))
try:
    cache = redis.Redis(
        host=redis_host,
        port=redis_port,
        password=redis_password,
        db=redis_db,
        decode_responses=False,
        socket_timeout=5,
        socket_connect_timeout=5
    )
    cache.ping()
except Exception as e:
    logger.warning(f'Redis unavailable: {e}. Operating without cache.')
    cache = None

def get_cache_key(text, voice_id, speed):
    """Generate cache key using SHA256 instead of MD5"""
    key_str = f"{text}:{voice_id}:{speed}"
    return hashlib.sha256(key_str.encode()).hexdigest()

def calculate_complexity(segments):
    """Heuristic for complexity based on STEM content"""
    if not segments or not isinstance(segments, list):
        return 0
    score = 0
    for seg in segments:
        if not isinstance(seg, dict) or 'type' not in seg:
            continue
        if seg["type"] == "math":
            score += min(2.0, 2.0)  # Cap score to prevent overflow
            score += len(re.findall(r'\\|[\^_{}]', seg.get("content", ""))) * 0.5
        elif seg["type"] == "chemistry":
            score += min(1.5, 1.5)
    return min(score, 10.0)  # Cap total complexity

@app.route('/process', methods=['POST'])
@limiter.limit("5 per minute")
def process_text():
    try:
        data = request.get_json(force=True, silent=True) or {}
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        if len(text) > 5000:
            return jsonify({"error": "Text too long (max 5000 chars)"}), 400
            
        segments = parser.segment_text(text)
        complexity = calculate_complexity(segments)
        ssml = ssml_gen.generate_ssml(segments, complexity)
        
        return jsonify({
            "segments": segments,
            "complexity": complexity,
            "ssml": ssml
        })
    except Exception as e:
        logger.error(f"Error in /process: {e}")
        return jsonify({"error": "Processing failed"}), 500

@app.route('/synthesize', methods=['POST'])
@limiter.limit("10 per minute")
def synthesize():
    try:
        data = request.get_json(force=True, silent=True) or {}
        text = data.get('text', '').strip()
        voice_id = str(data.get('voice_id', 'default')).strip()
        speed = float(data.get('speed', 1.0))
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        if len(text) > 5000:
            return jsonify({"error": "Text too long (max 5000 chars)"}), 400
        if not (0.5 <= speed <= 2.0):
            return jsonify({"error": "Speed must be between 0.5 and 2.0"}), 400
        if not re.match(r'^[a-zA-Z0-9_-]+$', voice_id):
            return jsonify({"error": "Invalid voice_id format"}), 400
            
        # Check Cache
        cache_key = get_cache_key(text, voice_id, speed)
        if cache:
            try:
                cached_audio = cache.get(cache_key)
                if cached_audio:
                    return cached_audio, 200, {'Content-Type': 'audio/mpeg', 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600'}
            except Exception as e:
                logger.warning(f"Cache retrieval failed: {e}")
        
        # If not cached, process and synthesize
        segments = parser.segment_text(text)
        complexity = calculate_complexity(segments)
        ssml = ssml_gen.generate_ssml(segments, complexity)
        
        # MOCK SYNTHESIS
        import time
        time.sleep(min(1, complexity * 0.1))  # Cap sleep time
        
        mock_audio = b"\xff\xfb\x90\x44" * 100 
        
        # Cache it
        if cache:
            try:
                cache.setex(cache_key, 3600, mock_audio)
            except Exception as e:
                logger.warning(f"Cache storage failed: {e}")
        
        return mock_audio, 200, {'Content-Type': 'audio/mpeg', 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=3600'}
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error in /synthesize: {e}")
        return jsonify({"error": "Synthesis failed"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5005))
    app.run(host='127.0.0.1', port=port)

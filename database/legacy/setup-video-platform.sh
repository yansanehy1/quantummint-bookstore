#!/bin/bash

# QuantumMint Video Platform Setup Script
# This script sets up the environment for the self-hosted video platform

echo "🎬 Setting up QuantumMint Video Platform..."

# 1. Check for FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Installing FFmpeg..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    else
        echo "⚠️  Please install FFmpeg manually and ensure it's in your PATH."
    fi
else
    echo "✅ FFmpeg found."
fi

# 2. Check for Redis
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis not found. Please install Redis for job queue management."
    echo "   Linux: sudo apt-get install redis-server"
    echo "   Mac: brew install redis"
else
    echo "✅ Redis found."
fi

# 3. Create Directories
echo "📂 Creating directory structure..."
mkdir -p videos/originals
mkdir -p videos/encoded
mkdir -p videos/thumbnails
mkdir -p videos/previews
mkdir -p temp/uploads
mkdir -p logs

# 4. Install Dependencies
echo "📦 Installing Node.js dependencies..."
cd video-processor
npm install

# 5. Create .env file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating default .env file..."
    cat > .env << EOL
PORT=3000
STREAM_PORT=8000
REDIS_URL=redis://localhost:6379
VIDEO_STORAGE=../videos
TEMP_DIR=../temp
FFMPEG_PATH=$(which ffmpeg)
FFPROBE_PATH=$(which ffprobe)
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "To start the video platform:"
echo "  cd video-processor"
echo "  npm start"
echo ""
echo "To test uploads:"
echo "  Open http://localhost:3000/upload-test.html"
echo ""
echo "To view the player:"
echo "  Open http://localhost:3000/video-player.html"

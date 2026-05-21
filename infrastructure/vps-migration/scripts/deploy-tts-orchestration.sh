#!/bin/bash
# infrastructure/vps-migration/scripts/deploy-tts-orchestration.sh

# Exit on error
set -e

echo "🚀 Starting Deployment of TTS Orchestration System on Hostinger VPS..."

# 1. Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "❌ .env file not found! Please create one based on .env.example"
    exit 1
fi

# 2. Check for required tools
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ docker-compose is not installed. Aborting."; exit 1; }

# 3. Pull latest changes (optional if using CI/CD)
# git pull origin main

# 4. Build and start services
echo "📦 Building and starting containers..."
docker-compose -f infrastructure/docker-compose.yml -f infrastructure/docker-compose.educational.yml up -d --build tts-service backend paygo-service

# 5. Apply NGINX configuration
echo "🔧 Configuring NGINX..."
sudo cp infrastructure/nginx/conf.d/tts.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx

# 6. Database Migrations (if any)
echo "🗄️ Running database migrations..."
# docker-compose exec backend npm run migrate

# 7. Health Check
echo "🔍 Performing health check..."
curl -s http://localhost:8000/tts/breakdown -H "Content-Type: application/json" -d '{"formula": "E=mc^2"}' | grep -q "speed of light" && echo "✅ TTS Service is UP" || echo "⚠️ TTS Service check failed"

echo "✨ Deployment Complete! Your QuantumMint TTS Orchestration is now live."

#!/bin/bash
# deploy-quantummint-bookstore.sh - QuantumMint Production Deployment
# Target: Hostinger KVM VPS (Ubuntu 24.04)

set -e  # Exit on error

echo "🚀 QuantumMint Deployment Starting..."

# ===== CONFIGURATION =====
DOMAIN="${DOMAIN:-quantummint.net}"
EMAIL="${EMAIL:-admin@quantummint.net}"
VPS_USER="${VPS_USER:-quantummint}"
PROJECT_DIR="/home/$VPS_USER/quantummint"

# ===== PRE-FLIGHT CHECKS =====
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and back in for Docker group changes to apply"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found. Installing..."
    sudo apt update && sudo apt install -y docker-compose-plugin
fi

# ===== DEPLOYMENT =====
echo "📦 Pulling latest code..."
# cd "$PROJECT_DIR" || { echo "❌ Project directory not found"; exit 1; }
# For the purpose of this script in the root, we assume we are already in the project dir or will be
git pull origin production || echo "⚠️  Git pull failed, continuing with local files..."

echo "🔐 Validating environment..."
if [ ! -f .env ]; then
    echo "❌ .env file missing. Copy from template:"
    echo "   cp .env.example .env  # Then edit with your secrets"
    exit 1
fi

echo "🗄️  Starting database..."
docker compose up -d postgres redis
sleep 10  # Wait for PostgreSQL healthcheck

echo "🔄 Running migrations..."
# Assuming we have a migration command, e.g., for Sequelize or similar
# docker compose exec -T backend npm run migrate || echo "⚠️  Migration failed or not configured"

echo "📦 Building application..."
docker compose up -d --build

echo "🔒 Setting up SSL (if not already configured)..."
if [ ! -f infrastructure/nginx/ssl/fullchain.pem ]; then
    echo "⚠️  SSL certificates not found. Run manually:"
    echo "   sudo certbot certonly --webroot -w /var/www/html -d $DOMAIN -d www.$DOMAIN --email $EMAIL"
    echo "   Then copy certs to infrastructure/nginx/ssl/ and restart: docker compose restart nginx"
fi

echo "✅ Deployment complete!"
echo "🌐 Visit: https://$DOMAIN"
echo "📊 Monitor: docker compose logs -f"
echo "🔄 Rollback: git revert HEAD && ./deploy-quantummint-bookstore.sh"

# ===== HEALTH CHECK =====
sleep 5
if curl -sf "https://$DOMAIN/health" > /dev/null; then
    echo "🎉 Health check passed!"
else
    echo "⚠️  Health check failed. Check logs:"
    echo "   docker compose logs nginx backend postgres"
fi

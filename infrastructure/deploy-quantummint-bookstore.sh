#!/bin/bash
# deploy-quantummint-bookstore.sh

set -e

echo "📚 QuantumMint Bookstore Deployment"
echo "================================================

# Configuration
DOMAIN="quantummint.net"
EMAIL="admin@quantummint.net"
INSTANCE_TYPE="g4dn.4xlarge"  # 4 GPU instance
REGION="us-east-1"
STORAGE_SIZE="1TB"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() { echo -e "\n${GREEN}▶ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; exit 1; }

# Check dependencies
check_dependencies() {
    print_step "Checking dependencies..."
    
    local deps=("docker" "docker-compose" "git" "openssl")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
    fi
    
    # Check for GPU
    if command -v nvidia-smi &> /dev/null; then
        GPU_AVAILABLE=true
        echo "✅ NVIDIA GPU detected"
    else
        GPU_AVAILABLE=false
        print_warning "No NVIDIA GPU detected. Some features will be limited."
    fi
}

# Create directory structure
create_structure() {
    print_step "Creating directory structure..."
    
    mkdir -p quantummint-bookstore/{services,models,data,config,logs,uploads}
    mkdir -p quantummint-bookstore/services/{api-gateway,auth-service,payment-service,video-api,video-processor,streaming-server,audiobook-api,tts-engine,formula-engine,concept-visualizer,knowledge-graph,ebook-converter,bookstore-api,web-frontend,admin-dashboard,analytics-engine,tts-microservice}
    mkdir -p quantummint-bookstore/models/{tts,visualization,math,linguistic,kg}
    mkdir -p quantummint-bookstore/data/{postgres,redis,neo4j,elasticsearch}
    mkdir -p quantummint-bookstore/uploads/{videos,audiobooks,ebooks}
    mkdir -p quantummint-bookstore/logs/{nginx,api,processing,audiobook}
    mkdir -p quantummint-bookstore/config/{nginx,redis,services}
    mkdir -p quantummint-bookstore/ssl
    
    echo "✅ Directory structure created"
}

# Generate SSL certificates
generate_ssl() {
    print_step "Generating SSL certificates..."
    
    if [ ! -f quantummint-bookstore/ssl/quantummint.crt ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout quantummint-bookstore/ssl/quantummint.key \
            -out quantummint-bookstore/ssl/quantummint.crt \
            -subj "/C=US/ST=State/L=City/O=QuantumMint Bookstore/CN=$DOMAIN"
        echo "✅ Self-signed SSL certificates generated"
    else
        echo "✅ SSL certificates already exist"
    fi
}

# Generate environment files
generate_env() {
    print_step "Generating environment configuration..."
    
    cat > quantummint-bookstore/.env << EOF
# QuantumMint Platform Configuration
DOMAIN=$DOMAIN
EMAIL=$EMAIL

# Security
JWT_SECRET=$(openssl rand -hex 64)
ENCRYPTION_KEY=$(openssl rand -hex 32)
DB_PASSWORD=2883Born@#
REDIS_PASSWORD=$(openssl rand -hex 32)
NEO4J_PASSWORD=$(openssl rand -hex 32)
SECURE_LINK_SECRET=$(openssl rand -hex 32)

# Payment Processing
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID:-}
PAYPAL_SECRET=${PAYPAL_SECRET:-}
CRYPTO_PRIVATE_KEY=${CRYPTO_PRIVATE_KEY:-}

# Monitoring
GRAFANA_PASSWORD=$(openssl rand -hex 16)

# Platform Settings
MAX_UPLOAD_SIZE=10GB
MAX_AUDIO_DURATION=7200
GPU_ENABLED=$GPU_AVAILABLE
CDN_ENABLED=true
ENABLE_SCIENTIFIC_TTS=true
ENABLE_FORMULA_VISUALIZATION=true

# Pricing
PLATFORM_FEE_PERCENTAGE=15
MINIMUM_PRICE=4.99
SUBSCRIPTION_PRICE_MONTHLY=29.99
SUBSCRIPTION_PRICE_YEARLY=299.99

# Storage
VIDEO_STORAGE_PATH=/var/www/videos
AUDIOBOOK_STORAGE_PATH=/var/www/audiobooks
EBOOK_STORAGE_PATH=/var/www/ebooks
CACHE_PATH=/var/cache/quantummint

# Email
SMTP_HOST=${SMTP_HOST:-}
SMTP_PORT=${SMTP_PORT:-587}
SMTP_USER=${SMTP_USER:-}
SMTP_PASSWORD=${SMTP_PASSWORD:-}
EMAIL_FROM=noreply@$DOMAIN
EOF
    
    echo "✅ Environment file generated"
}

# Download models
download_models() {
    print_step "Downloading AI models..."
    
    # Create model repository URL
    MODEL_REPO="https://models.quantummint.net"
    
    # Download TTS models
    echo "Downloading TTS models..."
    # wget -q -O quantummint-bookstore/models/tts/tacotron2_scientific.pt "$MODEL_REPO/tts/tacotron2-scientific.pt"
    # wget -q -O quantummint-bookstore/models/tts/wavernn_scientific.pt "$MODEL_REPO/tts/wavernn-scientific.pt"
    
    # Download visualization models
    echo "Downloading visualization models..."
    # wget -q -O quantummint-bookstore/models/visualization/sd-scientific.ckpt "$MODEL_REPO/visualization/sd-scientific.ckpt"
    # wget -q -O quantummint-bookstore/models/visualization/clip-vit.pt "$MODEL_REPO/visualization/clip-vit.pt"
    
    # Download mathematical models
    echo "Downloading mathematical models..."
    # wget -q -O quantummint-bookstore/models/math/formula-parser.pt "$MODEL_REPO/math/formula-parser.pt"
    # wget -q -O quantummint-bookstore/models/math/symbolic-solver.pt "$MODEL_REPO/math/symbolic-solver.pt"
    
    # Download knowledge base
    echo "Downloading knowledge base..."
    # wget -q -O quantummint-bookstore/models/kg/scientific-knowledge.pt "$MODEL_REPO/kg/scientific-knowledge.pt"
    # wget -q -O quantummint-bookstore/data/scientific-concepts.json "$MODEL_REPO/data/scientific-concepts.json"
    
    echo "✅ Models downloaded (Mocked)"
}

# Create Docker Compose file
create_docker_compose() {
    print_step "Creating Docker Compose configuration..."
    
    cp docker-compose.yml quantummint-bookstore/docker-compose.yml
    
    # Create nginx configuration
    mkdir -p quantummint-bookstore/config/nginx
    cp nginx/quantummint.conf quantummint-bookstore/config/nginx/quantummint.conf
    
    # Copy all services
    echo "Copying service source code..."
    for service in api-gateway auth-service video-api video-processor streaming-server content-api formula-engine concept-visualizer knowledge-graph admin-dashboard analytics-engine tts-microservice web-frontend; do
        if [ -d "$service" ]; then
            cp -r "$service" quantummint-bookstore/services/
        fi
    done

    # Copy shared files
    if [ -d "shared" ]; then cp -r shared quantummint-bookstore/; fi
    if [ -d "types" ]; then cp -r types quantummint-bookstore/; fi
    if [ -d "utils" ]; then cp -r utils quantummint-bookstore/; fi
    if [ -d "components" ]; then cp -r components quantummint-bookstore/; fi

    echo "✅ Docker configuration and service code copied"
}

# Create initialization scripts
create_init_scripts() {
    print_step "Creating initialization scripts..."
    
    # Database initialization
    # cat > quantummint-bookstore/scripts/init-all-databases.sql << 'EOF'
# -- SQL from earlier section
# EOF
    
    # Redis configuration
    mkdir -p quantummint-bookstore/config/redis
    cat > quantummint-bookstore/config/redis/redis.conf << 'EOF'
bind 0.0.0.0
port 6379
requirepass ${REDIS_PASSWORD}

maxmemory 2gb
maxmemory-policy allkeys-lru

save 900 1
save 300 10
save 60 10000

appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
EOF
    
    # Startup script
    cat > quantummint-bookstore/start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting QuantumMint Bookstore Platform..."
echo "================================="

# Load environment
source .env

# Check for GPU
if [ "$GPU_ENABLED" = "true" ]; then
    if ! nvidia-smi &> /dev/null; then
        echo "⚠️  GPU enabled but NVIDIA drivers not found"
        export GPU_ENABLED=false
    fi
fi

# Start services
docker-compose up -d

echo ""
echo "✅ QuantumMint Bookstore Platform is starting..."
echo ""
echo "📊 Monitoring startup progress:"
echo "   docker-compose logs -f"
echo ""
echo "🌐 Once started, access at:"
echo "   Main Site:      https://$DOMAIN"
echo "   Admin Panel:    https://$DOMAIN/admin"
echo "   Monitoring:     https://$DOMAIN/monitoring"
echo "   API Docs:       https://$DOMAIN/api/docs"
echo ""
echo "🔧 Management commands:"
echo "   Stop:           docker-compose down"
echo "   Restart:        docker-compose restart"
echo "   Update:         git pull && docker-compose up -d --build"
echo "   Backup DB:      ./scripts/backup-database.sh"
echo ""
EOF
    
    chmod +x quantummint-bookstore/start.sh
    # chmod +x quantummint-bookstore/scripts/*.sh
    
    echo "✅ Initialization scripts created"
}

# Create backup script
create_backup_script() {
    cat > quantummint-bookstore/scripts/backup-database.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "📦 Backing up databases..."

# Backup PostgreSQL
docker-compose exec -T postgres pg_dumpall -U postgres > $BACKUP_DIR/full_backup_$TIMESTAMP.sql

# Backup Redis
docker-compose exec -T redis redis-cli --rdb /data/dump.rdb
docker cp $(docker-compose ps -q redis):/data/dump.rdb $BACKUP_DIR/redis_$TIMESTAMP.rdb

# Backup Neo4j
docker-compose exec -T neo4j bin/neo4j-admin dump --database=neo4j --to=/backups/
docker cp $(docker-compose ps -q neo4j):/backups/neo4j.dump $BACKUP_DIR/neo4j_$TIMESTAMP.dump

# Compress backups
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz $BACKUP_DIR/*_$TIMESTAMP.*

# Cleanup
rm $BACKUP_DIR/*_$TIMESTAMP.sql $BACKUP_DIR/*_$TIMESTAMP.rdb $BACKUP_DIR/*_$TIMESTAMP.dump

echo "✅ Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
EOF
}

# Create health check script
create_health_check() {
    cat > quantummint-bookstore/scripts/health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 Running health checks..."
echo "=========================="

# Check Docker containers
echo "1. Checking Docker containers..."
if docker-compose ps | grep -v "Up (healthy)"; then
    echo "⚠️  Some containers may not be healthy"
else
    echo "✅ All containers healthy"
fi

# Check API endpoints
echo "2. Checking API endpoints..."
ENDPOINTS=(
    "https://$DOMAIN/health"
    "https://$DOMAIN/api/auth/health"
    "https://$DOMAIN/api/video/health"
    "https://$DOMAIN/api/audiobook/health"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -s -f $endpoint > /dev/null; then
        echo "✅ $endpoint"
    else
        echo "❌ $endpoint"
    fi
done

# Check disk space
echo "3. Checking disk space..."
df -h / | tail -1

# Check memory usage
echo "4. Checking memory usage..."
free -h

# Check GPU (if available)
if command -v nvidia-smi &> /dev/null; then
    echo "5. Checking GPU..."
    nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
fi

echo ""
echo "📊 System status report complete"
EOF
}

# Finalize deployment
finalize() {
    print_step "Finalizing deployment..."
    
    # Set permissions
    # chmod -R 755 quantummint-bookstore/scripts
    # chmod -R 755 quantummint-bookstore/config
    
    # Create readme
    cat > quantummint-bookstore/README.md << 'EOF'
# QuantumMint Bookstore

The complete integrated learning platform combining videos, audiobooks, and scientific content with AI-powered explanations.

## Quick Start

1. Start the platform:
   ```bash
   ./start.sh
   ```

2. Access the platform:
   - Main site: https://your-domain.com
   - Admin: https://your-domain.com/admin (admin/admin123)
   - API: https://your-domain.com/api/docs

3. Create your first content:
   - Upload videos
   - Generate audiobooks with AI explanations
   - Publish interactive ebooks

## Platform Features

✅ **Video Platform**
- Upload and stream videos up to 10GB
- GPU-accelerated encoding
- Adaptive streaming (HLS/DASH)
- Interactive player with chapters

✅ **Audiobook Platform**
- AI-powered text-to-speech with scientific pronunciation
- Automatic formula explanations
- Concept visualizations
- Knowledge graph integration

✅ **Ebook Platform**
- Interactive ebooks with embedded media
- DRM protection
- Cross-platform reading
- Progress synchronization

✅ **Scientific Features**
- Mathematical formula understanding
- Concept visualization generation
- Knowledge graph for connected learning
- Adaptive difficulty levels

## Configuration

Edit `.env` file for:
- Domain settings
- Payment gateways
- Email configuration
- Storage paths

## Maintenance

- Backup: `./scripts/backup-database.sh`
- Health check: `./scripts/health-check.sh`
- Update: `git pull && docker-compose up -d --build`
- Monitor: `docker-compose logs -f`

## Support

- Documentation: https://docs.sierabooks.com
- Community: https://community.sierabooks.com
- Email: support@sierabooks.com

## License

Proprietary - © 2024 Quantummint Bookstore
EOF
    
    print_step "🎉 Deployment Complete!"
    echo ""
    echo "=========================================="
    echo "QuantumMint Bookstore Platform Ready for Launch!"
    echo "=========================================="
    echo ""
    echo "To start the platform:"
    echo "  cd quantummint-bookstore"
    echo "  ./start.sh"
    echo ""
    echo "Next steps:"
    echo "  1. Configure your domain in .env"
    echo "  2. Set up SSL certificates (Let's Encrypt)"
    echo "  3. Configure payment gateways"
    echo "  4. Add your first content"
    echo "  5. Invite creators and users"
    echo ""
    echo "Need help? Check README.md for documentation"
    echo "=========================================="
}

# Main deployment function
main() {
    echo "🚀 Starting QuantumMint Bookstore Platform Deployment"
    echo "=========================================="
    
    check_dependencies
    create_structure
    generate_ssl
    generate_env
    download_models
    create_docker_compose
    create_init_scripts
    create_backup_script
    create_health_check
    finalize
    
    echo ""
    echo "✅ Deployment script completed successfully!"
    echo ""
    echo "Your QuantumMint Bookstore platform is ready to be started."
    echo "Change to the quantummint-bookstore directory and run ./start.sh"
}

# Run main function
main "$@"

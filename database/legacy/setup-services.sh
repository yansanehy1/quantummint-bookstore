#!/bin/bash

# QuantumMint Services Setup Script
# This script prepares the mail-server and domain-controller services for deployment

set -e  # Exit on error

echo "========================================="
echo "QuantumMint Services Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running in the correct directory
if [ ! -d "mail-server" ] || [ ! -d "domain-controller" ]; then
    print_error "Please run this script from the quantummint-bookstore156 directory"
    exit 1
fi

# Create required directories
echo "Creating required directories..."
mkdir -p mail-server/logs mail-server/certs mail-server/keys
mkdir -p domain-controller/logs domain-controller/certs
print_success "Directories created"

# Generate TLS/SSL certificates for development
echo ""
echo "Generating TLS/SSL certificates..."

# Mail Server Certificate
if [ ! -f "mail-server/certs/certificate.crt" ]; then
    openssl req -x509 -newkey rsa:2048 \
        -keyout mail-server/certs/private.key \
        -out mail-server/certs/certificate.crt \
        -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=QuantumMint/CN=mail.quantummint.net"
    print_success "Mail server certificate generated"
else
    print_warning "Mail server certificate already exists"
fi

# Domain Controller Certificate
if [ ! -f "domain-controller/certs/certificate.crt" ]; then
    openssl req -x509 -newkey rsa:2048 \
        -keyout domain-controller/certs/private.key \
        -out domain-controller/certs/certificate.crt \
        -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=QuantumMint/CN=dc.quantummint.net"
    print_success "Domain controller certificate generated"
else
    print_warning "Domain controller certificate already exists"
fi

# Generate DKIM keys for mail server
echo ""
echo "Generating DKIM keys..."
mkdir -p mail-server/keys/dkim

if [ ! -f "mail-server/keys/dkim/private.key" ]; then
    openssl genrsa -out mail-server/keys/dkim/private.key 2048
    openssl rsa -in mail-server/keys/dkim/private.key -pubout -out mail-server/keys/dkim/public.key
    
    # Extract public key for DNS record
    pubkey=$(grep -v '^-' mail-server/keys/dkim/public.key | tr -d '\n')
    echo ""
    print_success "DKIM keys generated"
    echo ""
    echo "Add this DNS TXT record for DKIM:"
    echo "quantum._domainkey.quantummint.net TXT \"v=DKIM1; k=rsa; p=$pubkey\""
    echo ""
else
    print_warning "DKIM keys already exist"
fi

# Check if .env files exist
echo "Checking environment configuration..."
if [ ! -f "mail-server/.env" ]; then
    print_warning "mail-server/.env not found - already created by previous setup"
else
    print_success "mail-server/.env exists"
fi

if [ ! -f "domain-controller/.env" ]; then
    print_warning "domain-controller/.env not found - already created by previous setup"
else
    print_success "domain-controller/.env exists"
fi

# Install shared package dependencies
echo ""
echo "Setting up shared package..."
cd shared
if [ ! -d "node_modules" ]; then
    npm install uuid
    print_success "Shared package dependencies installed"
else
    print_warning "Shared package already initialized"
fi
cd ..

# Install service dependencies (optional)
echo ""
echo "Do you want to install service dependencies now? (y/n)"
read -r install_deps

if [ "$install_deps" = "y" ] || [ "$install_deps" = "Y" ]; then
    echo "Installing mail-server dependencies..."
    cd mail-server
    npm install
    cd ..
    print_success "Mail server dependencies installed"
    
    echo "Installing domain-controller dependencies..."
    cd domain-controller
    npm install
    cd ..
    print_success "Domain controller dependencies installed"
fi

echo ""
echo "========================================="
print_success "Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review and update .env files in mail-server/ and domain-controller/"
echo "2. Start services with: docker-compose -f docker-compose.unified.yml up -d"
echo "3. Or run locally:"
echo "   - Mail Server: cd mail-server && npm start"
echo "   - Domain Controller: cd domain-controller && npm start"
echo ""
echo "Service URLs:"
echo "  - Mail Server:        http://localhost:8082"
echo "  - Domain Controller:  http://localhost:8080"
echo ""
echo "Important Ports:"
echo "  - SMTP:      25, 587, 465"
echo "  - IMAP:      143, 993"
echo "  - POP3:      110, 995"
echo "  - LDAP:      389, 636"
echo "  - Kerberos:  88"
echo "  - DNS:       53"
echo ""

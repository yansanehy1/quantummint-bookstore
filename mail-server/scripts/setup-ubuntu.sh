#!/bin/bash

# QuantumMint Mail Server - Ubuntu Setup Script
# This script prepares an Ubuntu server for the mail-server deployment.

set -e

echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

echo "Installing Docker and Docker Compose..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-compose

echo "Configuring Firewall (UFW)..."
sudo ufw allow ssh
sudo ufw allow 25/tcp    # SMTP
sudo ufw allow 587/tcp   # SMTP Submission
sudo ufw allow 465/tcp   # SMTP Secure
sudo ufw allow 143/tcp   # IMAP
sudo ufw allow 993/tcp   # IMAP Secure
sudo ufw allow 110/tcp   # POP3
sudo ufw allow 995/tcp   # POP3 Secure
sudo ufw allow 80/tcp     # HTTP (Nginx)
sudo ufw allow 443/tcp    # HTTPS (Nginx)
sudo ufw allow 8080/tcp   # Web Interface
sudo ufw allow 8081/tcp   # API
sudo ufw --force enable

echo "Creating project directories..."
mkdir -p data logs certs keys src scripts

echo "Setting permissions..."
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh 2>/dev/null || true

echo "Setup complete! Please ensure your .env file is configured."
echo "You can now start the server with: docker-compose up -d"

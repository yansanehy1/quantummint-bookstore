#!/bin/bash

# deploy-all.sh - QuantumMint Platform Unified Deployment
# This script orchestrates the deployment of all QuantumMint Bookstore services.

set -e

echo "🚀 Starting QuantumMint Platform Unified Deployment"
echo "===================================================="

# 1. Base Infrastructure & Bookstore Core
echo "📦 Step 1: Deploying Base Infrastructure & Core Bookstore..."
./deploy-quantummint-bookstore.sh

# 2. Educational & STEM Services
echo "🧪 Step 2: Deploying STEM & Educational Services..."
cd infrastructure
docker-compose -f docker-compose.yml -f docker-compose.educational.yml up -d --build

# 3. Pay-As-You-Go Billing
echo "💳 Step 3: Deploying PayGO Billing Infrastructure..."
docker-compose -f docker-compose.yml -f docker-compose.paygo.yml up -d --build

# 4. Monitoring & Analytics
echo "📊 Step 4: Starting Platform Monitoring..."
# Monitoring is already included in the main docker-compose.yml

echo "===================================================="
echo "✅ All QuantumMint Platform services have been deployed!"
echo "🌐 Main Storefront: http://localhost:3000"
echo "🛠️  Admin Dashboard: http://localhost:3001"
echo "📈 Monitoring: http://localhost:3002"

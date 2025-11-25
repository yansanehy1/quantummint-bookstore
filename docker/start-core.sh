#!/bin/sh
# Startup script for Core Services Container

echo "Starting Core Services..."

# Start Auth Service on port 3001
echo "Starting Auth Service on port 3001..."
cd /app/services/auth-service && PORT=3001 node dist/index.js &
AUTH_PID=$!

# Start User Service on port 3002
echo "Starting User Service on port 3002..."
cd /app/services/user-service && PORT=3002 node dist/index.js &
USER_PID=$!

# Start Wallet Service on port 3003
echo "Starting Wallet Service on port 3003..."
cd /app/services/wallet-service && PORT=3003 node dist/index.js &
WALLET_PID=$!

# Wait for services to start
sleep 5

# Start API Gateway on port 3000 (main entry point)
echo "Starting API Gateway on port 3000..."
cd /app/api-gateway && PORT=3000 node dist/index.js &
GATEWAY_PID=$!

echo "All core services started!"
echo "Auth Service PID: $AUTH_PID"
echo "User Service PID: $USER_PID"
echo "Wallet Service PID: $WALLET_PID"
echo "API Gateway PID: $GATEWAY_PID"

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?

#!/bin/sh
# Startup script for Business Logic Services Container

echo "Starting Business Logic Services..."

# Start Book Service on port 4001
echo "Starting Book Service on port 4001..."
cd /app/services/book-service && PORT=4001 node dist/index.js &
BOOK_PID=$!

# Start Order Service on port 4002
echo "Starting Order Service on port 4002..."
cd /app/services/order-service && PORT=4002 node dist/index.js &
ORDER_PID=$!

# Start Payment Service on port 4003
echo "Starting Payment Service on port 4003..."
cd /app/services/payment-service && PORT=4003 node dist/webhook-handler.js &
PAYMENT_PID=$!

# Start Gift Service on port 4004
echo "Starting Gift Service on port 4004..."
cd /app/services/gift-service && PORT=4004 node dist/index.js &
GIFT_PID=$!

# Start Seller Service on port 4005
echo "Starting Seller Service on port 4005..."
cd /app/services/seller-service && PORT=4005 node dist/index.js &
SELLER_PID=$!

# Start Referral Service on port 4006
echo "Starting Referral Service on port 4006..."
cd /app/services/referral-service && PORT=4006 node dist/index.js &
REFERRAL_PID=$!

echo "All business logic services started!"
echo "Book Service PID: $BOOK_PID"
echo "Order Service PID: $ORDER_PID"
echo "Payment Service PID: $PAYMENT_PID"
echo "Gift Service PID: $GIFT_PID"
echo "Seller Service PID: $SELLER_PID"
echo "Referral Service PID: $REFERRAL_PID"

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?

#!/bin/sh
# Startup script for Supporting Services Container

echo "Starting Supporting Services..."

# Start Notification Service on port 5001
echo "Starting Notification Service on port 5001..."
cd /app/services/notification-service && PORT=5001 node dist/index.js &
NOTIFICATION_PID=$!

# Start SMS Service on port 5002
echo "Starting SMS Service on port 5002..."
cd /app/services/sms-service && PORT=5002 node dist/app.js &
SMS_PID=$!

# Start Integration Service on port 5003
echo "Starting Integration Service on port 5003..."
cd /app/services/integration-service && PORT=5003 node dist/index.js &
INTEGRATION_PID=$!

# Start Search Service on port 5004
echo "Starting Search Service on port 5004..."
cd /app/services/search-service && PORT=5004 node dist/index.js &
SEARCH_PID=$!

# Start Analytics Service on port 5005
echo "Starting Analytics Service on port 5005..."
cd /app/services/analytics-service && PORT=5005 node dist/index.js &
ANALYTICS_PID=$!

# Start Audio Service on port 5006
echo "Starting Audio Service on port 5006..."
cd /app/services/audio-service && PORT=5006 node dist/index.js &
AUDIO_PID=$!

# Start Moderation Service on port 5007
echo "Starting Moderation Service on port 5007..."
cd /app/services/moderation-service && PORT=5007 node dist/index.js &
MODERATION_PID=$!

# Start Admin Service on port 5008
echo "Starting Admin Service on port 5008..."
cd /app/services/admin-service && PORT=5008 node dist/index.js &
ADMIN_PID=$!

echo "All supporting services started!"
echo "Notification Service PID: $NOTIFICATION_PID"
echo "SMS Service PID: $SMS_PID"
echo "Integration Service PID: $INTEGRATION_PID"
echo "Search Service PID: $SEARCH_PID"
echo "Analytics Service PID: $ANALYTICS_PID"
echo "Audio Service PID: $AUDIO_PID"
echo "Moderation Service PID: $MODERATION_PID"
echo "Admin Service PID: $ADMIN_PID"

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?

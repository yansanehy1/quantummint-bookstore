# video-processor-worker/Dockerfile
FROM nvidia/cuda:12.4.1-runtime-ubuntu24.04 AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt-get clean

WORKDIR /app

# Copy dependencies first
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force

# Copy application code
# Assuming the user group 'node' exists in the base image, or we should create it.
# Actually, the base image is ubuntu, so we should create a user or just use root for now if unsure.
# But let's follow the user's suggestion if it makes sense.
# Most nvidia/cuda images don't have a 'node' user by default.
RUN groupadd -r node && useradd -r -g node node

COPY --chown=node:node . .

# Create necessary directories
RUN mkdir -p /app/logs /tmp/ffmpeg && chown -R node:node /app

# Health check via Redis queue status
HEALTHCHECK --interval=30s --timeout=10s \
  CMD node -e "require('redis').createClient({url: process.env.REDIS_URL}).connect().then(c=>c.ping().then(()=>process.exit(0)))" || exit 1

USER node

CMD ["node", "worker.js"]

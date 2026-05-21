# video-api/Dockerfile
FROM node:20-alpine AS base

# Install runtime dependencies
RUN apk add --no-cache \
    ffmpeg \
    curl \
    tini \
    && addgroup -g 1001 nodejs \
    && adduser -S -u 1001 nodejs

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

# Use tini as init system for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Run as non-root user
USER nodejs

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]

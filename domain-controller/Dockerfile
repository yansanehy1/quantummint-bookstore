FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY domain-controller/package*.json ./
RUN npm install --only=production && npm cache clean --force

# Ensure @quantummint/shared is a real directory (not a symlink created by npm)
RUN rm -rf node_modules/@quantummint/shared
COPY shared ./node_modules/@quantummint/shared

# Copy application code
COPY domain-controller/src ./src
COPY domain-controller/scripts ./scripts
COPY domain-controller/*.js ./

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S domaincontroller -u 1001

# Change ownership of app directory
RUN chown -R domaincontroller:nodejs /app

# Switch to non-root user
USER domaincontroller

# Expose ports
EXPOSE 389 636 88 53 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["dumb-init", "node", "src/server.js"]

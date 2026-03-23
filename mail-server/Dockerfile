# QuantumMint Mail Server Dockerfile
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S quantummail && \
    adduser -S quantummail -u 1001 -G quantummail

WORKDIR /app

# Copy package files and install dependencies with retry logic
COPY package*.json ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm install --only=production --verbose && npm cache clean --force

# Ensure @quantummint/shared is a real directory (not a symlink created by npm)
RUN rm -rf node_modules/@quantummint/shared
COPY shared ./node_modules/@quantummint/shared

# Copy service source with correct ownership
COPY --chown=quantummail:quantummail src ./src
COPY --chown=quantummail:quantummail scripts ./scripts
COPY --chown=quantummail:quantummail *.js ./

# Create necessary directories with correct ownership (avoid recursive chown)
RUN mkdir -p logs certs uploads && \
    chown quantummail:quantummail logs certs uploads . && \
    chown quantummail:quantummail package*.json

# Switch to non-root user
USER quantummail

# Expose ports
EXPOSE 3006 25 587 465 143 993 110 995

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3006/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["dumb-init", "node", "src/server.js"]

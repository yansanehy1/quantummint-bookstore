FROM node:18-alpine

RUN apk add --no-cache python3 make g++ ffmpeg libgomp bash

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p /var/www/videos /var/www/uploads /app/logs
RUN chown -R node:node /app /var/www

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js

CMD ["node", "server.js"]

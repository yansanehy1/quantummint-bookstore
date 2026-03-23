FROM node:18-alpine

RUN apk add --no-cache ffmpeg bash

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
FROM node:18-alpine

RUN apk add --no-cache ffmpeg bash

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

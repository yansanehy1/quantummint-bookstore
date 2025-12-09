# QuantumMint Self-Hosted Video Platform

A complete, self-hosted video processing and streaming solution designed to replace AWS MediaConvert/CloudFront.

## Features

- **Core Processing**: FFmpeg-based multi-quality encoding (HLS, MP4).
- **Streaming Server**: Node.js-based HLS/DASH server with adaptive bitrate streaming.
- **Upload System**: Chunked, resumable uploads for large files.
- **Custom Player**: HTML5 player with quality selection, cost tracking, and interactive overlays.
- **Monitoring**: Real-time WebSocket-based dashboard.

## Prerequisites

- Node.js v18+
- FFmpeg (installed and in PATH)
- Redis (for job queues)

## Quick Start

1. **Setup Environment**:
   ```bash
   # Linux/Mac
   ./setup-video-platform.sh
   
   # Windows
   .\setup-video-platform.bat
   ```

2. **Start Server**:
   ```bash
   cd video-processor
   npm start
   ```

3. **Access Interfaces**:
   - **Player Demo**: [http://localhost:3000/video-player.html](http://localhost:3000/video-player.html)
   - **Upload Test**: [http://localhost:3000/upload-test.html](http://localhost:3000/upload-test.html)
   - **Monitoring**: [http://localhost:3000/monitor](http://localhost:3000/monitor) (WebSocket)

## Architecture

- `video-processor/core.js`: FFmpeg wrapper for analysis and encoding.
- `video-processor/streaming-server.js`: Handles HLS playlist and segment delivery.
- `video-processor/upload-manager.js`: Manages chunked uploads and file assembly.
- `video-processor/server.js`: Main Express application and API gateway.

## Configuration

Edit `video-processor/.env` to configure ports, storage paths, and Redis connection.

## API Endpoints

- `POST /api/upload/init`: Initialize upload session.
- `POST /api/upload/chunk/:uploadId`: Upload a file chunk.
- `GET /api/videos/:jobId/status`: Check processing status.
- `GET /stream/:videoId/master.m3u8`: HLS Master Playlist.

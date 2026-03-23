// streaming-server/server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { createClient } = require('redis');

const PORT = process.env.PORT || 8000;
const VIDEO_DIR = process.env.VIDEO_DIR || '/var/www/videos';

// Redis for session tracking/auth
const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redis.connect().catch(console.error);

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/health') {
        res.writeHead(200);
        res.end('healthy');
        return;
    }

    // Basic static file serving for HLS segments
    // In production, Nginx handles this, but this node server handles auth/logic
    // For this setup, we'll assume Nginx proxies requests here if it can't serve static files
    // OR this server handles specific logic.
    // Given the Nginx config provided, Nginx handles /stream/ static files directly for performance
    // But let's implement a fallback or specific logic endpoints if needed.

    // Actually, the user's Nginx config proxies /stream/ to this server.
    // So this server MUST serve the files.

    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    // Regex for stream path: /stream/:videoId/...
    const match = pathname.match(/^\/stream\/([^\/]+)\/(.+)$/);
    if (!match) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const videoId = match[1];
    const relativePath = match[2];
    const filePath = path.join(VIDEO_DIR, 'encoded', videoId, relativePath); // Adjust based on actual structure

    // Basic Auth Check (Token)
    // const token = req.headers.authorization;
    // if (!await verifyToken(token)) ...

    try {
        const stats = await fs.promises.stat(filePath);

        // Handle Range Requests
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': getContentType(filePath),
            });
            file.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': stats.size,
                'Content-Type': getContentType(filePath),
            });
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (err) {
        console.error('File error:', err);
        res.writeHead(404);
        res.end('File not found');
    }
});

function getContentType(filePath) {
    const ext = path.extname(filePath);
    switch (ext) {
        case '.m3u8': return 'application/vnd.apple.mpegurl';
        case '.ts': return 'video/MP2T';
        case '.mp4': return 'video/mp4';
        default: return 'application/octet-stream';
    }
}

server.listen(PORT, () => {
    console.log(`Streaming server listening on port ${PORT}`);
});

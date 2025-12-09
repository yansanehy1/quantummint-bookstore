// video-processor/streaming-server.js - Pure Node.js HLS/DASH server
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

class QuantumStreamingServer {
    constructor(config = {}) {
        this.config = {
            port: config.port || 8000,
            sslPort: config.sslPort || 8443,
            videoDir: config.videoDir || path.join(__dirname, '../videos'),
            maxChunkSize: config.maxChunkSize || 1024 * 1024, // 1MB chunks
            cacheControl: config.cacheControl || 'public, max-age=31536000',
            enableSSL: config.enableSSL || false,
            sslKey: config.sslKey || null,
            sslCert: config.sslCert || null,
            ...config
        };

        this.mimeTypes = {
            '.m3u8': 'application/vnd.apple.mpegurl',
            '.mpd': 'application/dash+xml',
            '.ts': 'video/MP2T',
            '.m4s': 'video/iso.segment',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.vtt': 'text/vtt',
            '.srt': 'text/plain'
        };

        this.accessTokens = new Map();
        this.playbackSessions = new Map();
        this.rateLimits = new Map();

        this.initServer();
    }

    initServer() {
        const requestHandler = this.handleRequest.bind(this);

        // Create HTTP server
        this.httpServer = http.createServer(requestHandler);

        // Create HTTPS server if SSL enabled
        if (this.config.enableSSL && this.config.sslKey && this.config.sslCert) {
            try {
                const sslOptions = {
                    key: fs.readFileSync(this.config.sslKey),
                    cert: fs.readFileSync(this.config.sslCert)
                };
                this.httpsServer = https.createServer(sslOptions, requestHandler);
            } catch (error) {
                console.warn('Failed to load SSL certificates, HTTPS disabled:', error.message);
                this.config.enableSSL = false;
            }
        }

        this.setupRoutes();
    }

    setupRoutes() {
        // Route patterns
        this.routes = [
            { pattern: /^\/stream\/([a-f0-9]+)\/master\.m3u8$/, handler: this.serveHLSMaster.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/variant\/([a-z0-9]+)\.m3u8$/, handler: this.serveHLSVariant.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/segment\/([a-z0-9]+)\/(segment_\d+\.ts)$/, handler: this.serveHLSSegment.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/dash\.mpd$/, handler: this.serveDASHManifest.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/dash\/([a-z0-9]+)\/(\d+)\.m4s$/, handler: this.serveDASHSegment.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/mp4\/([a-z0-9]+)\.mp4$/, handler: this.serveMP4.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/thumbnail\/(\d+)\.jpg$/, handler: this.serveThumbnail.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/preview\.mp4$/, handler: this.servePreview.bind(this) },
            { pattern: /^\/stream\/([a-f0-9]+)\/info$/, handler: this.serveVideoInfo.bind(this) },
            { pattern: /^\/auth\/token\/([a-f0-9]+)$/, handler: this.generateAccessToken.bind(this) },
            { pattern: /^\/health$/, handler: this.healthCheck.bind(this) }
        ];
    }

    start() {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(this.config.port, () => {
                console.log(`QuantumStreaming HTTP server listening on port ${this.config.port}`);

                if (this.httpsServer && this.config.enableSSL) {
                    this.httpsServer.listen(this.config.sslPort, () => {
                        console.log(`QuantumStreaming HTTPS server listening on port ${this.config.sslPort}`);
                        resolve();
                    }).on('error', reject);
                } else {
                    resolve();
                }
            }).on('error', reject);
        });
    }

    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url);
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Rate limiting
        if (!this.checkRateLimit(clientIP)) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Too many requests' }));
            return;
        }

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Find matching route
        for (const route of this.routes) {
            const match = parsedUrl.pathname.match(route.pattern);
            if (match) {
                try {
                    await route.handler(req, res, match, clientIP);
                } catch (error) {
                    console.error(`Error handling ${req.url}:`, error);
                    if (!res.headersSent) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    }
                }
                return;
            }
        }

        // No route matched
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }

    async serveHLSMaster(req, res, match, clientIP) {
        const videoId = match[1];
        const token = req.headers.authorization?.replace('Bearer ', '');

        // Verify access
        if (!this.verifyAccess(videoId, token)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Access denied' }));
            return;
        }

        const masterPath = path.join(this.config.videoDir, 'encoded', videoId, 'hls', 'master_enhanced.m3u8');

        try {
            await fs.promises.access(masterPath);

            const stats = await fs.promises.stat(masterPath);
            const fileStream = fs.createReadStream(masterPath);

            res.writeHead(200, {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Content-Length': stats.size,
                'Cache-Control': this.config.cacheControl
            });

            fileStream.pipe(res);

            // Track playback
            this.trackPlayback(videoId, clientIP, 'hls_master');

        } catch (error) {
            // Try fallback to standard master.m3u8
            const fallbackPath = path.join(this.config.videoDir, 'encoded', videoId, 'hls', 'master.m3u8');
            try {
                await fs.promises.access(fallbackPath);
                const stats = await fs.promises.stat(fallbackPath);
                const fileStream = fs.createReadStream(fallbackPath);

                res.writeHead(200, {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Content-Length': stats.size,
                    'Cache-Control': this.config.cacheControl
                });
                fileStream.pipe(res);
            } catch (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'HLS master not found' }));
            }
        }
    }

    async serveHLSVariant(req, res, match, clientIP) {
        const videoId = match[1];
        const quality = match[2];
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!this.verifyAccess(videoId, token)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Access denied' }));
            return;
        }

        const variantPath = path.join(this.config.videoDir, 'encoded', videoId, 'hls', quality, 'playlist.m3u8');

        try {
            let content = await fs.promises.readFile(variantPath, 'utf8');

            // Dynamically adjust playlist for adaptive streaming
            const networkConditions = this.getNetworkConditions(clientIP);
            if (networkConditions.bandwidth < 5000000 && quality === '1080p') {
                // Suggest lower quality for slow connections
                content = content.replace('EXTM3U', 'EXTM3U\nEXT-X-SUGGESTION-BANDWIDTH:2500000');
            }

            res.writeHead(200, {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Content-Length': Buffer.byteLength(content),
                'Cache-Control': 'public, max-age=30' // Shorter cache for playlists
            });

            res.end(content);

            this.trackPlayback(videoId, clientIP, `hls_${quality}`);

        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Variant playlist not found' }));
        }
    }

    async serveHLSSegment(req, res, match, clientIP) {
        const videoId = match[1];
        const quality = match[2];
        const segmentFile = match[3];
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!this.verifyAccess(videoId, token)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Access denied' }));
            return;
        }

        const segmentPath = path.join(this.config.videoDir, 'encoded', videoId, 'hls', quality, segmentFile);

        try {
            const stats = await fs.promises.stat(segmentPath);

            // Handle range requests (for seeking)
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
                const chunksize = (end - start) + 1;

                const fileStream = fs.createReadStream(segmentPath, { start, end });

                res.writeHead(206, {
                    'Content-Type': 'video/MP2T',
                    'Content-Length': chunksize,
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': this.config.cacheControl
                });

                fileStream.pipe(res);
            } else {
                const fileStream = fs.createReadStream(segmentPath);

                res.writeHead(200, {
                    'Content-Type': 'video/MP2T',
                    'Content-Length': stats.size,
                    'Cache-Control': this.config.cacheControl
                });

                fileStream.pipe(res);
            }

            // Track segment delivery for analytics
            this.trackSegmentDelivery(videoId, quality, clientIP, segmentFile);

        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Segment not found' }));
        }
    }

    // Placeholder for DASH methods
    async serveDASHManifest(req, res) { res.status(501).end(); }
    async serveDASHSegment(req, res) { res.status(501).end(); }

    async serveMP4(req, res, match, clientIP) {
        const videoId = match[1];
        const quality = match[2];
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!this.verifyAccess(videoId, token)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Access denied' }));
            return;
        }

        const mp4Path = path.join(this.config.videoDir, 'encoded', videoId, 'mp4', `${quality}.mp4`);

        try {
            const stats = await fs.promises.stat(mp4Path);
            const fileStream = fs.createReadStream(mp4Path);

            // Set content-disposition for downloads
            const contentDisposition = req.headers['x-force-download']
                ? `attachment; filename="${videoId}_${quality}.mp4"`
                : 'inline';

            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': stats.size,
                'Content-Disposition': contentDisposition,
                'Cache-Control': this.config.cacheControl
            });

            fileStream.pipe(res);

        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'MP4 file not found' }));
        }
    }

    async serveThumbnail(req, res, match, clientIP) {
        const videoId = match[1];
        const thumbIndex = match[2];

        // Thumbnails are publicly accessible (no auth needed)
        const thumbPath = path.join(this.config.videoDir, 'encoded', videoId, 'thumbnails', `thumb_${thumbIndex}.jpg`);

        try {
            const stats = await fs.promises.stat(thumbPath);
            const fileStream = fs.createReadStream(thumbPath);

            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': stats.size,
                'Cache-Control': this.config.cacheControl
            });

            fileStream.pipe(res);

        } catch (error) {
            // Serve default thumbnail
            const defaultThumb = path.join(__dirname, '../public/assets/default-thumbnail.jpg');
            try {
                const stats = await fs.promises.stat(defaultThumb);
                const fileStream = fs.createReadStream(defaultThumb);

                res.writeHead(200, {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': stats.size,
                    'Cache-Control': this.config.cacheControl
                });

                fileStream.pipe(res);
            } catch (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Thumbnail not found' }));
            }
        }
    }

    async servePreview(req, res, match, clientIP) {
        const videoId = match[1];
        const previewPath = path.join(this.config.videoDir, 'encoded', videoId, 'preview.mp4');

        try {
            const stats = await fs.promises.stat(previewPath);
            const fileStream = fs.createReadStream(previewPath);

            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': stats.size,
                'Cache-Control': this.config.cacheControl
            });

            fileStream.pipe(res);
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Preview not found' }));
        }
    }

    async serveVideoInfo(req, res, match) {
        // Placeholder for video info
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ info: 'Video info placeholder' }));
    }

    async generateAccessToken(req, res, match) {
        const videoId = match[1];
        const userId = req.headers['x-user-id'];
        const sessionId = req.headers['x-session-id'];

        if (!userId || !sessionId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user or session ID' }));
            return;
        }

        // Generate access token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour

        this.accessTokens.set(token, {
            videoId,
            userId,
            sessionId,
            expiresAt,
            issuedAt: Date.now()
        });

        // Cleanup expired tokens periodically
        this.cleanupExpiredTokens();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            token,
            expiresAt: new Date(expiresAt).toISOString(),
            videoId,
            streamingUrl: `/stream/${videoId}/master.m3u8`
        }));
    }

    verifyAccess(videoId, token) {
        if (!token) return false;

        // For development/testing, accept 'test-token'
        if (token === 'test-token') return true;

        const tokenData = this.accessTokens.get(token);
        if (!tokenData) return false;

        if (tokenData.expiresAt < Date.now()) {
            this.accessTokens.delete(token);
            return false;
        }

        if (tokenData.videoId !== videoId) return false;

        return true;
    }

    checkRateLimit(clientIP) {
        const now = Date.now();
        const windowStart = now - 60000; // 1 minute window

        if (!this.rateLimits.has(clientIP)) {
            this.rateLimits.set(clientIP, []);
        }

        const requests = this.rateLimits.get(clientIP);

        // Remove old requests
        while (requests.length > 0 && requests[0] < windowStart) {
            requests.shift();
        }

        // Check limit (100 requests per minute)
        if (requests.length >= 100) {
            return false;
        }

        requests.push(now);
        return true;
    }

    trackPlayback(videoId, clientIP, type) {
        const sessionId = `${videoId}_${clientIP}_${Date.now()}`;

        if (!this.playbackSessions.has(sessionId)) {
            this.playbackSessions.set(sessionId, {
                videoId,
                clientIP,
                startTime: Date.now(),
                lastActivity: Date.now(),
                events: [],
                bytesTransferred: 0
            });
        }

        const session = this.playbackSessions.get(sessionId);
        session.lastActivity = Date.now();
        session.events.push({ type, timestamp: Date.now() });
    }

    trackSegmentDelivery(videoId, quality, clientIP, segmentFile) {
        // Find session for this client/video
        for (const [sessionId, session] of this.playbackSessions.entries()) {
            if (session.videoId === videoId && session.clientIP === clientIP) {
                const segmentSize = 1024 * 1024; // Approximate size, could get actual size
                session.bytesTransferred += segmentSize;
                session.events.push({
                    type: 'segment_delivered',
                    quality,
                    segment: segmentFile,
                    timestamp: Date.now(),
                    size: segmentSize
                });
                break;
            }
        }
    }

    getNetworkConditions(clientIP) {
        // Simplified network estimation
        return {
            bandwidth: 5000000, // 5 Mbps default
            latency: 50, // 50ms default
            packetLoss: 0.01 // 1% default
        };
    }

    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, data] of this.accessTokens.entries()) {
            if (data.expiresAt < now) {
                this.accessTokens.delete(token);
            }
        }
    }

    async healthCheck(req, res) {
        const health = {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            stats: {
                activeSessions: this.playbackSessions.size,
                accessTokens: this.accessTokens.size,
                rateLimitedIPs: this.rateLimits.size
            }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health));
    }
}

module.exports = QuantumStreamingServer;

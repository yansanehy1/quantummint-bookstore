// video-processor/server.js
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

// Import core components
const QuantumVideoProcessor = require('./core');
const QuantumStreamingServer = require('./streaming-server');
const QuantumUploadManager = require('./upload-manager');
const QuantumVideoMonitor = require('./monitor');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Configuration
const CONFIG = {
    port: process.env.PORT || 3000,
    streamPort: process.env.STREAM_PORT || 8000,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    storageDir: process.env.VIDEO_STORAGE || path.join(__dirname, '../videos'),
    tempDir: process.env.TEMP_DIR || path.join(__dirname, '../temp')
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Initialize Components
const videoProcessor = new QuantumVideoProcessor({
    storageDir: CONFIG.storageDir,
    tempDir: CONFIG.tempDir
});

const streamingServer = new QuantumStreamingServer({
    port: CONFIG.streamPort,
    videoDir: CONFIG.storageDir
});

const uploadManager = new QuantumUploadManager({
    uploadDir: path.join(CONFIG.storageDir, 'originals'),
    tempDir: path.join(CONFIG.tempDir, 'uploads')
});

const monitor = new QuantumVideoMonitor(server, videoProcessor, uploadManager);

// Upload Handling
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload/init', async (req, res) => {
    try {
        const result = await uploadManager.initUpload(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upload/chunk/:uploadId', upload.single('chunk'), async (req, res) => {
    try {
        const { uploadId } = req.params;
        const chunkIndex = parseInt(req.body.index);

        if (!req.file) throw new Error('No chunk data provided');

        const result = await uploadManager.handleChunk(uploadId, chunkIndex, req.file.buffer);

        // If upload is completed, trigger processing
        if (result.status === 'completed') {
            // Trigger video processing
            const jobId = await videoProcessor.processVideo(result.filePath, {
                outputFormats: ['hls', 'mp4'],
                qualities: ['360p', '480p', '720p', '1080p'],
                generateThumbnails: true,
                generatePreview: true
            });

            result.jobId = jobId;
        }

        res.json(result);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Video Management APIs
app.get('/api/videos/:jobId/status', async (req, res) => {
    const status = await videoProcessor.getJobStatus(req.params.jobId);
    res.json(status);
});

app.get('/api/videos/:videoId/playback-token', (req, res) => {
    // In a real app, verify user session/entitlements here
    // For now, proxy to streaming server's auth endpoint
    // Or generate token directly if sharing secret

    // Mock response redirecting to streaming server auth
    res.redirect(`http://localhost:${CONFIG.streamPort}/auth/token/${req.params.videoId}`);
});

// Serve static files (player, etc)
app.use(express.static(path.join(__dirname, '../public')));

// Start services
async function start() {
    try {
        // Start streaming server
        await streamingServer.start();

        // Start API server
        server.listen(CONFIG.port, () => {
            console.log(`QuantumVideo API Server running on port ${CONFIG.port}`);
            console.log(`Monitoring dashboard available at http://localhost:${CONFIG.port}/monitor`);
        });

    } catch (error) {
        console.error('Failed to start services:', error);
        process.exit(1);
    }
}

start();

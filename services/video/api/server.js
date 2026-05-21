// video-api/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const { register, metrics } = require('./metrics');

const app = express();
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const PORT = process.env.PORT || 3000;
const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
}

// Security middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Auth middleware
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }
    try {
        const token = authHeader.substring(7);
        if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

        req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        
        if (!req.user.id) throw new Error('JWT missing id');
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Validators
const InitUploadSchema = z.object({
    filename: z.string().regex(/^[a-zA-Z0-9._-]+$/).max(255),
    size: z.number().positive().max(5 * 1024 * 1024 * 1024),
    totalChunks: z.number().positive().max(10000),
    userId: z.string().uuid(),
    bookId: z.string().uuid().optional()
});

const ChunkUploadSchema = z.object({
    index: z.number().nonnegative(),
    size: z.number().positive().max(5 * 1024 * 1024)
});

// Redis Client with error handling
let redis;
const isTest = process.env.NODE_ENV === 'test' || process.env.DISABLE_REDIS === 'true';
if (!isTest) {
    (async () => {
        redis = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 500) }
        });
        redis.on('error', (err) => console.error('Redis error:', err));
        await redis.connect();
    })();
} else {
    console.warn('Redis disabled for test mode (video api)');
}


// Upload Configuration - disk-based with size limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '/tmp/'),
    filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex'))
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // Allow only video files
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../uploads');
const TEMP_DIR = path.join(UPLOAD_DIR, 'temp');

// Validate base path
if (!path.resolve(UPLOAD_DIR).startsWith('/')) {
    throw new Error('UPLOAD_DIR must be absolute path');
}

// Ensure directories
(async () => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(TEMP_DIR, { recursive: true });
})();

// Upload Manager with security checks
class UploadManager {
    async initUpload(userId, metadata) {
        const parseResult = InitUploadSchema.safeParse(metadata);
        if (!parseResult.success) throw new Error('Invalid upload metadata');
        
        const uploadId = crypto.randomBytes(16).toString('hex');
        const uploadPath = path.join(TEMP_DIR, uploadId);
        
        // Prevent directory traversal
        const resolvedPath = path.resolve(uploadPath);
        if (!resolvedPath.startsWith(path.resolve(TEMP_DIR))) {
            throw new Error('Invalid upload path');
        }
        
        await fs.mkdir(resolvedPath, { recursive: true });

        const state = {
            id: uploadId,
            userId,
            bookId: metadata.bookId,
            filename: metadata.filename,
            size: metadata.size,
            totalChunks: metadata.totalChunks,
            uploadedSize: 0,
            chunks: [],
            status: 'uploading',
            createdAt: Date.now(),
            startTime: Date.now()
        };

        await this.saveState(uploadId, state);

        // Record metrics
        metrics.uploadSize.inc({ user_id: userId }, metadata.size);

        // Persistent record in PostgreSQL
        await pgPool.query(
            'INSERT INTO video_jobs (id, user_id, book_id, original_filename, input_path, status, encoding_options) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [uploadId, userId, metadata.bookId, metadata.filename, uploadPath, 'queued', JSON.stringify({ qualities: metadata.qualities || [] })]
        );

        return { uploadId, chunkSize: 5 * 1024 * 1024, expiresIn: 86400 };
    }

    async handleChunk(userId, uploadId, index, buffer) {
        const state = await this.getState(uploadId);
        if (!state) throw new Error('Upload not found');
        if (state.userId !== userId) throw new Error('Unauthorized');
        if (index >= state.totalChunks) throw new Error('Invalid chunk index');
        if (buffer.length > 5 * 1024 * 1024) throw new Error('Chunk too large');

        const chunkPath = path.join(TEMP_DIR, uploadId, `chunk_${index}`);
        const resolvedPath = path.resolve(chunkPath);
        if (!resolvedPath.startsWith(path.resolve(TEMP_DIR))) {
            throw new Error('Invalid chunk path');
        }
        
        await fs.writeFile(resolvedPath, buffer);
        state.chunks.push({ index });
        state.uploadedSize += buffer.length;
        await this.saveState(uploadId, state);

        if (state.chunks.length === state.totalChunks) {
            return await this.finalizeUpload(uploadId, state);
        }

        return { status: 'uploading', progress: Math.round((state.uploadedSize / state.size) * 100) };
    }

    async finalizeUpload(uploadId, state) {
        // Sanitize filename to prevent path injection
        const safeFilename = `${uploadId}_${Date.now()}.mp4`;
        const finalPath = path.join(UPLOAD_DIR, safeFilename);
        const resolvedFinal = path.resolve(finalPath);
        
        if (!resolvedFinal.startsWith(path.resolve(UPLOAD_DIR))) {
            throw new Error('Invalid final path');
        }

        const writeStream = require('fs').createWriteStream(resolvedFinal);
        state.chunks.sort((a, b) => a.index - b.index);

        for (const chunk of state.chunks) {
            const chunkPath = path.resolve(path.join(TEMP_DIR, uploadId, `chunk_${chunk.index}`));
            if (!chunkPath.startsWith(path.resolve(TEMP_DIR))) {
                throw new Error('Invalid chunk path detected');
            }
            const data = await fs.readFile(chunkPath);
            writeStream.write(data);
        }
        writeStream.end();

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        
        // Record metrics
        const duration = (Date.now() - state.startTime) / 1000;
        metrics.uploadDuration.observe({ status: 'success' }, duration);

        // Cleanup temp directory
        try {
            await fs.rm(path.join(TEMP_DIR, uploadId), { recursive: true, force: true });
        } catch (e) {
            console.warn('Failed to cleanup temp dir:', e);
        }

        return { status: 'completed', filePath: `/videos/${safeFilename}` };
    }

    async saveState(id, state) {
        if (!redis) throw new Error('Redis unavailable');
        await redis.set(`upload:${id}`, JSON.stringify(state), { EX: 86400 });
    }

    async getState(id) {
        if (!redis) throw new Error('Redis unavailable');
        const data = await redis.get(`upload:${id}`);
        return data ? JSON.parse(data) : null;
    }

    async cleanup(uploadId) {
        if (!redis) return;
        await redis.del(`upload:${uploadId}`);
        try {
            await fs.rm(path.join(TEMP_DIR, uploadId), { recursive: true, force: true });
        } catch (e) {
            console.warn('Cleanup failed:', e);
        }
    }
}

const uploadManager = new UploadManager();

// Routes
app.post('/api/upload/init', authenticateUser, async (req, res) => {
    try {
        const result = await uploadManager.initUpload(req.user.id, req.body);
        res.status(201).json(result);
    } catch (e) {
        console.error('Upload init error:', e.message);
        res.status(400).json({ error: 'Invalid upload request' });
    }
});

app.post('/api/upload/chunk/:uploadId', authenticateUser, upload.single('chunk'), async (req, res) => {
    try {
        const parseResult = ChunkUploadSchema.safeParse({
            index: parseInt(req.body.index),
            size: req.file?.size
        });
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid chunk data' });
        }

        const result = await uploadManager.handleChunk(
            req.user.id,
            req.params.uploadId,
            parseResult.data.index,
            req.file.buffer
        );

        if (result.status === 'completed') {
            const state = await uploadManager.getState(req.params.uploadId);
            const jobId = crypto.randomBytes(8).toString('hex');
            if (redis) {
                await redis.lPush('video:queue', JSON.stringify({
                    id: jobId,
                    userId: req.user.id,
                    bookId: state?.bookId,
                    inputPath: result.filePath,
                    options: {
                        outputFormats: ['hls', 'mp4'],
                        qualities: ['480p', '720p', '1080p']
                    }
                }));
                result.jobId = jobId;
            }
        }

        res.json(result);
    } catch (e) {
        console.error('Chunk upload error:', e.message);
        res.status(400).json({ error: 'Chunk upload failed' });
    }
});

// Internal endpoint for Nginx auth_request (not exposed to clients)
app.post('/auth/verify', async (req, res) => {
    const token = req.headers['x-user-token']?.replace('Bearer ', '');
    const originalUri = req.headers['x-original-uri'];
    
    if (!token) {
        return res.status(401).end();
    }
    
    try {
        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        
        // Check if user has access to requested video
        // Extract videoId from URI: /stream/{videoId}/...
        const videoIdMatch = originalUri?.match(/\/stream\/([a-f0-9]+)/);
        if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            // Query database: does user own/have access to this video?
            const hasAccess = await checkVideoAccess(decoded.id, videoId);
            if (!hasAccess) {
                return res.status(403).end();
            }
        }
        
        // Auth successful
        res.status(200).end();
    } catch (err) {
        console.error('Auth verify error:', err.message);
        res.status(401).end();
    }
});

// Prometheus metrics endpoint (protected)
app.get('/metrics', async (req, res) => {
    try {
        // Update dynamic metrics
        metrics.queueDepth.set(await getQueueDepth());
        
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err.message);
    }
});

// Helper: Check video access
async function checkVideoAccess(userId, videoId) {
    const result = await pgPool.query(
        `SELECT 1 FROM video_jobs 
         WHERE id = $1 AND (user_id = $2 OR status = 'public') 
         LIMIT 1`,
        [videoId, userId]
    );
    return result.rowCount > 0;
}

// Helper: Get queue depth from Redis
async function getQueueDepth() {
    if (!redis) return 0;
    try {
        return await redis.lLen('video:queue');
    } catch (e) {
        return 0;
    }
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Cleanup & Maintenance Cron (Runs daily at 3 AM)
cron.schedule('0 3 * * *', async () => {
    console.log('🧹 Running Video Service Cleanup...');
    try {
        const now = Date.now();
        const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

        // 1. Cleanup expired temp upload directories
        const tempDirs = await fs.readdir(TEMP_DIR);
        for (const dir of tempDirs) {
            const dirPath = path.join(TEMP_DIR, dir);
            const stats = await fs.stat(dirPath);
            if (now - stats.mtimeMs > EXPIRY_MS) {
                await fs.rm(dirPath, { recursive: true, force: true });
                console.log(`Removed expired temp upload: ${dir}`);
            }
        }

        // 2. Cleanup stale Redis upload states
        if (redis) {
            const keys = await redis.keys('upload:*');
            for (const key of keys) {
                const ttl = await redis.ttl(key);
                if (ttl <= 0) {
                    await redis.del(key);
                }
            }
        }

        // 3. Process Dead Letter Queue (optional: notify admins)
        if (redis) {
            const failedCount = await redis.lLen('video:failed');
            if (failedCount > 0) {
                console.warn(`⚠️ There are ${failedCount} failed video jobs in DLQ`);
            }
        }

    } catch (e) {
        console.error('Cleanup job failed:', e);
    }
});

if (!isTest) {
    app.listen(PORT, '127.0.0.1', () => console.log(`Video API running on port ${PORT}`));
}

module.exports = { app, UploadManager };


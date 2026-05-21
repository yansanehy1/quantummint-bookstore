import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { analyzePitchHz, analyzeSpectralTilt, analyzeVoiceQuality } from './signal.js';
import { uploadToStorage, deleteFromStorage } from './storage.js';

// ===== Configuration =====
const config = {
    port: parseInt(process.env.PORT || '7002'),
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    uploadDir: process.env.UPLOAD_DIR || '/tmp/voice-uploads',
    maxFileSize: parseInt(process.env.MAX_UPLOAD_SIZE || '10485760'), // 10MB
    allowedMimeTypes: ['audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/mp3', 'audio/flac'],
    minSampleDuration: 2,  // seconds
    maxSampleDuration: 30,
    minSamples: 1,
    maxSamples: 3
};

// ===== Database & Redis =====
const pool = new Pool({ connectionString: config.databaseUrl });
const redis = createClient({ url: config.redisUrl });

// ===== Validation Schemas =====
const enrollmentSchema = z.object({
    educatorId: z.string().uuid(),
    language: z.string().length(2).optional().default('en'),
    provider: z.enum(['internal', 'elevenlabs', 'playht']).optional().default('internal')
});

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: string;
                email?: string;
            };
        }
    }
}

// ===== Authentication Middleware =====
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    const token = authHeader.substring(7);
    try {
        if (!config.jwtSecret) throw new Error('JWT_SECRET not configured');
        const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as Express.Request['user'];
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

async function cleanupFiles(files: Express.Multer.File[]): Promise<void> {
    for (const file of files) {
        try {
            await fs.unlink(file.path);
        } catch (err) {
            console.warn('Failed to cleanup file:', file.path, err);
        }
    }
}

export function createApp() {
    const app = express();

    // Security middleware
    app.set('trust proxy', 1);
    app.use(helmet());
    app.use(cors({
        origin: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173',
        methods: ['POST', 'GET', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express.json({ limit: '200kb' }));

    // Rate limiting
    const enrollmentLimiter = rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 5,
        message: { error: 'Too many enrollment attempts. Try again later.' }
    });

    // Multer Configuration
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            await fs.mkdir(config.uploadDir, { recursive: true });
            cb(null, config.uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${uuid()}${ext}`);
        }
    });

    const upload = multer({
        storage,
        limits: { fileSize: config.maxFileSize, files: config.maxSamples }
    });

    // Health Check
    app.get('/health', async (req: Request, res: Response) => {
        try {
            await pool.query('SELECT 1');
            // Check redis connection if client is open
            if (redis.isOpen) {
                await redis.ping();
            }
            res.json({
                status: 'healthy',
                service: 'voice-profile-service',
                timestamp: new Date().toISOString(),
                checks: {
                    database: 'up',
                    redis: redis.isOpen ? 'up' : 'down'
                }
            });
        } catch (e) {
            res.status(503).json({ 
                status: 'unhealthy', 
                error: e instanceof Error ? e.message : 'Unknown error'
            });
        }
    });

    // Routes
    app.post('/voice-profile/enroll',
        authenticateToken,
        enrollmentLimiter,
        upload.array('samples', config.maxSamples),
        async (req: Request, res: Response) => {
            const files = (req.files ?? []) as Express.Multer.File[];
            try {
                const validation = enrollmentSchema.safeParse(req.body);
                if (!validation.success) {
                    await cleanupFiles(files);
                    return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
                }

                const { educatorId, language, provider } = validation.data;
                if (req.user.id !== educatorId && req.user.role !== 'admin') {
                    await cleanupFiles(files);
                    return res.status(403).json({ error: 'Forbidden' });
                }

                if (!files.length) {
                    return res.status(400).json({ error: 'Samples required' });
                }

                const firstSample = files[0];
                const [pitch, tilt, quality] = await Promise.all([
                    analyzePitchHz(firstSample.path),
                    analyzeSpectralTilt(firstSample.path),
                    analyzeVoiceQuality(firstSample.path)
                ]);

                if (!pitch) {
                    await cleanupFiles(files);
                    return res.status(400).json({ error: 'Pitch not detected' });
                }

                const profileId = uuid();
                const sampleRecords = [];

                for (const file of files) {
                    const storagePath = await uploadToStorage(file.path, {
                        userId: educatorId,
                        profileId,
                        originalName: file.originalname
                    });
                    sampleRecords.push({
                        profile_id: profileId,
                        storage_path: storagePath,
                        duration_seconds: quality.duration,
                        snr_db: quality.snr,
                        clipping_detected: quality.clipping
                    });
                }

                const dbClient = await pool.connect();
                try {
                    await dbClient.query('BEGIN');
                    await dbClient.query(
                        `INSERT INTO voice_profiles (id, educator_id, base_pitch_hz, spectral_tilt, formant_shift, provider, language_code, sample_count, total_duration_seconds)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [profileId, educatorId, pitch, tilt, tilt * 10, provider, language, files.length, quality.duration * files.length]
                    );

                    for (const s of sampleRecords) {
                        await dbClient.query(
                            `INSERT INTO voice_samples (profile_id, storage_path, duration_seconds, snr_db, clipping_detected)
                             VALUES ($1, $2, $3, $4, $5)`,
                            [s.profile_id, s.storage_path, s.duration_seconds, s.snr_db, s.clipping_detected]
                        );
                    }
                    await dbClient.query('COMMIT');
                } catch (e) {
                    await dbClient.query('ROLLBACK');
                    throw e;
                } finally {
                    dbClient.release();
                }

                await cleanupFiles(files);

                if (provider !== 'internal') {
                    await redis.lPush('voice:training:queue', JSON.stringify({ profileId, provider, samples: sampleRecords.map(s => s.storage_path) }));
                } else {
                    await pool.query("UPDATE voice_profiles SET status = 'ready' WHERE id = $1", [profileId]);
                }

                res.status(201).json({ voiceId: profileId, status: provider === 'internal' ? 'ready' : 'training', profile: { basePitchHz: pitch, spectralTilt: tilt } });
            } catch (error: unknown) {
                const err = error as Error;
                await cleanupFiles(files);
                res.status(500).json({ error: 'Enrollment failed', message: err.message });
            }
        }
    );

    app.get('/voice-profile/:id', authenticateToken, async (req: Request, res: Response) => {
        try {
            const result = await pool.query("SELECT * FROM voice_profiles WHERE id = $1", [req.params.id]);
            if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
            const profile = result.rows[0];
            if (profile.educator_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
            res.json(profile);
        } catch (e) {
            res.status(500).json({ error: 'Fetch failed' });
        }
    });

    app.delete('/voice-profile/:id', authenticateToken, async (req: Request, res: Response) => {
        try {
            const result = await pool.query("SELECT * FROM voice_profiles WHERE id = $1", [req.params.id]);
            if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
            const profile = result.rows[0];
            if (profile.educator_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

            const samples = await pool.query("SELECT storage_path FROM voice_samples WHERE profile_id = $1", [profile.id]);
            await pool.query("DELETE FROM voice_profiles WHERE id = $1", [profile.id]);
            
            for (const s of samples.rows) {
                await deleteFromStorage(s.storage_path);
            }
            res.json({ message: 'Deleted' });
        } catch (e) {
            res.status(500).json({ error: 'Delete failed' });
        }
    });

    return app;
}

if (process.env.NODE_ENV !== 'test') {
    const app = createApp();
    (async () => {
        await redis.connect();
        app.listen(config.port, '127.0.0.1', () => {
            console.log(`🎙️ Voice profile service running on port ${config.port}`);
        });
    })();
}

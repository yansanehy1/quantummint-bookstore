import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';
import { analyzePitchHz, analyzeSpectralTilt } from './signal.js';

type Profile = {
    id: string;
    educatorId: string;
    basePitchHz: number;
    tilt: number;
    formantShift: number;
};

const profiles: Record<string, Profile> = {};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization' });
    }

    const token = authHeader.substring(7);
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT secret not configured');
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (_err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors({
        origin: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173',
        methods: ['POST', 'GET'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express.json({ limit: '200kb' }));

    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
    app.use(limiter);

    const upload = multer({
        dest: 'uploads/',
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const allowed = ['audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/mp3'];
            cb(null, allowed.includes(file.mimetype));
        }
    });

    app.post('/voice-profile/enroll', authenticateToken, upload.array('samples', 3), async (req, res) => {
        const educatorId = req.body.educatorId;
        if (!educatorId) return res.status(400).json({ error: 'educatorId required' });

        const files = (req.files ?? []) as Express.Multer.File[];
        if (!files.length) return res.status(400).json({ error: 'samples required' });

        if (req.user.id !== educatorId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

            const validation = enrollmentSchema.safeParse({ educatorId, samples: files });
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid enrollment payload', details: validation.error.errors });
        }

        const id = uuid();
        const pitch = analyzePitchHz(files[0].path);
        const tilt = analyzeSpectralTilt(files[0].path);

        const profile: Profile = {
            id,
            educatorId,
            basePitchHz: pitch,
            tilt,
            formantShift: tilt * 10
        };

        profiles[id] = profile;

        for (const file of files) {
            try { await fs.unlink(file.path); } catch (_err) { }
        }

        return res.json({ voiceId: id, status: 'ready', profile });
    });

    app.get('/voice-profile/:id', authenticateToken, (req, res) => {
        const p = profiles[req.params.id];
        if (!p) return res.status(404).json({ error: 'not found' });
        if (p.educatorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(p);
    });

    return app;
};

const app = createApp();

if (process.env.NODE_ENV !== 'test') {
    app.listen(7002, () => console.log('Voice profile service on :7002'));
}

export { app, createApp, profiles, authenticateToken };

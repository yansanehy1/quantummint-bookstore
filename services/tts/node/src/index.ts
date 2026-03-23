import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { buildSSML } from './ssml.js';
import { synthesizeToFile } from './synth.js';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';

const app = express();
app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
    credentials: false
}));
app.use(express.json({ limit: '2mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

const ALLOWED_LANGUAGES = ['en', 'fr', 'es', 'de', 'pt'];
const TTSRequest = z.object({
    text: z.string().min(1).max(5000),
    language: z.enum([...ALLOWED_LANGUAGES] as const).default('en'),
    speed: z.number().min(0.7).max(1.5).default(1.0),
    pitch: z.number().min(-6).max(6).default(0),
    voiceId: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
    format: z.enum(['wav', 'mp3']).default('wav'),
    cues: z.array(z.object({
        type: z.enum(['visual', 'formula', 'step']),
        atMs: z.number().nonnegative(),
        payload: z.record(z.any())
    })).optional()
});

app.post('/tts/synthesize', async (req, res) => {
    try {
        const parse = TTSRequest.safeParse(req.body);
        if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
        const { text, language, speed, pitch, voiceId, format, cues } = parse.data;

        const ssml = buildSSML({ text, language, speed, pitch });

        const id = uuid();
        const mediaDir = process.env.MEDIA_DIR || '/tmp/media';
        const outDir = path.join(mediaDir, 'tts');
        
        // Ensure the resolved path is within mediaDir to prevent directory traversal
        const resolvedOutDir = path.resolve(outDir);
        if (!resolvedOutDir.startsWith(path.resolve(mediaDir))) {
            return res.status(400).json({ error: 'Invalid media directory' });
        }
        
        fs.mkdirSync(resolvedOutDir, { recursive: true });
        const outPath = path.join(resolvedOutDir, `${id}.${format}`);

        const { durationMs } = await synthesizeToFile({
            ssml,
            voiceId,
            rate: speed,
            pitchShift: pitch,
            format,
            outPath
        });

        res.json({
            id,
            audioUrl: `/media/tts/${id}.${format}`,
            durationMs,
            cues: cues ?? []
        });
    } catch (err) {
        console.error('TTS synthesis error:', err);
        res.status(500).json({ error: 'Synthesis failed' });
    }
});

const PORT = process.env.PORT || 7001;
app.listen(PORT, '127.0.0.1', () => console.log(`TTS service running on :${PORT}`));

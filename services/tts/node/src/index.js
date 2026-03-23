import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { buildSSML } from './ssml';
import { synthesize } from './synth';
import { v4 as uuid } from 'uuid';
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
// Request schema
const ALLOWED_LANGUAGES = ['en', 'fr', 'es', 'de', 'pt'];
const TTSRequest = z.object({
    text: z.string().min(1).max(5000),
    language: z.enum([...ALLOWED_LANGUAGES]).default("en"),
    voiceId: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
    speed: z.number().min(0.7).max(1.5).default(1.0),
    pitch: z.number().min(-6).max(6).default(0),
    cues: z.array(z.object({
        type: z.enum(["visual", "formula", "step"]),
        atMs: z.number().nonnegative(),
        payload: z.record(z.any())
    })).optional()
});
app.post('/tts/synthesize', async (req, res) => {
    const parse = TTSRequest.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { text, language, voiceId, speed, pitch, cues } = parse.data;
    // Build SSML with formula-aware narration
    const ssml = buildSSML({ text, language, speed, pitch });
    // Synthesize audio (WAV/MP3/OGG)
    const id = uuid();
    const audio = await synthesize({ ssml, language, voiceId });
    // Persist to storage (stubbed as local path)
    // In production, upload to S3/MinIO/CDN and store URL.
    const audioUrl = `/media/tts/${id}.mp3`;
    // Return audio + echo cues for frontend sync
    res.json({ id, audioUrl, durationMs: audio.durationMs, waveform: audio.waveform, cues: cues ?? [] });
});
app.listen(7001, () => console.log('TTS service on :7001'));

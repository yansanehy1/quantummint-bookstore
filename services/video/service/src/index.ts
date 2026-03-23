import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { createExplainerVideo } from './render.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/video/generate', async (req, res) => {
    const { narrationText, baseImage, cues } = req.body;
    if (!narrationText && !cues) return res.status(400).json({ error: 'narrationText or cues required' });

    try {
        const id = uuid();
        const videoUrl = await createExplainerVideo({ id, narrationText, baseImage, cues });
        res.json({ id, videoUrl, success: true });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'video generation failed', details: e.message });
    }
});

app.listen(7005, () => console.log('Video service on :7005'));

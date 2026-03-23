import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

type VoiceProfile = {
    id: string;
    educatorId: string;
    status: 'enrolled' | 'training' | 'ready' | 'failed';
    samples: string[];
};

const voices: Record<string, VoiceProfile> = {};

app.post('/voice/enroll', upload.array('samples', 5), (req, res) => {
    const educatorId = req.body.educatorId;
    if (!educatorId) return res.status(400).json({ error: 'educatorId required' });

    const id = uuid();
    voices[id] = {
        id, educatorId,
        status: 'training',
        samples: (req.files as Express.Multer.File[] ?? []).map(f => f.path)
    };

    // Simulate training async; integrate ML job queue in production.
    setTimeout(() => { voices[id].status = 'ready'; }, 5000);

    res.json({ voiceId: id, status: voices[id].status });
});

app.get('/voice/:voiceId', (req, res) => {
    const v = voices[req.params.voiceId];
    if (!v) return res.status(404).json({ error: 'not found' });
    res.json(v);
});

app.listen(7002, () => console.log('Voice clone service on :7002'));

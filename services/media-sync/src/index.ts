import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const Cue = z.object({
    type: z.enum(['visual', 'formula', 'step']),
    atMs: z.number().nonnegative(),
    payload: z.any()
});
const CueMap = z.object({
    bookId: z.string(),
    chapterId: z.string(),
    audioId: z.string(),
    cues: z.array(Cue)
});

const store: Record<string, z.infer<typeof CueMap>> = {};

app.post('/sync/cues', (req, res) => {
    const parse = CueMap.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const key = `${parse.data.bookId}:${parse.data.chapterId}`;
    store[key] = parse.data;
    res.json({ ok: true, key });
});

app.get('/sync/cues/:bookId/:chapterId', (req, res) => {
    const key = `${req.params.bookId}:${req.params.chapterId}`;
    if (!store[key]) return res.status(404).json({ error: 'not found' });
    res.json(store[key]);
});

app.listen(7004, () => console.log('Media sync service on :7004'));

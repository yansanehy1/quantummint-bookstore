const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * TTS Service Proxy
 * Securely routes TTS requests from frontend to internal TTS service
 */
const TTS_SERVICE_URL = process.env.TTS_SERVICE_URL || 'http://localhost:8000/tts';

// Proxy synthesis request
router.post('/synthesize', authenticateToken, async (req, res) => {
    try {
        const { text, voiceId, speed, pitch, language, bookId } = req.body;
        const userId = req.user.id; // From authMiddleware

        // Basic validation
        if (!text || text.length > 5000) {
            return res.status(400).json({ error: 'Invalid text. Maximum 5000 characters allowed.' });
        }

        // Forward to internal TTS service (FastAPI)
        const response = await fetch(`${TTS_SERVICE_URL}/process`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                text, 
                user_id: userId,
                book_id: bookId,
                voice_map: voiceId ? { narrative: voiceId } : null,
                output_format: "audio-16khz-32kbitrate-mono-mp3"
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Return synthesis results
        res.json(data);
    } catch (err) {
        console.error('TTS proxy error:', err);
        res.status(500).json({ error: 'TTS synthesis service is currently unavailable.' });
    }
});

// Proxy multi-voice synthesis request
router.post('/multi', authenticateToken, async (req, res) => {
    try {
        const { segments, bookId } = req.body;
        const userId = req.user.id;

        const response = await fetch(`${TTS_SERVICE_URL}/multi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                segments, 
                user_id: userId,
                book_id: bookId
            }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (err) {
        console.error('TTS multi proxy error:', err);
        res.status(500).json({ error: 'Multi-voice service is currently unavailable.' });
    }
});

// Proxy streaming synthesis request
router.post('/stream', authenticateToken, async (req, res) => {
    try {
        const { text, voiceId, bookId } = req.body;
        const userId = req.user.id;

        const response = await fetch(`${TTS_SERVICE_URL}/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                user_id: userId,
                book_id: bookId,
                voice_map: voiceId ? { narrative: voiceId } : null,
                output_format: "audio-16khz-32kbitrate-mono-mp3"
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json(error);
        }

        // Pipe the stream directly to the response
        res.setHeader('Content-Type', 'audio/mpeg');
        response.body.pipe(res);
    } catch (err) {
        console.error('TTS stream proxy error:', err);
        res.status(500).json({ error: 'Streaming service is currently unavailable.' });
    }
});

// Proxy streaming synthesis request (GET version for audio tag compatibility)
router.get('/stream-url', async (req, res) => {
    try {
        const { text, voiceId, bookId, token } = req.query;
        
        // Manual token verification for GET requests
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const response = await fetch(`${TTS_SERVICE_URL}/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                user_id: userId,
                book_id: bookId,
                voice_map: voiceId ? { narrative: voiceId } : null,
                output_format: "audio-16khz-32kbitrate-mono-mp3"
            }),
        });

        if (!response.ok) return res.status(response.status).send('Streaming error');

        res.setHeader('Content-Type', 'audio/mpeg');
        response.body.pipe(res);
    } catch (err) {
        console.error('TTS stream GET error:', err);
        res.status(500).send('Streaming service error');
    }
});

// Proxy breakdown request
router.post('/breakdown', authenticateToken, async (req, res) => {
    try {
        const { formula } = req.body;
        const response = await fetch(`${TTS_SERVICE_URL}/breakdown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formula }),
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('TTS breakdown proxy error:', err);
        res.status(500).json({ error: 'Breakdown service is currently unavailable.' });
    }
});

// Proxy voices list request
router.get('/voices', authenticateToken, async (req, res) => {
    try {
        const response = await fetch(`${TTS_SERVICE_URL}/voices`);
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (err) {
        console.error('TTS voices proxy error:', err);
        res.status(500).json({ error: 'Failed to fetch available voices from synthesis service.' });
    }
});

module.exports = router;

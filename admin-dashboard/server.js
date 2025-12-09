// admin-dashboard/server.js
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic Auth Middleware
app.use((req, res, next) => {
    const auth = { login: 'admin', password: process.env.ADMIN_PASSWORD || 'admin123' };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (login === auth.login && password === auth.password) return next();
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required');
});

// Mock Data APIs (Replace with DB calls)
app.get('/api/dashboard/stats', (req, res) => {
    res.json({
        videos: { total: 150, processing: 2, failed: 0 },
        users: { total: 1200, new_today: 15 },
        earnings: { total: 5400, today: 120 },
        streaming: { active_sessions: 45, total_watch_hours: 1200 }
    });
});

// WebSocket Server
const wss = new WebSocket.Server({ port: 8082 });
wss.on('connection', ws => {
    console.log('Admin connected');
    ws.send(JSON.stringify({ type: 'init', data: { message: 'Connected' } }));
});

app.listen(PORT, () => console.log(`Admin Dashboard running on port ${PORT}`));

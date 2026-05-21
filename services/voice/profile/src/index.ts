import { createApp } from './server.js';

export * from './server.js';
export * from './signal.js';
export * from './storage.js';

const app = createApp();
const port = process.env.PORT || 7002;

const server = app.listen(port, () => {
    console.log(`Voice profile service running on port ${port}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

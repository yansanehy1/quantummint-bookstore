import express from "express";
import bodyParser from "body-parser";
import { sendGift } from "./routes/sendGift";
import { dlr } from "./routes/dlr";
import { messages } from "./routes/messages";
import { health } from "./routes/health";
import { config } from "./config";
import { startWorker } from "./worker";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// Routes
app.use(health);
app.use(sendGift);
app.use(dlr);
app.use(messages);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(config.port, () => {
    console.log(`SMS service running on :${config.port}`);
    console.log(`Provider: ${config.provider}`);
});

// Start worker
startWorker().catch(console.error);

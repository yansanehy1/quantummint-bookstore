"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sendGift_1 = require("./routes/sendGift");
const dlr_1 = require("./routes/dlr");
const messages_1 = require("./routes/messages");
const health_1 = require("./routes/health");
const config_1 = require("./config");
const worker_1 = require("./worker");
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});
// Routes
app.use(health_1.health);
app.use(sendGift_1.sendGift);
app.use(dlr_1.dlr);
app.use(messages_1.messages);
// Error handling
app.use((err, req, res, next) => {
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
app.listen(config_1.config.port, () => {
    console.log(`SMS service running on :${config_1.config.port}`);
    console.log(`Provider: ${config_1.config.provider}`);
});
// Start worker
(0, worker_1.startWorker)().catch(console.error);

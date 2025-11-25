"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
app.get('/config/:service', (req, res) => {
    // Minimal placeholder config
    res.json({ service: req.params.service, config: {} });
});
const PORT = process.env.PORT || 3016;
app.listen(PORT, () => {
    console.log(`Config server running on port ${PORT}`);
});

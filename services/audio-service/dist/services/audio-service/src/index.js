"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const processor_1 = require("./processor");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const registry = new service_registry_client_1.ServiceRegistryClient();
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
// POST /process -> { sentences: ProcessedSentence[] }
app.post('/process', (req, res) => {
    const { text, title } = req.body || {};
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'text is required' });
    }
    const sentences = (0, processor_1.processText)(text);
    res.json({ title: title || 'Untitled', sentences });
});
// POST /audiobooks -> persist or simulate save, return id
const audiobooks = [];
app.post('/audiobooks', (req, res) => {
    const { title, sentences, formulaCount } = req.body || {};
    if (!title || !Array.isArray(sentences)) {
        return res.status(400).json({ error: 'title and sentences are required' });
    }
    const id = cryptoRandom();
    const item = { id, title, sentencesCount: sentences.length, formulaCount: formulaCount ?? 0, createdAt: new Date().toISOString() };
    audiobooks.push(item);
    res.status(201).json(item);
});
function cryptoRandom() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Audio service running on port ${PORT}`);
    registry.register('audio-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

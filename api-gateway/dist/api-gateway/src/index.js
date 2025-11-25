"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const app = (0, express_1.default)();
const registry = new service_registry_client_1.ServiceRegistryClient();
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
// Example proxy: /books -> book-service
app.use('/books', async (req, res, next) => {
    try {
        const services = await registry.discover('book-service');
        const target = services[0]?.serviceUrl;
        if (!target)
            return res.status(503).json({ error: 'book-service unavailable' });
        return (0, http_proxy_middleware_1.createProxyMiddleware)({ target, changeOrigin: true })(req, res, next);
    }
    catch (e) {
        return res.status(503).json({ error: e.message });
    }
});
// Proxy: /api/audio -> audio-service
app.use('/api/audio', async (req, res, next) => {
    try {
        const services = await registry.discover('audio-service');
        const target = services[0]?.serviceUrl;
        if (!target)
            return res.status(503).json({ error: 'audio-service unavailable' });
        return (0, http_proxy_middleware_1.createProxyMiddleware)({ target, changeOrigin: true })(req, res, next);
    }
    catch (e) {
        return res.status(503).json({ error: e.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});

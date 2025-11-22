import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';

const app = express();
const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

// Example proxy: /books -> book-service
app.use('/books', async (req, res, next) => {
  try {
    const services = await registry.discover('book-service');
    const target = services[0]?.serviceUrl;
    if (!target) return res.status(503).json({ error: 'book-service unavailable' });
    return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
  } catch (e: any) {
    return res.status(503).json({ error: e.message });
  }
});

// Proxy: /api/audio -> audio-service
app.use('/api/audio', async (req, res, next) => {
  try {
    const services = await registry.discover('audio-service');
    const target = services[0]?.serviceUrl;
    if (!target) return res.status(503).json({ error: 'audio-service unavailable' });
    return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
  } catch (e: any) {
    return res.status(503).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

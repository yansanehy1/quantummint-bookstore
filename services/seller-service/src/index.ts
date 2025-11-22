import express from 'express';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';

const app = express();
app.use(express.json());
const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`Seller service running on port ${PORT}`);
  registry.register('seller-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

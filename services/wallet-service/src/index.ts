import express from 'express';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';

const app = express();
app.use(express.json());

const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Wallet service running on port ${PORT}`);
  registry.register('wallet-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

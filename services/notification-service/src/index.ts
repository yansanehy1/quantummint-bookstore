import express from 'express';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';

const app = express();
app.use(express.json());
const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
  registry.register('notification-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

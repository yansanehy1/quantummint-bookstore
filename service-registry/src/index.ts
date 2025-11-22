import express from 'express';
import { ServiceRegistry } from './service-registry';

const app = express();
app.use(express.json());

const registry = new ServiceRegistry();
registry.startHealthChecks();

app.post('/register', (req, res) => {
  const { serviceName, serviceUrl, healthCheckUrl } = req.body;
  registry.register(serviceName, serviceUrl, healthCheckUrl);
  res.json({ success: true });
});

app.post('/unregister', (req, res) => {
  const { serviceName, serviceUrl } = req.body;
  registry.unregister(serviceName, serviceUrl);
  res.json({ success: true });
});

app.get('/discover/:serviceName', (req, res) => {
  const { serviceName } = req.params as any;
  try {
    const services = registry.discover(serviceName);
    res.json(services);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', services: registry.getServiceCount() });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Service Registry running on port ${PORT}`);
});

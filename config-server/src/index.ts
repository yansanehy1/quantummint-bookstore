import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
app.get('/config/:service', (req, res) => {
  // Minimal placeholder config
  res.json({ service: req.params.service, config: {} });
});

const PORT = process.env.PORT || 3016;
app.listen(PORT, () => {
  console.log(`Config server running on port ${PORT}`);
});

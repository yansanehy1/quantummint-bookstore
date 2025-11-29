require('dotenv').config();
const express = require('express');
const { ServiceRegistryClient } = require('./utils/service-registry-client');

const app = express();
app.use(express.json());
const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

// Seller Service specific routes could go here
app.get('/', (req, res) => {
    res.send('Seller Service is running');
});

const PORT = process.env.SELLER_SERVICE_PORT || 3011;
app.listen(PORT, () => {
    console.log(`Seller service running on port ${PORT}`);
    registry.register('seller-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

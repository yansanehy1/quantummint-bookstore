require('dotenv').config();
const express = require('express');

// Simplified ServiceRegistryClient for standalone service
class ServiceRegistryClient {
    constructor() {
        this.registryUrl = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3000/api/registry';
    }

    register(serviceName, serviceUrl, healthUrl) {
        console.log(`[ServiceRegistry] Registering ${serviceName} at ${serviceUrl}`);
        console.log(`[ServiceRegistry] Health check at ${healthUrl}`);
    }
}

const app = express();
app.use(express.json());
const registry = new ServiceRegistryClient();

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

// Seller Service specific routes
app.get('/', (req, res) => {
    res.send('Seller Service is running');
});

const PORT = process.env.SELLER_SERVICE_PORT || 3011;
app.listen(PORT, () => {
    console.log(`Seller service running on port ${PORT}`);
    registry.register('seller-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

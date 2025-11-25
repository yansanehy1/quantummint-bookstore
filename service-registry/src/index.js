"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_registry_1 = require("./service-registry");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const registry = new service_registry_1.ServiceRegistry();
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
    const { serviceName } = req.params;
    try {
        const services = registry.discover(serviceName);
        res.json(services);
    }
    catch (e) {
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

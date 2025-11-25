"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const registry = new service_registry_client_1.ServiceRegistryClient();
const users = [];
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
app.post('/users', (req, res) => {
    const { email, passwordHash, name, phone, role } = req.body || {};
    if (!email || !passwordHash || !name)
        return res.status(400).json({ error: 'Missing fields' });
    if (users.find(u => u.email === email))
        return res.status(400).json({ error: 'User exists' });
    const user = { id: cryptoRandom(), email, passwordHash, name, phone, role: role || 'user' };
    users.push(user);
    res.status(201).json(user);
});
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user)
        return res.status(404).json({ error: 'Not found' });
    res.json(user);
});
function cryptoRandom() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
    registry.register('user-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

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
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Wallet service running on port ${PORT}`);
    registry.register('wallet-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRegistryClient = void 0;
const undici_1 = require("undici");
class ServiceRegistryClient {
    constructor(baseUrl = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3007') {
        this.cache = new Map();
        this.rrIndex = new Map();
        this.baseUrl = baseUrl;
    }
    async register(serviceName, serviceUrl, healthCheckUrl) {
        await (0, undici_1.request)(`${this.baseUrl}/register`, {
            method: 'POST',
            body: JSON.stringify({ serviceName, serviceUrl, healthCheckUrl }),
            headers: { 'content-type': 'application/json' }
        });
    }
    async unregister(serviceName, serviceUrl) {
        await (0, undici_1.request)(`${this.baseUrl}/unregister`, {
            method: 'POST',
            body: JSON.stringify({ serviceName, serviceUrl }),
            headers: { 'content-type': 'application/json' }
        });
    }
    async discover(serviceName) {
        // Prefer cache but refresh in background
        const res = await (0, undici_1.request)(`${this.baseUrl}/discover/${serviceName}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const body = await res.body.json();
            this.cache.set(serviceName, body);
            return body;
        }
        const cached = this.cache.get(serviceName);
        if (cached && cached.length)
            return cached;
        throw new Error(`No healthy instances available for service: ${serviceName}`);
    }
    pick(serviceName) {
        const list = this.cache.get(serviceName) || [];
        if (!list.length)
            return null;
        const idx = this.rrIndex.get(serviceName) ?? 0;
        const picked = list[idx % list.length];
        this.rrIndex.set(serviceName, (idx + 1) % list.length);
        return picked;
    }
}
exports.ServiceRegistryClient = ServiceRegistryClient;

import { request } from 'undici';

interface ServiceInstance {
  serviceName: string;
  serviceUrl: string;
  healthCheckUrl: string;
  lastHeartbeat: string | Date;
  isHealthy: boolean;
}

export class ServiceRegistryClient {
  private baseUrl: string;
  private cache: Map<string, ServiceInstance[]> = new Map();
  private rrIndex: Map<string, number> = new Map();

  constructor(baseUrl = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3007') {
    this.baseUrl = baseUrl;
  }

  async register(serviceName: string, serviceUrl: string, healthCheckUrl: string) {
    await request(`${this.baseUrl}/register`, {
      method: 'POST',
      body: JSON.stringify({ serviceName, serviceUrl, healthCheckUrl }),
      headers: { 'content-type': 'application/json' }
    });
  }

  async unregister(serviceName: string, serviceUrl: string) {
    await request(`${this.baseUrl}/unregister`, {
      method: 'POST',
      body: JSON.stringify({ serviceName, serviceUrl }),
      headers: { 'content-type': 'application/json' }
    });
  }

  async discover(serviceName: string): Promise<ServiceInstance[]> {
    // Prefer cache but refresh in background
    const res = await request(`${this.baseUrl}/discover/${serviceName}`);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const body = await res.body.json() as ServiceInstance[];
      this.cache.set(serviceName, body);
      return body;
    }
    const cached = this.cache.get(serviceName);
    if (cached && cached.length) return cached;
    throw new Error(`No healthy instances available for service: ${serviceName}`);
  }

  pick(serviceName: string): ServiceInstance | null {
    const list = this.cache.get(serviceName) || [];
    if (!list.length) return null;
    const idx = this.rrIndex.get(serviceName) ?? 0;
    const picked = list[idx % list.length];
    this.rrIndex.set(serviceName, (idx + 1) % list.length);
    return picked;
  }
}

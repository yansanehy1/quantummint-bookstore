import { request } from 'undici';

interface ServiceInstance {
  serviceName: string;
  serviceUrl: string;
  healthCheckUrl: string;
  lastHeartbeat: Date;
  isHealthy: boolean;
}

export class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map();
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30 seconds

  register(serviceName: string, serviceUrl: string, healthCheckUrl: string) {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, []);
    }

    const instances = this.services.get(serviceName)!;
    const existingInstance = instances.find(instance => instance.serviceUrl === serviceUrl);

    if (!existingInstance) {
      instances.push({
        serviceName,
        serviceUrl,
        healthCheckUrl,
        lastHeartbeat: new Date(),
        isHealthy: true
      });
      console.log(`Registered service: ${serviceName} at ${serviceUrl}`);
    } else {
      existingInstance.lastHeartbeat = new Date();
    }
  }

  unregister(serviceName: string, serviceUrl: string) {
    const instances = this.services.get(serviceName);
    if (instances) {
      this.services.set(
        serviceName,
        instances.filter(instance => instance.serviceUrl !== serviceUrl)
      );
      console.log(`Unregistered service: ${serviceName} at ${serviceUrl}`);
    }
  }

  discover(serviceName: string): ServiceInstance[] {
    const instances = this.services.get(serviceName) || [];

    const healthyInstances = instances.filter(instance =>
      instance.isHealthy &&
      (Date.now() - instance.lastHeartbeat.getTime()) < this.HEARTBEAT_TIMEOUT
    );

    if (healthyInstances.length > 0) {
      return healthyInstances;
    }

    throw new Error(`No healthy instances available for service: ${serviceName}`);
  }

  async checkHealth() {
    for (const [serviceName, instances] of this.services.entries()) {
      for (const instance of instances) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const res = await request(instance.healthCheckUrl, { signal: controller.signal });
          clearTimeout(timeout);
          instance.isHealthy = res.statusCode >= 200 && res.statusCode < 300;
          instance.lastHeartbeat = new Date();
        } catch (error) {
          instance.isHealthy = false;
          console.warn(`Service ${serviceName} at ${instance.serviceUrl} is unhealthy`);
        }
      }
    }
  }

  getServiceCount(): number {
    return this.services.size;
  }

  startHealthChecks() {
    setInterval(() => this.checkHealth(), 15000);
  }
}

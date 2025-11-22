interface ServiceInstance {
    serviceName: string;
    serviceUrl: string;
    healthCheckUrl: string;
    lastHeartbeat: string | Date;
    isHealthy: boolean;
}
export declare class ServiceRegistryClient {
    private baseUrl;
    private cache;
    private rrIndex;
    constructor(baseUrl?: string);
    register(serviceName: string, serviceUrl: string, healthCheckUrl: string): Promise<void>;
    unregister(serviceName: string, serviceUrl: string): Promise<void>;
    discover(serviceName: string): Promise<ServiceInstance[]>;
    pick(serviceName: string): ServiceInstance | null;
}
export {};

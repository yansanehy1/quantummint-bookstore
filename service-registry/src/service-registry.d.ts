interface ServiceInstance {
    serviceName: string;
    serviceUrl: string;
    healthCheckUrl: string;
    lastHeartbeat: Date;
    isHealthy: boolean;
}
export declare class ServiceRegistry {
    private services;
    private readonly HEARTBEAT_TIMEOUT;
    register(serviceName: string, serviceUrl: string, healthCheckUrl: string): void;
    unregister(serviceName: string, serviceUrl: string): void;
    discover(serviceName: string): ServiceInstance[];
    checkHealth(): Promise<void>;
    getServiceCount(): number;
    startHealthChecks(): void;
}
export {};

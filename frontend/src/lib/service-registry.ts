// Service registry for microservices
interface Service {
    url: string;
    name: string;
}

class ServiceRegistry {
    private services: Map<string, Service> = new Map();

    async getService(serviceName: string): Promise<Service> {
        // In a real implementation, this would fetch from a service discovery system
        // For now, return mock URLs based on environment variables
        const serviceUrls: Record<string, string> = {
            'book-service': process.env.NEXT_PUBLIC_BOOK_SERVICE_URL || 'http://localhost:3001',
            'user-service': process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002',
            'payment-service': process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:3003',
        };

        const url = serviceUrls[serviceName];
        if (!url) {
            throw new Error(`Service ${serviceName} not found in registry`);
        }

        return {
            url,
            name: serviceName,
        };
    }

    registerService(name: string, url: string): void {
        this.services.set(name, { name, url });
    }
}

export const serviceRegistry = new ServiceRegistry();

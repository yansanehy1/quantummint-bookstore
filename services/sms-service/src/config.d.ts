export declare const config: {
    port: number;
    mysql: {
        host: string;
        user: string;
        password: string;
        database: string;
        waitForConnections: boolean;
        connectionLimit: number;
        queueLimit: number;
    };
    redisUrl: string;
    jwtPublicKey: string;
    defaultLocale: string;
    provider: string;
    providers: {
        twilio: {
            accountSid: string;
            authToken: string;
            from: string;
        };
        vonage: {
            apiKey: string;
            apiSecret: string;
            from: string;
        };
        smppHttp: {
            endpoint: string;
            apiKey: string;
            from: string;
        };
    };
    dlr: {
        secret: string;
    };
};

import dotenv from "dotenv";
dotenv.config();

function validateConfig() {
    const required = [
        'DB_HOST',
        'DB_USER',
        'REDIS_URL',
        'JWT_PUBLIC_KEY',
        'DLR_HMAC_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

validateConfig();

export const config = {
    port: Number(process.env.PORT ?? 3001),
    mysql: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "quantummint_bookstore",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    jwtPublicKey: process.env.JWT_PUBLIC_KEY || "default-public-key",
    defaultLocale: "en",
    provider: process.env.SMS_PROVIDER ?? "twilio",
    providers: {
        twilio: {
            accountSid: process.env.TWILIO_SID || "",
            authToken: process.env.TWILIO_TOKEN || "",
            from: process.env.TWILIO_FROM || ""
        },
        vonage: {
            apiKey: process.env.VONAGE_KEY || "",
            apiSecret: process.env.VONAGE_SECRET || "",
            from: process.env.VONAGE_FROM || ""
        },
        smppHttp: {
            endpoint: process.env.SMPP_HTTP_ENDPOINT || "",
            apiKey: process.env.SMPP_HTTP_KEY || "",
            from: process.env.SMPP_HTTP_FROM || ""
        },
    },
    dlr: { secret: process.env.DLR_HMAC_SECRET || "default-secret" }
};

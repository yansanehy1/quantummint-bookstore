// Shared configuration for QuantumMint services
require('dotenv').config();

const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',

    // MongoDB Configuration
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantummint',

    // Redis Configuration
    redisUri: process.env.REDIS_URI || 'redis://localhost:6379',

    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'quantum-dev-secret-2024',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

    // Service URLs
    services: {
        api: process.env.QUANTUMMINT_API_GATEWAY || 'http://localhost:3000',
        auth: process.env.QUANTUMMINT_AUTH_SERVICE || 'http://localhost:3001',
        mail: process.env.QUANTUMMINT_MAIL_SERVER || 'http://localhost:8082',
        domain: process.env.QUANTUMMINT_DOMAIN_CONTROLLER || 'http://localhost:8080'
    },

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

module.exports = { config };

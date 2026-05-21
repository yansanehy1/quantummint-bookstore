const { main: logger } = require('./utils/logger');
const { buildApp, connectDatabase } = require('./app');

['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'JWT_SECRET'].forEach((name) => {
    if (!process.env[name] && process.env.NODE_ENV === 'production') {
        logger.warn(`Warning: environment variable ${name} is not defined`);
    }
});

const { app, sequelize: initialSequelize } = buildApp();

const startSubscriptionWorker = process.env.DISABLE_SUBSCRIPTION_WORKER === 'true'
    ? () => {}
    : require('./workers/subscriptionWorker').startSubscriptionWorker;

connectDatabase(app, initialSequelize)
    .then((sequelize) => {
        logger.info(`Connected to ${sequelize.getDialect()} database`);
        logger.info('Database schema ready');
        startSubscriptionWorker(sequelize);
    })
    .catch((err) => logger.error('Database connection failed:', err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// ─── Health Check Endpoint ───────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        uptime: process.uptime(),
        timestamp: new Date(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Set a timeout for forced shutdown
    const forceShutdown = setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
            const sequelize = app.get('sequelize');
            if (sequelize) {
                await sequelize.close();
                logger.info('Database connection closed');
            }
        } catch (err) {
            logger.error('Error during database shutdown:', err);
        }

        clearTimeout(forceShutdown);
        logger.info('Graceful shutdown complete');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

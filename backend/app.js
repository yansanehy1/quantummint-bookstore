if (process.env.NODE_ENV !== 'test') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const { main: logger } = require('./utils/logger');
const { initSentry } = require('./utils/sentry');
const {
    createSequelize,
    createSqliteSequelize,
    isRemoteConnectionError,
} = require('./config/database');

initSentry();

function buildApp() {
    const app = express();
    app.set('trust proxy', 1);
    app.use(requestId);
    app.use(helmet());
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
        credentials: true,
        maxAge: 86400,
    }));
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
                correlationId: req.correlationId,
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration,
                ip: req.ip,
            });
        });
        next();
    });

    app.use(rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 120,
        standardHeaders: true,
        legacyHeaders: false,
    }));

    const sequelize = createSequelize();
    app.set('sequelize', sequelize);

    const db = require('./models')(sequelize);
    app.set('models', db);

    const authRoutes = require('./routes/authRoutes');
    const paymentRoutes = require('./routes/paymentRoutes');
    const walletRoutes = require('./routes/walletRoutes');
    const purchaseRoutes = require('./routes/purchaseRoutes');
    const bookRoutes = require('./routes/bookRoutes');
    const educationalRoutes = require('./routes/educational');
    const ttsRoutes = require('./routes/ttsRoutes');
    const formulaRoutes = require('./routes/formulaRoutes');
    const interactionRoutes = require('./routes/interactionRoutes');
    const educationalProcessingRoutes = require('./routes/educationalProcessingRoutes');
    const searchRoutes = require('./routes/searchRoutes');
    const sellerRoutes = require('./routes/sellerRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const learnerRoutes = require('./routes/learnerRoutes');
    const subscriptionRoutes = require('./routes/subscriptionRoutes');
    const refundRoutes = require('./routes/refundRoutes');
    const groupRoutes = require('./routes/groupRoutes');
    const draftRoutes = require('./routes/draftRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/wallet', walletRoutes);
    app.use('/api/purchase', purchaseRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/educational', educationalRoutes);
    app.use('/api/educational/processing', educationalProcessingRoutes);
    app.use('/api/tts', ttsRoutes);
    app.use('/api/formula', formulaRoutes);
    app.use('/api/interaction', interactionRoutes);
    app.use('/api/search', searchRoutes);
    app.use('/api/sellers', sellerRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/learner', learnerRoutes);
    app.use('/api/subscriptions', subscriptionRoutes);
    app.use('/api/refunds', refundRoutes);
    app.use('/api/groups', groupRoutes);
    app.use('/api/drafts', draftRoutes);

    app.get('/', (req, res) => {
        res.json({ status: 'QuantumMint API running', version: '1.0.0' });
    });

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.use((req, res) => {
        res.status(404).json({ error: 'Not found', correlationId: req.correlationId });
    });

    app.use(errorHandler);

    return { app, sequelize };
}

async function syncDatabase(sequelize) {
    await sequelize.authenticate();
    const useAlter = process.env.DB_SYNC_ALTER === 'true'
        || (process.env.NODE_ENV !== 'production' && process.env.DB_SYNC_ALTER !== 'false');
    await sequelize.sync(useAlter ? { alter: true } : {});
}

/**
 * Connect and sync DB. In development, falls back to SQLite if MySQL/Postgres is unreachable.
 */
async function connectDatabase(app, sequelize) {
    try {
        await syncDatabase(sequelize);
        return sequelize;
    } catch (err) {
        const allowFallback = process.env.NODE_ENV !== 'production'
            && process.env.DB_USE_SQLITE !== 'false'
            && sequelize.getDialect() !== 'sqlite'
            && isRemoteConnectionError(err);

        if (!allowFallback) {
            throw err;
        }

        const { main: logger } = require('./utils/logger');
        const storage = process.env.SQLITE_PATH || './database.sqlite';
        logger.warn(
            `Remote database unavailable (${err.parent?.code || err.message}). `
            + `Falling back to SQLite at ${storage}. `
            + 'Start MySQL or set DB_USE_SQLITE=true to skip this attempt.'
        );

        await sequelize.close().catch(() => {});

        const sqlite = createSqliteSequelize(storage);
        const db = require('./models')(sqlite);
        app.set('sequelize', sqlite);
        app.set('models', db);
        await syncDatabase(sqlite);
        return sqlite;
    }
}

module.exports = { buildApp, syncDatabase, connectDatabase };

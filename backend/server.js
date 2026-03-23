require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Sequelize } = require('sequelize');
const { errorHandler } = require('./middleware/errorHandler');

// basic environment validation
['DB_NAME','DB_USER','DB_PASS','DB_HOST','JWT_SECRET'].forEach((name) => {
    if (!process.env[name]) {
        console.warn(`🚨 Warning: environment variable ${name} is not defined`);
    }
});

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://quantummint.net',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// simple rate limiter for all requests
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 120, // limit each IP to 120 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
}));

// Initialize Sequelize
let sequelize;

if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
    // Connect to MySQL (Production/Hostinger)
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false, // set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
    console.log('📡 Using MySQL/MariaDB database');
} else {
    // Connect to SQLite (fallback for local development)
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: console.log
    });
    console.log('📂 Using SQLite database (local fallback)');
}

// Make sequelize accessible in controllers via req.app.get('sequelize')
app.set('sequelize', sequelize);

// Import Models
const db = require('./models')(sequelize);
// also expose models directly for controllers to use
app.set('models', db);

// Test Connection and Sync Models
const { main: logger } = require('./utils/logger');

sequelize.authenticate()
    .then(() => {
        logger.info(`Connected to ${sequelize.getDialect() === 'mysql' ? 'Hostinger MySQL' : 'local SQLite'}!`);
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        logger.info('Database & tables synced!');
    })
    .catch(err => logger.error('Connection failed:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const walletRoutes = require('./routes/walletRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/purchase', purchaseRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'QuantumMint API running', version: '1.0.0' });
});

// attach error handler last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const { logger } = require('./utils/logger');
    logger.info(`Server running on port ${PORT}`);
});
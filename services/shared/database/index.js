const { Sequelize } = require('sequelize');
const logger = require('../logger');

// Database configuration for Shared Services
const sequelize = new Sequelize(
    process.env.DB_NAME || 'quantummint_shared',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: (msg) => logger.debug(msg),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// Initialize Models
const models = {
    EmailQueue: require('./models/EmailQueue')(sequelize),
    EmailLog: require('./models/EmailLog')(sequelize),
    UserEmailPreference: require('./models/UserEmailPreference')(sequelize),
    AbandonedCartEmail: require('./models/AbandonedCartEmail')(sequelize)
};

const connect = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Shared database connection established successfully.');
        
        // In a real production environment, we'd use migrations
        // But for this setup, we'll sync models if needed
        // await sequelize.sync({ alter: true });
        
    } catch (error) {
        logger.error('Unable to connect to the shared database:', error);
    }
};

module.exports = {
    sequelize,
    models,
    connect
};

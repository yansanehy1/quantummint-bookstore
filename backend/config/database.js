const { Sequelize } = require('sequelize');

function createSqliteSequelize(storage = './database.sqlite') {
    return new Sequelize({
        dialect: 'sqlite',
        storage,
        logging: false,
    });
}

function shouldUseSqlite() {
    return process.env.DB_USE_SQLITE === 'true'
        || process.env.USE_SQLITE === 'true'
        || process.env.SQLITE_PATH !== undefined;
}

function isRemoteConnectionError(err) {
    const code = err?.parent?.code || err?.original?.code;
    return ['ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'ER_ACCESS_DENIED_ERROR'].includes(code);
}

function createSequelize() {
    if (shouldUseSqlite()) {
        const storage = process.env.SQLITE_PATH || './database.sqlite';
        return createSqliteSequelize(storage === ':memory:' ? ':memory:' : storage);
    }

    const dbDialect = process.env.DB_DIALECT || 'mysql';

    if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
        return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: dbDialect,
            port: process.env.DB_PORT || (dbDialect === 'postgres' ? 5432 : 3306),
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
    }

    return createSqliteSequelize('./database.sqlite');
}

module.exports = {
    createSequelize,
    createSqliteSequelize,
    isRemoteConnectionError,
    shouldUseSqlite,
};
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const backendFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, service, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level.toUpperCase()}] [${service || 'backend'}]: ${message} ${metaStr}`;
    })
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: backendFormat,
    defaultMeta: { service: 'backend' },
    transports: [
        new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error', maxsize: 5242880, maxFiles: 5 }),
        new winston.transports.File({ filename: path.join(logsDir, 'backend.log'), maxsize: 5242880, maxFiles: 10 })
    ],
    exceptionHandlers: [ new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') }) ],
    rejectionHandlers: [ new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') }) ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ level, message, service, ...meta }) => {
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                return `[${service || 'backend'}] ${level}: ${message} ${metaStr}`;
            })
        )
    }));
}

const createComponentLogger = (component) => logger.child({ service: component });

module.exports = {
    main: logger,
    logger,
    createComponentLogger,
    http: createComponentLogger('http'),
    auth: createComponentLogger('auth'),
    payments: createComponentLogger('payments'),
    wallet: createComponentLogger('wallet'),
    purchase: createComponentLogger('purchase'),
};

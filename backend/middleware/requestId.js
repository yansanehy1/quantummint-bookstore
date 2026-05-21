const crypto = require('crypto');

/**
 * Middleware to ensure every request has a unique Correlation-ID.
 * If the client provides one, it is preserved; otherwise, a new one is generated.
 */
const requestId = (req, res, next) => {
    const correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
};

module.exports = requestId;

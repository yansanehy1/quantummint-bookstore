// Request ID middleware for request tracking
const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
    // Generate or use existing request ID
    const requestId = req.headers['x-request-id'] || req.headers['x-correlation-id'] || uuidv4();
    req.id = requestId;
    req.correlationId = requestId;

    // Set response headers
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('X-Correlation-ID', requestId);

    next();
};

module.exports = requestIdMiddleware;

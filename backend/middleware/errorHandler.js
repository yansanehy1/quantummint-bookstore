// middleware/errorHandler.js
// Centralized error handling middleware for Express
const Sentry = require("@sentry/node");

function errorHandler(err, req, res, next) {
    // Attach correlation ID to Sentry scope
    if (req.correlationId) {
        Sentry.configureScope(scope => {
            scope.setTag("correlation_id", req.correlationId);
            scope.setUser({ id: req.user?.id || 'anonymous' });
        });
    }

    // log differently depending on environment
    console.error(`[Error] [CID: ${req.correlationId || 'N/A'}]`, err.stack || err);

    const statusCode = err.status || err.statusCode || 500;
    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const message = (isProd && statusCode >= 500)
        ? 'Internal server error'
        : (err.message || 'Internal server error');

    // if the error object already has a response format, use it
    if (err.response && typeof err.response === 'object') {
        if (isProd && statusCode >= 500) {
            return res.status(statusCode).json({ 
                error: 'Internal server error',
                correlationId: req.correlationId 
            });
        }
        return res.status(statusCode).json({
            ...err.response,
            correlationId: req.correlationId
        });
    }

    res.status(statusCode).json({ 
        error: message,
        correlationId: req.correlationId 
    });
}

module.exports = { errorHandler };

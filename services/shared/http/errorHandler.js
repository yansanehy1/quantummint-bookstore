// Shared HTTP error handler middleware
const Sentry = require("@sentry/node");

const errorHandler = (err, req, res, next) => {
    const logger = req.logger || console;
    const correlationId = req.correlationId || req.id;

    // Attach correlation ID to Sentry scope
    if (correlationId) {
        Sentry.configureScope(scope => {
            scope.setTag("correlation_id", correlationId);
            scope.setUser({ id: req.user?.id || 'anonymous' });
        });
    }

    // Log the error
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        correlationId: correlationId,
        method: req.method,
        path: req.path,
        ip: req.ip
    });

    // Determine status code
    const statusCode = err.statusCode || err.status || 500;

    // Prepare error response
    const errorResponse = {
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode,
            correlationId: correlationId
        }
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = err.stack;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };

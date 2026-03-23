// Shared HTTP error handler middleware
const errorHandler = (err, req, res, next) => {
    const logger = req.logger || console;

    // Log the error
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        requestId: req.id,
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
            requestId: req.id
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

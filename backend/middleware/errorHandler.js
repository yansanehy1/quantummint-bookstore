// middleware/errorHandler.js
// Centralized error handling middleware for Express

function errorHandler(err, req, res, next) {
    // log differently depending on environment
    console.error(err.stack || err);

    const statusCode = err.status || err.statusCode || 500;
    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const message = (isProd && statusCode >= 500)
        ? 'Internal server error'
        : (err.message || 'Internal server error');

    // if the error object already has a response format, use it
    if (err.response && typeof err.response === 'object') {
        if (isProd && statusCode >= 500) {
            return res.status(statusCode).json({ error: 'Internal server error' });
        }
        return res.status(statusCode).json(err.response);
    }

    res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };

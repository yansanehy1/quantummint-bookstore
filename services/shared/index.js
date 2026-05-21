// Main entry point for @quantummint/shared package
module.exports = {
    config: require('./config'),
    http: {
        errorHandler: require('./http/errorHandler')
    },
    middleware: {
        requestId: require('./middleware/requestId'),
        auth: require('./middleware/auth')
    }
};

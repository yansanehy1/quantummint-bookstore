// middleware/asyncHandler.js
// small utility to wrap async route handlers and forward errors to express

module.exports = (fn) => {
    return function asyncUtilWrap(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

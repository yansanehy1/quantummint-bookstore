const rateLimit = require('express-rate-limit');

const refundSubmitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: parseInt(process.env.REFUND_SUBMIT_MAX_PER_HOUR, 10) || 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many refund requests. Please try again later.' },
    keyGenerator: (req) => req.user?.id || req.ip,
});

const refundAdminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.REFUND_ADMIN_MAX_PER_WINDOW, 10) || 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many admin refund actions. Please slow down.' },
    keyGenerator: (req) => req.user?.id || req.ip,
});

module.exports = {
    refundSubmitLimiter,
    refundAdminLimiter,
};

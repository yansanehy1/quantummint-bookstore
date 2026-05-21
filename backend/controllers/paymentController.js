// ============================================================
// Payment Controller – All 4 payment methods
// Orange Money, Afrimoney, Qmoney (mobile money) + Stripe Connect
// ============================================================

const asyncHandler = require('../middleware/asyncHandler');
const paymentService = require('../services/paymentService');
const exchangeRateService = require('../services/exchangeRateService');
const { main: logger } = require('../utils/logger');
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    try {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } catch (err) {
        logger.warn('Stripe SDK is unavailable; Stripe webhook verification disabled');
    }
}

// ─── GET /api/payments/exchange-rate ────────────────────────────────────────

exports.getExchangeRate = asyncHandler(async (req, res) => {
    const rate = await exchangeRateService.getRate();
    res.json({ rate, currency: 'SLL', base: 'USD', timestamp: new Date() });
});

// ─── POST /api/payments/deposit ──────────────────────────────────────────────

exports.initiateDeposit = asyncHandler(async (req, res) => {
    const { method, amount, phoneNumber } = req.body || {};
    const userId = req.user.id;
    logger.info(`[PaymentController] Initiating deposit for user ${userId}: method=${method}, amount=${amount}`);
    const result = await paymentService.initiateDeposit(req, userId, method, amount, phoneNumber);
    res.json(result);
});

// ─── POST /api/payments/withdraw ─────────────────────────────────────────────

exports.initiateWithdrawal = asyncHandler(async (req, res) => {
    const { method, amount, phoneNumber } = req.body || {};
    const userId = req.user.id;
    logger.info(`[PaymentController] Initiating withdrawal for user ${userId}: method=${method}, amount=${amount}`);
    const result = await paymentService.initiateWithdrawal(req, userId, method, amount, phoneNumber);
    res.json(result);
});


// ─── Stripe Connect OAuth ─────────────────────────────────────────────────────

exports.stripeConnectInit = (req, res) => {
    const userId = req.user.id;
    logger.info(`[PaymentController] Initializing Stripe Connect for user ${userId}`);
    const connectUrl = paymentService.getStripeConnectUrl(userId);
    res.json({ connectUrl });
};

exports.stripeConnectCallback = asyncHandler(async (req, res) => {
    const { code, state: userId } = req.query;
    logger.info(`[PaymentController] Handling Stripe Connect callback for user ${userId}`);
    await paymentService.handleStripeConnectCallback(req, userId, code);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/wallet?stripe=connected`);
});

exports.stripeDisconnect = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    logger.info(`[PaymentController] Disconnecting Stripe account for user ${userId}`);
    await paymentService.disconnectStripeAccount(req, userId);
    res.json({ success: true, message: 'Stripe account disconnected' });
});

// ─── Webhooks ─────────────────────────────────────────────────────────────────

exports.handleMobileMoneyWebhook = asyncHandler(async (req, res) => {
    logger.info('[PaymentController] Received Mobile Money webhook');
    // Optional shared secret protection for deployments that can configure it.
    // If MOBILE_MONEY_WEBHOOK_SECRET is set (especially in production), require the matching header.
    const secret = process.env.MOBILE_MONEY_WEBHOOK_SECRET;
    if (secret && (process.env.NODE_ENV || 'development') === 'production') {
        const provided = req.headers['x-webhook-secret'];
        if (!provided || provided !== secret) {
            logger.warn('[PaymentController] Invalid mobile money webhook secret');
            return res.status(401).json({ error: 'Invalid webhook secret' });
        }
    }

    const result = await paymentService.handleMobileMoneyWebhook(req, req.body);
    res.json(result);
});

exports.handleStripeWebhook = asyncHandler(async (req, res) => {
    logger.info('[PaymentController] Received Stripe webhook');
    // Stripe webhooks must always be verified if this endpoint is exposed.
    // Never accept unverified events (this is a common webhook spoofing vulnerability).
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        logger.error('[PaymentController] STRIPE_WEBHOOK_SECRET not configured');
        return res.status(503).json({ error: 'Stripe webhook secret not configured' });
    }
    if (!stripe) {
        logger.error('[PaymentController] Stripe SDK unavailable');
        return res.status(503).json({ error: 'Stripe SDK unavailable; cannot verify webhook signature' });
    }

    let event;
    const rawBody = req.body;

    const sig = req.headers['stripe-signature'];
    if (!sig) {
        logger.warn('[PaymentController] Stripe-Signature header missing');
        return res.status(400).json({ error: 'Stripe-Signature header missing' });
    }

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error('[PaymentController] Invalid Stripe signature:', err.message);
        return res.status(400).json({ error: 'Invalid Stripe signature' });
    }

    const result = await paymentService.handleStripeWebhook(req, event);
    res.json(result);
});

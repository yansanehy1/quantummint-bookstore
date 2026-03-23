// ============================================================
// Payment Controller – All 4 payment methods
// Orange Money, Afrimoney, Qmoney (mobile money) + Stripe Connect
// ============================================================

const asyncHandler = require('../middleware/asyncHandler');
const paymentService = require('../services/paymentService');
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    try {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } catch (err) {
        console.warn('Stripe SDK is unavailable; Stripe webhook verification disabled');
    }
}

// ─── POST /api/payments/deposit ──────────────────────────────────────────────

exports.initiateDeposit = asyncHandler(async (req, res) => {
    const { method, amount, phoneNumber } = req.body || {};
    const userId = req.user.id;
    const result = await paymentService.initiateDeposit(req, userId, method, amount, phoneNumber);
    res.json(result);
});

// ─── POST /api/payments/withdraw ─────────────────────────────────────────────

exports.initiateWithdrawal = asyncHandler(async (req, res) => {
    const { method, amount, phoneNumber } = req.body || {};
    const userId = req.user.id;
    const result = await paymentService.initiateWithdrawal(req, userId, method, amount, phoneNumber);
    res.json(result);
});


// ─── Stripe Connect OAuth ─────────────────────────────────────────────────────

exports.stripeConnectInit = (req, res) => {
    const userId = req.user.id;
    const connectUrl = paymentService.getStripeConnectUrl(userId);
    res.json({ connectUrl });
};

exports.stripeConnectCallback = asyncHandler(async (req, res) => {
    const { code, state: userId } = req.query;
    await paymentService.handleStripeConnectCallback(req, userId, code);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/wallet?stripe=connected`);
});

exports.stripeDisconnect = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await paymentService.disconnectStripeAccount(req, userId);
    res.json({ success: true, message: 'Stripe account disconnected' });
});

// ─── Webhooks ─────────────────────────────────────────────────────────────────

exports.handleMobileMoneyWebhook = asyncHandler(async (req, res) => {
    const result = await paymentService.handleMobileMoneyWebhook(req, req.body);
    res.json(result);
});

exports.handleStripeWebhook = asyncHandler(async (req, res) => {
    let event;
    const rawBody = req.body;

    if (process.env.STRIPE_WEBHOOK_SECRET && stripe) {
        const sig = req.headers['stripe-signature'];
        if (!sig) return res.status(400).json({ error: 'Stripe-Signature header missing' });

        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid Stripe signature' });
        }
    } else {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.warn('STRIPE_WEBHOOK_SECRET is not defined; skipping Stripe webhook signature verification');
        } else {
            console.warn('Stripe SDK not available; skipping Stripe webhook signature verification');
        }
        event = req.body || {};
    }

    const result = await paymentService.handleStripeWebhook(req, event);
    res.json(result);
});

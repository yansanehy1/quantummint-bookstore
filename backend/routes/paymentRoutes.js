const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Exchange Rates
router.get('/exchange-rate', paymentController.getExchangeRate);

// Protected: all payment routes require auth
router.post('/deposit', authenticateToken, paymentController.initiateDeposit);
router.post('/withdraw', authenticateToken, paymentController.initiateWithdrawal);

// Stripe Connect OAuth
router.get('/stripe/connect', authenticateToken, paymentController.stripeConnectInit);
router.get('/stripe/callback', paymentController.stripeConnectCallback); // no auth: OAuth redirect
router.delete('/stripe/disconnect', authenticateToken, paymentController.stripeDisconnect);

// Webhooks – no auth, verified by provider signature
router.post('/webhooks/orange', paymentController.handleMobileMoneyWebhook);
router.post('/webhooks/afrimoney', paymentController.handleMobileMoneyWebhook);
router.post('/webhooks/qmoney', paymentController.handleMobileMoneyWebhook);
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;

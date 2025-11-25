"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const app = (0, express_1.default)();
app.use(express_1.default.raw({ type: 'application/json' }));
const serviceRegistry = new service_registry_client_1.ServiceRegistryClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
app.post('/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object);
                break;
            case 'charge.refunded':
                await handleRefund(event.data.object);
                break;
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook handling error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
app.post('/webhooks/orange-money', async (req, res) => {
    const { transactionId, status, amount, currency } = req.body;
    try {
        if (status === 'SUCCESS') {
            await handleMobileMoneySuccess('orange', transactionId, amount, currency);
        }
        else {
            await handleMobileMoneyFailure('orange', transactionId, status);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Orange Money webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
async function handlePaymentSuccess(paymentIntent) {
    const { metadata } = paymentIntent;
    if (metadata?.orderId) {
        const orderService = await serviceRegistry.discover('order-service');
        await fetch(`${orderService[0].serviceUrl}/orders/${metadata.orderId}/complete`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactionId: paymentIntent.id, paymentMethod: 'stripe' }) });
        const walletService = await serviceRegistry.discover('wallet-service');
        await fetch(`${walletService[0].serviceUrl}/wallets/${metadata.userId}/credit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: paymentIntent.amount / 100, currency: paymentIntent.currency, type: 'deposit', transactionId: paymentIntent.id }) });
        const notificationService = await serviceRegistry.discover('notification-service');
        await fetch(`${notificationService[0].serviceUrl}/notifications/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'payment_success', userId: metadata.userId, data: { amount: paymentIntent.amount / 100, currency: paymentIntent.currency, orderId: metadata.orderId } }) });
    }
}
async function handlePaymentFailure(_pi) { }
async function handleRefund(_charge) { }
async function handleMobileMoneySuccess(provider, transactionId, amount, currency) {
    const orderService = await serviceRegistry.discover('order-service');
    const orderResponse = await fetch(`${orderService[0].serviceUrl}/orders/by-transaction/${transactionId}`);
    if (orderResponse.ok) {
        const order = await orderResponse.json();
        await fetch(`${orderService[0].serviceUrl}/orders/${order.id}/complete`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactionId, paymentMethod: provider }) });
        const notificationService = await serviceRegistry.discover('notification-service');
        await fetch(`${notificationService[0].serviceUrl}/sms/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: order.userPhone, template: 'payment-confirmation-mobile', data: { amount, currency, orderId: order.id } }) });
    }
}
async function handleMobileMoneyFailure(_provider, _transactionId, _status) { }
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Webhook handler running on port ${PORT}`);
});

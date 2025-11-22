import express from 'express';
import Stripe from 'stripe';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';

const app = express();
app.use(express.raw({ type: 'application/json' }));

const serviceRegistry = new ServiceRegistryClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess((event.data.object as any));
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure((event.data.object as any));
        break;
      case 'charge.refunded':
        await handleRefund((event.data.object as any));
        break;
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.post('/webhooks/orange-money', async (req, res) => {
  const { transactionId, status, amount, currency } = req.body as any;
  try {
    if (status === 'SUCCESS') {
      await handleMobileMoneySuccess('orange', transactionId, amount, currency);
    } else {
      await handleMobileMoneyFailure('orange', transactionId, status);
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Orange Money webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handlePaymentSuccess(paymentIntent: any) {
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

async function handlePaymentFailure(_pi: any) { /* TODO: log + notify */ }
async function handleRefund(_charge: any) { /* TODO: idempotent refund actions */ }

async function handleMobileMoneySuccess(provider: string, transactionId: string, amount: number, currency: string) {
  const orderService = await serviceRegistry.discover('order-service');
  const orderResponse = await fetch(`${orderService[0].serviceUrl}/orders/by-transaction/${transactionId}`);
  if (orderResponse.ok) {
    const order = await orderResponse.json();
    await fetch(`${orderService[0].serviceUrl}/orders/${order.id}/complete`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactionId, paymentMethod: provider }) });
    const notificationService = await serviceRegistry.discover('notification-service');
    await fetch(`${notificationService[0].serviceUrl}/sms/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: order.userPhone, template: 'payment-confirmation-mobile', data: { amount, currency, orderId: order.id } }) });
  }
}

async function handleMobileMoneyFailure(_provider: string, _transactionId: string, _status: string) { /* TODO */ }

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Webhook handler running on port ${PORT}`);
});

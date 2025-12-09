import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { subscriptionManager } from './subscription-manager';
import { billingEngine } from './billing-engine';
import { initializePayGoManager, getPayGoManager } from './paygo-manager';
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
    try {
        const health = await checkHealth();
        const isHealthy = health.database && health.redis;

        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? 'healthy' : 'unhealthy',
            service: 'subscription-service',
            timestamp: new Date().toISOString(),
            checks: health
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            service: 'subscription-service',
            error: 'Health check failed'
        });
    }
});

// ===============================
// SUBSCRIPTION PLANS ROUTES
// ===============================

// Get all plans
app.get('/api/plans', async (req: Request, res: Response) => {
    try {
        const featured = req.query.featured === 'true';
        const plans = await subscriptionManager.getPlans(featured);
        res.json({ success: true, data: plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch plans' });
    }
});

// Get specific plan
app.get('/api/plans/:id', async (req: Request, res: Response) => {
    try {
        const plan = await subscriptionManager.getPlan(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, error: 'Plan not found' });
        }
        res.json({ success: true, data: plan });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch plan' });
    }
});

// ===============================
// SUBSCRIPTION MANAGEMENT ROUTES
// ===============================

// Create new subscription
app.post('/api/subscriptions/create', async (req: Request, res: Response) => {
    try {
        const { user_id, plan_id, payment_method, coupon_code } = req.body;

        if (!user_id || !plan_id) {
            return res.status(400).json({
                success: false,
                error: 'user_id and plan_id are required'
            });
        }

        const subscription = await subscriptionManager.createSubscription({
            user_id,
            plan_id,
            payment_method,
            coupon_code
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get active subscription for user
app.get('/api/subscriptions/:userId/active', async (req: Request, res: Response) => {
    try {
        const subscription = await subscriptionManager.getActiveSubscription(req.params.userId);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: 'No active subscription found'
            });
        }

        res.json({ success: true, data: subscription });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch subscription' });
    }
});

// Pause subscription
app.post('/api/subscriptions/:id/pause', async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, error: 'user_id is required' });
        }

        const subscription = await subscriptionManager.pauseSubscription(req.params.id, user_id);
        res.json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Error pausing subscription:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Resume subscription
app.post('/api/subscriptions/:id/resume', async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, error: 'user_id is required' });
        }

        const subscription = await subscriptionManager.resumeSubscription(req.params.id, user_id);
        res.json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Error resuming subscription:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Extend subscription
app.post('/api/subscriptions/:id/extend', async (req: Request, res: Response) => {
    try {
        const { user_id, extension_seconds } = req.body;

        if (!user_id || !extension_seconds) {
            return res.status(400).json({
                success: false,
                error: 'user_id and extension_seconds are required'
            });
        }

        const subscription = await subscriptionManager.extendSubscription(
            req.params.id,
            user_id,
            extension_seconds
        );

        res.json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Error extending subscription:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Cancel subscription
app.post('/api/subscriptions/:id/cancel', async (req: Request, res: Response) => {
    try {
        const { user_id, immediate } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, error: 'user_id is required' });
        }

        const subscription = await subscriptionManager.cancelSubscription(
            req.params.id,
            user_id,
            immediate === true
        );

        res.json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// ===============================
// ACCESS CONTROL ROUTES
// ===============================

// Check access to content
app.post('/api/access/check', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, product_type, requested_quality } = req.body;

        if (!user_id || !product_id || !product_type) {
            return res.status(400).json({
                success: false,
                error: 'user_id, product_id, and product_type are required'
            });
        }

        const result = await subscriptionManager.checkAccess({
            user_id,
            product_id,
            product_type,
            requested_quality
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error checking access:', error);
        res.status(500).json({ success: false, error: 'Failed to check access' });
    }
});

// ===============================
// BILLING & PAYMENT ROUTES
// ===============================

// Create payment intent
app.post('/api/billing/create-payment', async (req: Request, res: Response) => {
    try {
        const { user_id, plan_id, amount, currency, payment_method } = req.body;

        if (!user_id || !plan_id || !amount) {
            return res.status(400).json({
                success: false,
                error: 'user_id, plan_id, and amount are required'
            });
        }

        const paymentIntent = await billingEngine.createPaymentIntent({
            user_id,
            plan_id,
            amount,
            currency: currency || 'USD',
            payment_method
        });

        res.json({ success: true, data: paymentIntent });
    } catch (error: any) {
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create recurring subscription with billing
app.post('/api/billing/create-subscription', async (req: Request, res: Response) => {
    try {
        const { user_id, plan_id, price_id, payment_method_id } = req.body;

        if (!user_id || !plan_id || !price_id || !payment_method_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const result = await billingEngine.createRecurringSubscription({
            user_id,
            plan_id,
            price_id,
            payment_method_id
        });

        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error creating recurring subscription:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stripe webhook handler
app.post('/api/billing/webhooks/stripe', async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
        const result = await billingEngine.handleStripeWebhook(
            req.body,
            signature as string
        );

        res.json({ received: true, ...result });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Calculate refund
app.post('/api/billing/calculate-refund', async (req: Request, res: Response) => {
    try {
        const { subscription_id } = req.body;

        if (!subscription_id) {
            return res.status(400).json({ success: false, error: 'subscription_id is required' });
        }

        const refund = await billingEngine.calculateRefund(subscription_id);
        res.json({ success: true, data: refund });
    } catch (error: any) {
        console.error('Error calculating refund:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Process refund
app.post('/api/billing/process-refund', async (req: Request, res: Response) => {
    try {
        const { subscription_id, amount, reason } = req.body;

        if (!subscription_id || !amount) {
            return res.status(400).json({
                success: false,
                error: 'subscription_id and amount are required'
            });
        }

        const result = await billingEngine.processRefund({
            subscription_id,
            amount,
            reason: reason || 'User requested cancellation'
        });

        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error processing refund:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// USAGE TRACKING ROUTES
// ===============================

// Track usage
app.post('/api/usage/track', async (req: Request, res: Response) => {
    try {
        const {
            subscription_id,
            user_id,
            product_id,
            product_type,
            usage_type,
            duration_seconds,
            quality,
            device_id,
            ip_address,
            user_agent
        } = req.body;

        if (!subscription_id || !user_id || !product_id || !product_type || !usage_type) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        await subscriptionManager.trackUsage({
            subscription_id,
            user_id,
            product_id,
            product_type,
            usage_type,
            duration_seconds: duration_seconds || 0,
            quality,
            device_id,
            ip_address,
            user_agent
        });

        res.json({ success: true, message: 'Usage tracked successfully' });
    } catch (error) {
        console.error('Error tracking usage:', error);
        res.status(500).json({ success: false, error: 'Failed to track usage' });
    }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Subscription service listening on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(async () => {
        await closeConnections();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(async () => {
        await closeConnections();
        process.exit(0);
    });
});

export default app;

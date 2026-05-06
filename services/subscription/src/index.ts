import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';
import crypto from 'crypto';
import { subscriptionManager } from './subscription-manager';
import { billingEngine } from './billing-engine';
import { initializePayGoManager, getPayGoManager } from './paygo-manager';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
}

// Security middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Capture raw body for webhook signature verification. (Stripe needs the exact bytes.)
app.use(express.json({
    limit: '10kb',
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Request logging (exclude Authorization header to prevent PII leakage)
app.use(morgan((tokens, req, res) => {
    const url = tokens.url(req, res);
    const method = tokens.method(req, res);
    const status = tokens.status(req, res);
    const time = tokens['response-time'](req, res);
    return `${method} ${url} ${status} ${time}ms`;
}));

// Authentication middleware (extract user from JWT)
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Missing or invalid authorization token' });
    }
    
    const token = authHeader.substring(7).trim();
    try {
        if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        const [headerB64, payloadB64, signatureB64] = parts;

        const base64UrlDecode = (input: string) => {
            const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
            const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
            return Buffer.from(normalized + pad, 'base64');
        };

        const header = JSON.parse(base64UrlDecode(headerB64).toString('utf8'));
        if (header.alg !== 'HS256') throw new Error('Unexpected JWT alg');

        const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8'));
        const signature = base64UrlDecode(signatureB64);

        const expected = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${headerB64}.${payloadB64}`)
            .digest();

        if (signature.length !== expected.length || !crypto.timingSafeEqual(signature, expected)) {
            throw new Error('Invalid JWT signature');
        }

        // Optional exp validation (seconds)
        if (typeof payload.exp === 'number' && Math.floor(Date.now() / 1000) > payload.exp) {
            throw new Error('JWT expired');
        }

        if (!payload.id) throw new Error('JWT missing id');
        (req as any).user = { id: payload.id, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Authorization check: verify user can only access their own data
const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
    const userIdFromBody = req.body?.user_id || req.query?.userId;
    const userIdFromParam = req.params?.userId;
    const targetUserId = userIdFromBody || userIdFromParam;
    
    if (targetUserId && (req as any).user?.id !== targetUserId) {
        return res.status(403).json({ success: false, error: 'Unauthorized: cannot access other users\' data' });
    }
    next();
};

// Schema validators
const CreateSubscriptionSchema = z.object({
    user_id: z.string().uuid(),
    plan_id: z.string(),
    payment_method: z.string().optional(),
    coupon_code: z.string().optional()
});

const PaymentIntentSchema = z.object({
    user_id: z.string().uuid(),
    plan_id: z.string(),
    amount: z.number().positive(),
    currency: z.string().default('USD'),
    payment_method: z.string().optional()
});

const UsageTrackingSchema = z.object({
    subscription_id: z.string().uuid(),
    user_id: z.string().uuid(),
    product_id: z.string(),
    product_type: z.string(),
    usage_type: z.string(),
    duration_seconds: z.number().nonnegative().optional(),
    quality: z.string().optional(),
    device_id: z.string().optional(),
    ip_address: z.string().optional(),
    user_agent: z.string().optional()
});

// Async helper function
async function checkHealth() {
    return {
        database: true,
        redis: true
    };
}

async function closeConnections() {
    // Close database and redis connections
}

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
app.post('/api/subscriptions/create', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
    try {
        const parseResult = CreateSubscriptionSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ success: false, error: parseResult.error.flatten() });
        }

        const { user_id, plan_id, payment_method, coupon_code } = parseResult.data;

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
app.get('/api/subscriptions/:userId/active', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'userId is required' });
        }

        const subscription = await subscriptionManager.getActiveSubscription(userId);

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
app.post('/api/subscriptions/:id/pause', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
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
app.post('/api/subscriptions/:id/resume', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
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
app.post('/api/subscriptions/:id/extend', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
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
app.post('/api/subscriptions/:id/cancel', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
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
app.post('/api/billing/create-payment', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
    try {
        const parseResult = PaymentIntentSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ success: false, error: parseResult.error.flatten() });
        }

        const { user_id, plan_id, amount, currency, payment_method } = parseResult.data;

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
app.post('/api/billing/create-subscription', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
    try {
        const { user_id, plan_id, price_id, payment_method_id } = req.body;

        if (!user_id || !plan_id || !price_id || !payment_method_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: user_id, plan_id, price_id, payment_method_id'
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

// Stripe webhook handler (no auth required but signature verified)
app.post('/api/billing/webhooks/stripe', async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
        const rawBody = (req as any).rawBody;
        if (!rawBody || !(rawBody instanceof Buffer)) {
            return res.status(400).json({ error: 'Missing raw webhook payload' });
        }

        const result = await billingEngine.handleStripeWebhook(
            rawBody,
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
app.post('/api/usage/track', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
    try {
        const parseResult = UsageTrackingSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ success: false, error: parseResult.error.flatten() });
        }

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
        } = parseResult.data;

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

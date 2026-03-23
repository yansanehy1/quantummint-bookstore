import Stripe from 'stripe';
import { query, queryOne } from './database';
import { UserSubscription, SubscriptionInvoice } from './types';

// Initialize payment providers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret?: string;
}

export interface BillingResult {
    success: boolean;
    payment_id?: string;
    invoice_id?: string;
    error?: string;
}

export class BillingEngine {
    /**
     * Create a payment intent for one-time subscription purchase
     */
    async createPaymentIntent(params: {
        user_id: string;
        plan_id: string;
        amount: number;
        currency: string;
        payment_method?: string;
    }): Promise<PaymentIntent> {
        const { user_id, amount, currency, payment_method } = params;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency.toLowerCase(),
                payment_method: payment_method,
                confirmation_method: 'manual',
                confirm: false,
                metadata: {
                    user_id,
                    plan_id: params.plan_id,
                },
            });

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                client_secret: paymentIntent.client_secret || undefined,
            };
        } catch (error: any) {
            throw new Error(`Stripe payment intent creation failed: ${error.message}`);
        }
    }

    /**
     * Create recurring subscription with Stripe
     */
    async createRecurringSubscription(params: {
        user_id: string;
        plan_id: string;
        price_id: string; // Stripe price ID
        payment_method_id: string;
    }): Promise<{ subscription_id: string; status: string }> {
        const { user_id, price_id, payment_method_id } = params;

        try {
            // Create or get Stripe customer
            const customer = await this.getOrCreateStripeCustomer(user_id);

            // Attach payment method to customer
            await stripe.paymentMethods.attach(payment_method_id, {
                customer: customer.id,
            });

            // Set as default payment method
            await stripe.customers.update(customer.id, {
                invoice_settings: {
                    default_payment_method: payment_method_id,
                },
            });

            // Create subscription
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: price_id }],
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription',
                },
                expand: ['latest_invoice.payment_intent'],
            });

            return {
                subscription_id: subscription.id,
                status: subscription.status,
            };
        } catch (error: any) {
            throw new Error(`Stripe subscription creation failed: ${error.message}`);
        }
    }

    /**
     * Get or create Stripe customer for user
     */
    private async getOrCreateStripeCustomer(user_id: string): Promise<any> {
        // Check if customer exists in database
        const existing = await queryOne<{ stripe_customer_id: string }>(
            `SELECT metadata->>'stripe_customer_id' as stripe_customer_id 
       FROM user_subscriptions 
       WHERE user_id = $1 
       AND metadata->>'stripe_customer_id' IS NOT NULL 
       LIMIT 1`,
            [user_id]
        );

        if (existing && existing.stripe_customer_id) {
            return await stripe.customers.retrieve(existing.stripe_customer_id);
        }

        // Create new customer
        const customer = await stripe.customers.create({
            metadata: { user_id },
        });

        return customer;
    }

    /**
     * Process payment webhook from Stripe
     */
    async handleStripeWebhook(
        payload: string | Buffer,
        signature: string
    ): Promise<{ processed: boolean; event_type: string }> {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

        try {
            const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

            // Log webhook event
            await query(
                `INSERT INTO subscription_events (event_id, event_type, provider, payload) 
         VALUES ($1, $2, $3, $4)`,
                [event.id, event.type, 'stripe', JSON.stringify(event)]
            );

            // Handle different event types
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(event.data.object);
                    break;

                case 'invoice.payment_succeeded':
                    await this.handleInvoicePaymentSuccess(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handleInvoicePaymentFailure(event.data.object);
                    break;

                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdate(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCancellation(event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            // Mark event as processed
            await query(
                `UPDATE subscription_events SET processed = true, processed_at = NOW() 
         WHERE event_id = $1`,
                [event.id]
            );

            return {
                processed: true,
                event_type: event.type,
            };
        } catch (error: any) {
            throw new Error(`Webhook processing failed: ${error.message}`);
        }
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
        const user_id = paymentIntent.metadata.user_id;
        const plan_id = paymentIntent.metadata.plan_id;

        // Create invoice record
        await this.createInvoice({
            user_id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            payment_provider: 'stripe',
            payment_id: paymentIntent.id,
            status: 'paid',
        });
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailure(paymentIntent: any): Promise<void> {
        const user_id = paymentIntent.metadata.user_id;

        // Update subscription status if applicable
        await query(
            `UPDATE user_subscriptions 
       SET status = 'suspended', 
           renewal_attempts = renewal_attempts + 1,
           updated_at = NOW()
       WHERE user_id = $1 
       AND status = 'active'`,
            [user_id]
        );
    }

    /**
     * Handle invoice payment success
     */
    private async handleInvoicePaymentSuccess(invoice: any): Promise<void> {
        const subscription_id = invoice.subscription;
        const amount = invoice.amount_paid / 100;

        await this.createInvoice({
            user_id: invoice.customer_metadata?.user_id,
            amount,
            currency: invoice.currency,
            payment_provider: 'stripe',
            payment_id: invoice.payment_intent,
            status: 'paid',
        });
    }

    /**
     * Handle invoice payment failure
     */
    private async handleInvoicePaymentFailure(invoice: any): Promise<void> {
        // Mark invoice as failed
        await query(
            `UPDATE subscription_invoices 
       SET status = 'uncollectible', updated_at = NOW() 
       WHERE payment_id = $1`,
            [invoice.payment_intent]
        );
    }

    /**
     * Handle subscription update from Stripe
     */
    private async handleSubscriptionUpdate(subscription: any): Promise<void> {
        const metadata = subscription.metadata;
        const user_id = metadata.user_id;

        // Update subscription status
        const status_map: Record<string, string> = {
            active: 'active',
            past_due: 'suspended',
            canceled: 'cancelled',
            unpaid: 'suspended',
        };

        await query(
            `UPDATE user_subscriptions 
       SET status = $1,
           subscription_provider_id = $2,
           current_period_end = $3,
           updated_at = NOW()
       WHERE user_id = $4 
       AND subscription_provider_id = $2`,
            [
                status_map[subscription.status] || subscription.status,
                subscription.id,
                new Date(subscription.current_period_end * 1000),
                user_id,
            ]
        );
    }

    /**
     * Handle subscription cancellation
     */
    private async handleSubscriptionCancellation(subscription: any): Promise<void> {
        await query(
            `UPDATE user_subscriptions 
       SET status = 'cancelled',
           cancelled_at = NOW(),
           updated_at = NOW()
       WHERE subscription_provider_id = $1`,
            [subscription.id]
        );
    }

    /**
     * Create invoice record
     */
    async createInvoice(params: {
        user_id: string;
        amount: number;
        currency: string;
        payment_provider: string;
        payment_id: string;
        status: string;
        subscription_id?: string;
    }): Promise<SubscriptionInvoice> {
        const {
            user_id,
            amount,
            currency,
            payment_provider,
            payment_id,
            status,
            subscription_id,
        } = params;

        // Generate invoice number
        const invoice_number = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const invoice = await queryOne<SubscriptionInvoice>(
            `INSERT INTO subscription_invoices (
        subscription_id, user_id, invoice_number,
        period_start, period_end, due_date,
        subtotal_amount, total_amount, currency,
        status, payment_method, payment_id, payment_provider
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
            [
                subscription_id || null,
                user_id,
                invoice_number,
                new Date(),
                new Date(),
                new Date(),
                amount,
                amount,
                currency.toUpperCase(),
                status,
                payment_provider,
                payment_id,
                payment_provider,
            ]
        );

        if (!invoice) {
            throw new Error('Failed to create invoice');
        }

        return invoice;
    }

    /**
     * Calculate refund amount for cancellation
     */
    async calculateRefund(subscription_id: string): Promise<{ refund_amount: number; reason: string }> {
        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions WHERE id = $1`,
            [subscription_id]
        );

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        const now = new Date();
        const periodEnd = new Date(subscription.current_period_end);
        const periodStart = new Date(subscription.current_period_start);

        const totalDuration = periodEnd.getTime() - periodStart.getTime();
        const remainingDuration = periodEnd.getTime() - now.getTime();

        if (remainingDuration <= 0) {
            return { refund_amount: 0, reason: 'Subscription period already ended' };
        }

        // Get last invoice
        const lastInvoice = await queryOne<SubscriptionInvoice>(
            `SELECT * FROM subscription_invoices 
       WHERE subscription_id = $1 
       AND status = 'paid' 
       ORDER BY created_at DESC 
       LIMIT 1`,
            [subscription_id]
        );

        if (!lastInvoice) {
            return { refund_amount: 0, reason: 'No paid invoice found' };
        }

        // Calculate pro-rated refund (unused time)
        const prorationPercentage = remainingDuration / totalDuration;
        const refundAmount = lastInvoice.total_amount * prorationPercentage;

        return {
            refund_amount: Math.round(refundAmount * 100) / 100,
            reason: `Pro-rated refund for ${Math.round(prorationPercentage * 100)}% unused time`,
        };
    }

    /**
     * Process refund
     */
    async processRefund(params: {
        subscription_id: string;
        amount: number;
        reason: string;
    }): Promise<{ success: boolean; refund_id?: string }> {
        const { subscription_id, amount, reason } = params;

        // Get last payment
        const lastInvoice = await queryOne<SubscriptionInvoice>(
            `SELECT * FROM subscription_invoices 
       WHERE subscription_id = $1 
       AND status = 'paid' 
       ORDER BY created_at DESC 
       LIMIT 1`,
            [subscription_id]
        );

        if (!lastInvoice || !lastInvoice.payment_id) {
            throw new Error('No payment found to refund');
        }

        try {
            // Process refund with Stripe
            const refund = await stripe.refunds.create({
                payment_intent: lastInvoice.payment_id,
                amount: Math.round(amount * 100),
                reason: 'requested_by_customer',
                metadata: {
                    subscription_id,
                    reason,
                },
            });

            // Update invoice
            await query(
                `UPDATE subscription_invoices 
         SET status = 'void', 
             notes = $1,
             updated_at = NOW() 
         WHERE id = $2`,
                [`Refunded: ${reason}`, lastInvoice.id]
            );

            return {
                success: true,
                refund_id: refund.id,
            };
        } catch (error: any) {
            throw new Error(`Refund processing failed: ${error.message}`);
        }
    }
}

// Export singleton instance
export const billingEngine = new BillingEngine();

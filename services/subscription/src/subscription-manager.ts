import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, cacheGet, cacheSet, cacheDel } from './database';
import {
    SubscriptionPlan,
    UserSubscription,
    CreateSubscriptionRequest,
    AccessCheckRequest,
    AccessCheckResponse,
} from './types';

export class SubscriptionManager {
    /**
     * Get all active subscription plans
     */
    async getPlans(featured_only: boolean = false): Promise<SubscriptionPlan[]> {
        const cacheKey = `plans:${featured_only ? 'featured' : 'all'}`;

        // Check cache first
        const cached = await cacheGet<SubscriptionPlan[]>(cacheKey);
        if (cached) return cached;

        const whereClause = featured_only
            ? 'WHERE is_active = true AND is_featured = true'
            : 'WHERE is_active = true';

        const plans = await query<SubscriptionPlan>(
            `SELECT * FROM subscription_plans ${whereClause} ORDER BY sort_order ASC`
        );

        // Cache for 1 hour
        await cacheSet(cacheKey, plans, 3600);
        return plans;
    }

    /**
     * Get a specific plan by ID or SKU
     */
    async getPlan(identifier: string): Promise<SubscriptionPlan | null> {
        const cacheKey = `plan:${identifier}`;

        const cached = await cacheGet<SubscriptionPlan>(cacheKey);
        if (cached) return cached;

        const plan = await queryOne<SubscriptionPlan>(
            `SELECT * FROM subscription_plans WHERE id = $1 OR sku = $2 LIMIT 1`,
            [identifier, identifier]
        );

        if (plan) {
            await cacheSet(cacheKey, plan, 3600);
        }

        return plan;
    }

    /**
     * Create a new subscription for a user
     */
    async createSubscription(request: CreateSubscriptionRequest): Promise<UserSubscription> {
        const { user_id, plan_id, payment_method, coupon_code } = request;

        // Get plan details
        const plan = await this.getPlan(plan_id);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        if (!plan.is_active) {
            throw new Error('Subscription plan is not available');
        }

        // Calculate subscription period
        const startTime = new Date();
        const endTime = this.calculateEndTime(startTime, plan);

        // Check if user already has an active subscription
        const existing = await this.getActiveSubscription(user_id);
        if (existing && existing.status === 'active') {
            throw new Error('User already has an active subscription');
        }

        // Determine if this is a trial
        const isInTrial = plan.trial_period_days > 0;
        const trialStart = isInTrial ? startTime : null;
        const trialEnd = isInTrial
            ? new Date(startTime.getTime() + plan.trial_period_days * 24 * 60 * 60 * 1000)
            : null;

        // Create subscription record
        const subscription = await queryOne<UserSubscription>(
            `INSERT INTO user_subscriptions (
        user_id, plan_id, status,
        current_period_start, current_period_end,
        payment_provider, is_in_trial,
        trial_start, trial_end,
        billing_cycle_anchor,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
            [
                user_id,
                plan.id,
                isInTrial ? 'trial' : 'active',
                startTime,
                endTime,
                payment_method || 'stripe',
                isInTrial,
                trialStart,
                trialEnd,
                startTime,
                JSON.stringify({ coupon_code: coupon_code || null })
            ]
        );

        if (!subscription) {
            throw new Error('Failed to create subscription');
        }

        // Clear user's subscription cache
        await this.clearSubscriptionCache(user_id);

        return subscription;
    }

    /**
     * Get user's active subscription
     */
    async getActiveSubscription(userId: string): Promise<UserSubscription | null> {
        const cacheKey = `subscription:active:${userId}`;

        const cached = await cacheGet<UserSubscription>(cacheKey);
        if (cached) return cached;

        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 
       AND status IN ('active', 'trial', 'paused')
       AND current_period_end > NOW()
       ORDER BY current_period_end DESC
       LIMIT 1`,
            [userId]
        );

        if (subscription) {
            await cacheSet(cacheKey, subscription, 300); // 5 minute cache
        }

        return subscription;
    }

    /**
     * Check if user has access to content
     */
    async checkAccess(request: AccessCheckRequest): Promise<AccessCheckResponse> {
        const { user_id, product_id, product_type, requested_quality = '1080p' } = request;

        // Get active subscription
        const subscription = await this.getActiveSubscription(user_id);

        if (!subscription) {
            return {
                access: false,
                reason: 'no_active_subscription',
                message: 'No active subscription found'
            };
        }

        // Check if subscription is expired
        if (new Date(subscription.current_period_end) < new Date()) {
            await this.expireSubscription(subscription.id);
            return {
                access: false,
                reason: 'subscription_expired',
                message: 'Your subscription has expired'
            };
        }

        // Get plan details
        const plan = await this.getPlan(subscription.plan_id);
        if (!plan) {
            return {
                access: false,
                reason: 'invalid_plan',
                message: 'Subscription plan not found'
            };
        }

        // Check product type access
        if (!plan.allowed_product_types.includes(product_type)) {
            return {
                access: false,
                reason: 'product_type_not_allowed',
                message: `Your plan does not include ${product_type} content`
            };
        }

        // Check quality access
        const qualityLevels = ['480p', '720p', '1080p', '4K'];
        const maxQualityIndex = qualityLevels.indexOf(plan.max_quality);
        const requestedQualityIndex = qualityLevels.indexOf(requested_quality);

        if (requestedQualityIndex > maxQualityIndex) {
            return {
                access: false,
                reason: 'quality_not_allowed',
                message: `Your plan supports up to ${plan.max_quality} quality`
            };
        }

        // Calculate remaining time
        const remainingSeconds = await this.getRemainingSeconds(user_id, subscription);

        if (remainingSeconds <= 0) {
            return {
                access: false,
                reason: 'time_exhausted',
                message: 'Your allocated time has been used'
            };
        }

        // All checks passed
        return {
            access: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                current_period_end: subscription.current_period_end
            },
            remaining_seconds: remainingSeconds,
            max_quality: plan.max_quality,
            max_concurrent_streams: plan.max_concurrent_streams
        };
    }

    /**
     * Track content usage
     */
    async trackUsage(params: {
        subscription_id: string;
        user_id: string;
        product_id: string;
        product_type: string;
        usage_type: 'stream' | 'download' | 'view';
        duration_seconds: number;
        quality?: string;
        device_id?: string;
        ip_address?: string;
        user_agent?: string;
    }): Promise<void> {
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
        } = params;

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration_seconds * 1000);

        // Insert usage record
        await query(
            `INSERT INTO subscription_usage (
        subscription_id, user_id, product_id, product_type,
        usage_type, start_time, end_time, duration_seconds,
        quality, device_id, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                subscription_id,
                user_id,
                product_id,
                product_type,
                usage_type,
                startTime,
                endTime,
                duration_seconds,
                quality,
                device_id,
                ip_address,
                user_agent
            ]
        );

        // Update subscription usage counters
        await query(
            `UPDATE user_subscriptions 
       SET total_seconds_consumed = total_seconds_consumed + $1,
           seconds_consumed_this_period = seconds_consumed_this_period + $1,
           last_access_time = NOW(),
           ${usage_type === 'stream' ? 'streams_this_month = streams_this_month + 1,' : ''}
           ${usage_type === 'download' ? 'downloads_this_month = downloads_this_month + 1,' : ''}
           products_accessed_this_month = products_accessed_this_month + 1
       WHERE id = $2`,
            [duration_seconds, subscription_id]
        );

        // Clear cache
        await this.clearSubscriptionCache(user_id);
    }

    /**
     * Pause a subscription
     */
    async pauseSubscription(subscriptionId: string, userId: string): Promise<UserSubscription> {
        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions WHERE id = $1 AND user_id = $2`,
            [subscriptionId, userId]
        );

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        if (subscription.status !== 'active') {
            throw new Error('Only active subscriptions can be paused');
        }

        // Calculate remaining seconds
        const remainingSeconds = await this.getRemainingSeconds(userId, subscription);

        // Update subscription status
        const updated = await queryOne<UserSubscription>(
            `UPDATE user_subscriptions 
       SET status = 'paused',
           metadata = jsonb_set(
             metadata,
             '{paused_at}',
             to_jsonb(NOW()::text)
           ) || jsonb_build_object(
             'remaining_seconds_when_paused', $1
           ),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
            [remainingSeconds, subscriptionId]
        );

        if (!updated) {
            throw new Error('Failed to pause subscription');
        }

        await this.clearSubscriptionCache(userId);
        return updated;
    }

    /**
     * Resume a paused subscription
     */
    async resumeSubscription(subscriptionId: string, userId: string): Promise<UserSubscription> {
        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions WHERE id = $1 AND user_id = $2`,
            [subscriptionId, userId]
        );

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        if (subscription.status !== 'paused') {
            throw new Error('Only paused subscriptions can be resumed');
        }

        // Get remaining seconds from metadata
        const remainingSeconds = subscription.metadata?.remaining_seconds_when_paused || 0;

        // Calculate new end time
        const newEndTime = new Date(Date.now() + remainingSeconds * 1000);

        // Update subscription
        const updated = await queryOne<UserSubscription>(
            `UPDATE user_subscriptions 
       SET status = 'active',
           current_period_start = NOW(),
           current_period_end = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
            [newEndTime, subscriptionId]
        );

        if (!updated) {
            throw new Error('Failed to resume subscription');
        }

        await this.clearSubscriptionCache(userId);
        return updated;
    }

    /**
     * Extend subscription by adding time
     */
    async extendSubscription(
        subscriptionId: string,
        userId: string,
        extensionSeconds: number
    ): Promise<UserSubscription> {
        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions WHERE id = $1 AND user_id = $2`,
            [subscriptionId, userId]
        );

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        const currentEnd = new Date(subscription.current_period_end);
        const newEnd = new Date(currentEnd.getTime() + extensionSeconds * 1000);

        const updated = await queryOne<UserSubscription>(
            `UPDATE user_subscriptions 
       SET current_period_end = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
            [newEnd, subscriptionId]
        );

        if (!updated) {
            throw new Error('Failed to extend subscription');
        }

        await this.clearSubscriptionCache(userId);
        return updated;
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(
        subscriptionId: string,
        userId: string,
        immediate: boolean = false
    ): Promise<UserSubscription> {
        const subscription = await queryOne<UserSubscription>(
            `SELECT * FROM user_subscriptions WHERE id = $1 AND user_id = $2`,
            [subscriptionId, userId]
        );

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        if (immediate) {
            // Cancel immediately
            const updated = await queryOne<UserSubscription>(
                `UPDATE user_subscriptions 
         SET status = 'cancelled',
             cancelled_at = NOW(),
             current_period_end = NOW(),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
                [subscriptionId]
            );

            if (!updated) {
                throw new Error('Failed to cancel subscription');
            }

            await this.clearSubscriptionCache(userId);
            return updated;
        } else {
            // Cancel at period end
            const updated = await queryOne<UserSubscription>(
                `UPDATE user_subscriptions 
         SET cancel_at_period_end = true,
             cancelled_at = NOW(),
             auto_renew = false,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
                [subscriptionId]
            );

            if (!updated) {
                throw new Error('Failed to mark subscription for cancellation');
            }

            await this.clearSubscriptionCache(userId);
            return updated;
        }
    }

    /**
     * Calculate subscription end time based on plan
     */
    private calculateEndTime(startTime: Date, plan: SubscriptionPlan): Date {
        const milliseconds = plan.access_duration_seconds * 1000;
        return new Date(startTime.getTime() + milliseconds);
    }

    /**
     * Get remaining seconds in subscription
     */
    private async getRemainingSeconds(
        userId: string,
        subscription?: UserSubscription
    ): Promise<number> {
        if (!subscription) {
            subscription = await this.getActiveSubscription(userId);
            if (!subscription) return 0;
        }

        const now = new Date();
        const end = new Date(subscription.current_period_end);

        if (now >= end) {
            return 0;
        }

        const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);
        return Math.max(0, remaining);
    }

    /**
     * Expire a subscription
     */
    private async expireSubscription(subscriptionId: string): Promise<void> {
        await query(
            `UPDATE user_subscriptions 
       SET status = 'expired',
           updated_at = NOW()
       WHERE id = $1`,
            [subscriptionId]
        );
    }

    /**
     * Clear subscription cache for user
     */
    private async clearSubscriptionCache(userId: string): Promise<void> {
        await cacheDel(`subscription:active:${userId}`);
    }
}

// Export singleton instance
export const subscriptionManager = new SubscriptionManager();

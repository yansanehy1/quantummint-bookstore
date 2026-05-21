import * as Sentry from "@sentry/react";

// Analytics Service
// Handles analytics tracking and reporting

class AnalyticsService {
    private enabled: boolean = false;

    constructor() {
        this.enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    }

    /**
     * Track page view
     */
    trackPageView(pageName: string, properties?: Record<string, any>): void {
        if (!this.enabled) return;

        console.log('Page View:', pageName, properties);

        // Track as breadcrumb in Sentry
        Sentry.addBreadcrumb({
            category: 'navigation',
            message: `Page View: ${pageName}`,
            data: properties,
            level: 'info',
        });
    }

    /**
     * Track event
     */
    trackEvent(
        eventName: string,
        category: string,
        properties?: Record<string, any>
    ): void {
        if (!this.enabled) return;

        console.log('Event:', eventName, category, properties);

        // Track as breadcrumb in Sentry
        Sentry.addBreadcrumb({
            category: category,
            message: eventName,
            data: properties,
            level: 'info',
        });
    }

    /**
     * Track user action
     */
    trackAction(action: string, details?: Record<string, any>): void {
        this.trackEvent(action, 'user_action', details);
    }

    /**
     * Track book interaction
     */
    trackBookInteraction(
        bookId: string,
        action: 'view' | 'play' | 'pause' | 'complete',
        metadata?: Record<string, any>
    ): void {
        this.trackEvent(`book_${action}`, 'book_interaction', {
            book_id: bookId,
            ...metadata
        });
    }

    /**
     * Track subscription event
     */
    trackSubscription(
        action: 'subscribe' | 'upgrade' | 'cancel',
        tier: string,
        amount: number
    ): void {
        this.trackEvent(`subscription_${action}`, 'subscription', {
            tier,
            amount,
            currency: 'SLL'
        });
    }

    /**
     * Track payment event
     */
    trackPayment(
        type: 'deposit' | 'withdrawal' | 'payout',
        amount: number,
        method: string,
        success: boolean
    ): void {
        this.trackEvent(`payment_${type}`, 'payment', {
            amount,
            method,
            success,
            currency: 'SLL'
        });
    }

    /**
     * Track error
     */
    trackError(error: Error, context?: Record<string, any>): void {
        if (!this.enabled) return;

        console.error('Error tracked:', error, context);

        // Track with Sentry
        Sentry.captureException(error, {
            extra: context,
        });
    }

    /**
     * Track performance metric
     */
    trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
        if (!this.enabled) return;

        console.log('Performance:', metric, value, unit);

        // Track performance via Sentry measurement
        Sentry.setMeasurement(metric, value, unit as Sentry.MeasurementUnit);
    }

    /**
     * Set user properties
     */
    setUserProperties(userId: string, properties: Record<string, any>): void {
        if (!this.enabled) return;

        console.log('User properties:', userId, properties);

        // Set user context in Sentry
        Sentry.setUser({
            id: userId,
            ...properties
        });
    }

    /**
     * Track conversion
     */
    trackConversion(
        conversionType: string,
        value: number,
        currency: string = 'SLL'
    ): void {
        this.trackEvent('conversion', 'conversion', {
            conversion_type: conversionType,
            value,
            currency
        });
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;

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

        // TODO: Integrate with analytics service (Google Analytics, Mixpanel, etc.)
        // Example: gtag('event', 'page_view', { page_title: pageName, ...properties });
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

        // TODO: Integrate with analytics service
        // Example: gtag('event', eventName, { event_category: category, ...properties });
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

        // TODO: Integrate with error tracking service (Sentry, etc.)
        // Example: Sentry.captureException(error, { extra: context });
    }

    /**
     * Track performance metric
     */
    trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
        if (!this.enabled) return;

        console.log('Performance:', metric, value, unit);

        // TODO: Integrate with performance monitoring
    }

    /**
     * Set user properties
     */
    setUserProperties(userId: string, properties: Record<string, any>): void {
        if (!this.enabled) return;

        console.log('User properties:', userId, properties);

        // TODO: Integrate with analytics service
        // Example: gtag('set', 'user_properties', properties);
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

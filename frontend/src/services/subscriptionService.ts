// Subscription Service
// Handles subscription management, upgrades, and status tracking

import api from '../utils/api';
import type { Subscription } from '../types';
import { PRICING } from '../types';

export type SubscriptionTier = '12hours' | '24hours' | '7days' | '30days';

class SubscriptionService {
    private currentSubscription: Subscription | null = null;

    /**
     * Get current active subscription
     */
    async getCurrentSubscription(): Promise<Subscription | null> {
        try {
            this.currentSubscription = await api.subscriptions.getCurrent();
            return this.currentSubscription;
        } catch (error) {
            console.error('Failed to get subscription:', error);
            return null;
        }
    }

    /**
     * Subscribe to a tier
     */
    async subscribe(tier: SubscriptionTier, currency: 'USD' | 'SLL' = 'SLL'): Promise<Subscription> {
        try {
            const subscription = await api.subscriptions.subscribe(tier, currency);
            this.currentSubscription = subscription;
            this.broadcastSubscriptionChange();
            return subscription;
        } catch (error) {
            console.error('Subscription failed:', error);
            throw error;
        }
    }

    /**
     * Upgrade subscription
     */
    async upgrade(tier: SubscriptionTier, currency: 'USD' | 'SLL' = 'SLL'): Promise<Subscription> {
        try {
            const subscription = await api.subscriptions.upgrade(tier, currency);
            this.currentSubscription = subscription;
            this.broadcastSubscriptionChange();
            return subscription;
        } catch (error) {
            console.error('Upgrade failed:', error);
            throw error;
        }
    }

    /**
     * Cancel subscription
     */
    async cancel(): Promise<void> {
        try {
            await api.subscriptions.cancel();
            this.currentSubscription = null;
            this.broadcastSubscriptionChange();
        } catch (error) {
            console.error('Cancellation failed:', error);
            throw error;
        }
    }

    /**
     * Get subscription history
     */
    async getHistory(): Promise<Subscription[]> {
        try {
            return await api.subscriptions.getHistory();
        } catch (error) {
            console.error('Failed to get history:', error);
            throw error;
        }
    }

    /**
     * Check if user has active subscription
     */
    hasActiveSubscription(): boolean {
        if (!this.currentSubscription) return false;

        const now = new Date();
        const endDate = new Date(this.currentSubscription.endDate);

        return this.currentSubscription.isActive && endDate > now;
    }

    /**
     * Get remaining time in subscription
     */
    getRemainingTime(): { days: number; hours: number; minutes: number } | null {
        if (!this.currentSubscription || !this.hasActiveSubscription()) {
            return null;
        }

        const now = new Date();
        const endDate = new Date(this.currentSubscription.endDate);
        const diff = endDate.getTime() - now.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    }

    /**
     * Get subscription tier details
     */
    getTierDetails(tier: SubscriptionTier) {
        return PRICING.subscription[tier];
    }

    /**
     * Calculate upgrade cost
     */
    calculateUpgradeCost(currentTier: SubscriptionTier, newTier: SubscriptionTier): number {
        const currentPrice = PRICING.subscription[currentTier].priceSLL;
        const newPrice = PRICING.subscription[newTier].priceSLL;

        // Pro-rate based on remaining time
        const remaining = this.getRemainingTime();
        if (!remaining) return newPrice;

        // Simple calculation: pay difference
        return Math.max(0, newPrice - currentPrice);
    }

    /**
     * Broadcast subscription change
     */
    private broadcastSubscriptionChange(): void {
        window.dispatchEvent(new CustomEvent('subscription-change', {
            detail: { subscription: this.currentSubscription }
        }));
    }

    /**
     * Listen to subscription changes
     */
    onSubscriptionChange(callback: (subscription: Subscription | null) => void): () => void {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent;
            callback(customEvent.detail.subscription);
        };

        window.addEventListener('subscription-change', handler);

        return () => window.removeEventListener('subscription-change', handler);
    }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;

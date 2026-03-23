// Usage Tracking Service
// Handles listening session tracking and cost calculation

import api from '../utils/api';
import { PRICING } from '../types';
import subscriptionService from './subscriptionService';

export interface UsageSession {
    sessionId: string;
    bookId: string;
    chapterId: string;
    startTime: Date;
    duration: number;
    cost: number;
}

class UsageTrackingService {
    private activeSession: UsageSession | null = null;
    private intervalId: NodeJS.Timeout | null = null;

    /**
     * Start a new listening session
     */
    async startSession(bookId: string, chapterId: string): Promise<string> {
        try {
            // End any existing session
            if (this.activeSession) {
                await this.endSession();
            }

            const { sessionId } = await api.usage.startSession(bookId, chapterId);

            this.activeSession = {
                sessionId,
                bookId,
                chapterId,
                startTime: new Date(),
                duration: 0,
                cost: 0
            };

            // Start tracking
            this.startTracking();

            return sessionId;
        } catch (error) {
            console.error('Failed to start session:', error);
            throw error;
        }
    }

    /**
     * Update session duration
     */
    private async updateSession(): Promise<void> {
        if (!this.activeSession) return;

        const now = new Date();
        const duration = Math.floor((now.getTime() - this.activeSession.startTime.getTime()) / 1000);
        this.activeSession.duration = duration;

        // Calculate cost (only if not subscribed)
        const hasSubscription = subscriptionService.hasActiveSubscription();
        if (!hasSubscription) {
            const minutes = duration / 60;
            this.activeSession.cost = minutes * PRICING.payPerUse.perMinuteSLL;
        }

        try {
            await api.usage.updateSession(this.activeSession.sessionId, duration);
        } catch (error) {
            console.error('Failed to update session:', error);
        }
    }

    /**
     * End current session
     */
    async endSession(): Promise<{ cost: number }> {
        if (!this.activeSession) {
            return { cost: 0 };
        }

        this.stopTracking();

        try {
            const result = await api.usage.endSession(
                this.activeSession.sessionId,
                this.activeSession.duration
            );

            this.activeSession = null;

            return result;
        } catch (error) {
            console.error('Failed to end session:', error);
            throw error;
        }
    }

    /**
     * Get current session info
     */
    getCurrentSession(): UsageSession | null {
        return this.activeSession;
    }

    /**
     * Get usage history
     */
    async getHistory(): Promise<Array<{
        bookId: string;
        bookTitle: string;
        duration: number;
        cost: number;
        date: string;
    }>> {
        try {
            return await api.usage.getHistory();
        } catch (error) {
            console.error('Failed to get usage history:', error);
            throw error;
        }
    }

    /**
     * Start automatic tracking
     */
    private startTracking(): void {
        // Update every 30 seconds
        this.intervalId = setInterval(() => {
            this.updateSession();
        }, 30000);
    }

    /**
     * Stop automatic tracking
     */
    private stopTracking(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Calculate cost for duration
     */
    calculateCost(durationSeconds: number): number {
        const minutes = durationSeconds / 60;
        return minutes * PRICING.payPerUse.perMinuteSLL;
    }

    /**
     * Format duration
     */
    formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
}

export const usageTrackingService = new UsageTrackingService();
export default usageTrackingService;

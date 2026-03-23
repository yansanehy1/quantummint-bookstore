// Earnings Service
// Handles creator earnings tracking and payout management

import api from '../utils/api';

export interface EarningsData {
    totalEarnings: number;
    subscriptionRevenue: number;
    payPerUseRevenue: number;
    pendingPayout: number;
}

export interface BookEarnings {
    bookId: string;
    totalEarnings: number;
    totalListeners: number;
    totalListeningTime: number;
}

export interface PayoutHistory {
    id: string;
    amount: number;
    method: string;
    status: 'pending' | 'completed' | 'failed';
    date: string;
}

class EarningsService {
    /**
     * Get total earnings
     */
    async getEarnings(): Promise<EarningsData> {
        try {
            return await api.earnings.getEarnings();
        } catch (error) {
            console.error('Failed to get earnings:', error);
            throw error;
        }
    }

    /**
     * Get earnings for specific book
     */
    async getBookEarnings(bookId: string): Promise<BookEarnings> {
        try {
            return await api.earnings.getBookEarnings(bookId);
        } catch (error) {
            console.error('Failed to get book earnings:', error);
            throw error;
        }
    }

    /**
     * Get payout history
     */
    async getPayoutHistory(): Promise<PayoutHistory[]> {
        try {
            return await api.earnings.getPayoutHistory();
        } catch (error) {
            console.error('Failed to get payout history:', error);
            throw error;
        }
    }

    /**
     * Calculate creator share (75%)
     */
    calculateCreatorShare(totalRevenue: number): number {
        return totalRevenue * 0.75;
    }

    /**
     * Calculate platform share (25%)
     */
    calculatePlatformShare(totalRevenue: number): number {
        return totalRevenue * 0.25;
    }

    /**
     * Format earnings for display
     */
    formatEarnings(amount: number, currency: 'SLL' | 'USD' = 'SLL'): string {
        const prefix = currency === 'SLL' ? 'Le ' : '$';
        return `${prefix}${amount.toFixed(2)}`;
    }

    /**
     * Convert SLL to USD
     */
    convertToUSD(sll: number): number {
        const EXCHANGE_RATE = 0.017; // 1 SLL = $0.017 USD
        return sll * EXCHANGE_RATE;
    }

    /**
     * Convert USD to SLL
     */
    convertToSLL(usd: number): number {
        const EXCHANGE_RATE = 0.017;
        return usd / EXCHANGE_RATE;
    }

    /**
     * Calculate earnings growth
     */
    calculateGrowth(current: number, previous: number): {
        amount: number;
        percentage: number;
    } {
        const amount = current - previous;
        const percentage = previous > 0 ? (amount / previous) * 100 : 0;

        return { amount, percentage };
    }
}

export const earningsService = new EarningsService();
export default earningsService;

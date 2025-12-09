import { analyticsClient } from '../client';
import type { LearningPatterns } from '../../types/api';

export const analyticsService = {
    /**
     * Get user learning patterns
     */
    async getUserLearningPatterns(userId: string, timeframe = '30d'): Promise<LearningPatterns> {
        return analyticsClient.get<LearningPatterns>(`/analytics/users/${userId}/patterns`, {
            params: { timeframe },
        });
    },

    /**
     * Generate learning report
     */
    async generateLearningReport(userId: string, timeframe = '30d'): Promise<any> {
        return analyticsClient.get(`/analytics/users/${userId}/report`, {
            params: { timeframe },
        });
    },

    /**
     * Get book analytics (seller/admin)
     */
    async getBookAnalytics(bookId: string): Promise<any> {
        return analyticsClient.get(`/analytics/books/${bookId}`);
    },
};

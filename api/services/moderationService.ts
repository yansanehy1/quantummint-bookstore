import { ApiClient } from '../client';

// Moderation service - typically internal, but accessible for admin dashboard
const moderationClient = new ApiClient('http://localhost:3007'); // Assumed port

export const moderationService = {
    /**
     * Moderate content (books, reviews, comments)
     */
    async moderateContent(data: {
        id: string;
        type: 'book' | 'review' | 'comment';
        content: string;
        authorId?: string;
        images?: string[];
    }): Promise<{
        approved: boolean;
        confidence: number;
        flags: string[];
        requiredAction: 'approve' | 'reject' | 'review' | 'none';
    }> {
        return moderationClient.post('/moderate', data);
    },

    /**
     * Get moderation history
     */
    async getModerationHistory(contentId: string): Promise<any[]> {
        return moderationClient.get(`/moderate/history/${contentId}`);
    },

    /**
     * Manual review (admin)
     */
    async manualReview(contentId: string, action: 'approve' | 'reject', reason?: string): Promise<void> {
        return moderationClient.post(`/moderate/review/${contentId}`, { action, reason });
    },

    /**
     * Get pending reviews
     */
    async getPendingReviews(): Promise<any[]> {
        return moderationClient.get('/moderate/pending');
    },
};

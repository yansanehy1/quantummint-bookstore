import { referralClient } from '../client';
import type { Referral } from '../../types/api';

export const referralService = {
    /**
     * Get user referral data
     */
    async getUserReferral(userId: string): Promise<Referral> {
        return referralClient.get<Referral>(`/referrals/${userId}`);
    },

    /**
     * Generate referral code
     */
    async generateCode(userId: string): Promise<Referral> {
        return referralClient.post<Referral>('/referrals/generate', { userId });
    },

    /**
     * Track referral click
     */
    async trackClick(code: string): Promise<void> {
        return referralClient.post(`/referrals/track/click`, { code });
    },

    /**
     * Get referral leaderboard
     */
    async getLeaderboard(limit = 10): Promise<Referral[]> {
        return referralClient.get<Referral[]>('/referrals/leaderboard', {
            params: { limit },
        });
    },
};

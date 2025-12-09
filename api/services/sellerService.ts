import { sellerClient } from '../client';

export const sellerService = {
    /**
     * Register as seller
     */
    async registerSeller(data: {
        userId: string;
        businessName?: string;
        documents?: any;
        bankDetails?: any;
    }): Promise<any> {
        return sellerClient.post('/sellers/register', data);
    },

    /**
     * Get seller profile
     */
    async getSellerProfile(sellerId: string): Promise<any> {
        return sellerClient.get(`/sellers/${sellerId}`);
    },

    /**
     * Update seller profile
     */
    async updateSellerProfile(sellerId: string, data: any): Promise<any> {
        return sellerClient.put(`/sellers/${sellerId}`, data);
    },

    /**
     * Get seller earnings
     */
    async getEarnings(sellerId: string, timeframe = '30d'): Promise<any> {
        return sellerClient.get(`/sellers/${sellerId}/earnings`, {
            params: { timeframe },
        });
    },

    /**
     * Request payout
     */
    async requestPayout(sellerId: string, amount: number, currency: 'USD' | 'SLL'): Promise<any> {
        return sellerClient.post(`/sellers/${sellerId}/payout`, { amount, currency });
    },

    /**
     * Get seller books
     */
    async getSellerBooks(sellerId: string): Promise<any[]> {
        return sellerClient.get(`/sellers/${sellerId}/books`);
    },
};

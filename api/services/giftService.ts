import { ApiClient, API_URLS } from '../client';

// Create gift service client
const giftClient = new ApiClient(API_URLS.gift || 'http://localhost:3014');

export const giftService = {
    /**
     * Send book as gift
     */
    async sendGift(data: {
        bookId: string;
        recipientEmail: string;
        recipientPhone?: string;
        message?: string;
        senderName: string;
    }): Promise<any> {
        return giftClient.post('/gifts/send', data);
    },

    /**
     * Get sent gifts
     */
    async getSentGifts(userId: string): Promise<any[]> {
        return giftClient.get(`/gifts/sent/${userId}`);
    },

    /**
     * Get received gifts
     */
    async getReceivedGifts(userId: string): Promise<any[]> {
        return giftClient.get(`/gifts/received/${userId}`);
    },

    /**
     * Claim gift
     */
    async claimGift(giftId: string): Promise<void> {
        return giftClient.post(`/gifts/${giftId}/claim`);
    },

    /**
     * Get gift status
     */
    async getGiftStatus(giftId: string): Promise<any> {
        return giftClient.get(`/gifts/${giftId}/status`);
    },
};

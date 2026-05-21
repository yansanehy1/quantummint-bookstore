import { paymentClient } from '../client';

export const paymentService = {
    /**
     * Create Stripe payment intent
     */
    async createStripePayment(data: {
        amount: number;
        currency: string;
        orderId: string;
        userId: string;
    }): Promise<{ clientSecret: string; paymentIntentId: string }> {
        return paymentClient.post('/payments/stripe/create', data);
    },

    /**
     * Create Orange Money payment
     */
    async createOrangeMoneyPayment(data: {
        amount: number;
        currency: string;
        phone: string;
        orderId: string;
    }): Promise<any> {
        return paymentClient.post('/payments/orange-money/create', data);
    },

    /**
     * Check payment status
     */
    async getPaymentStatus(transactionId: string): Promise<{
        status: 'pending' | 'completed' | 'failed';
        orderId?: string;
    }> {
        return paymentClient.get(`/payments/status/${transactionId}`);
    },

    /**
     * Request refund for a completed purchase (main API)
     */
    async requestRefund(purchaseId: string, reason: string): Promise<{ success: boolean; message: string }> {
        const { refundsAPI } = await import('../../utils/api');
        return refundsAPI.submit({ purchaseId, reason });
    },
};

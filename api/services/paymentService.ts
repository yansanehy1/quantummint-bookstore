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
     * Request refund
     */
    async requestRefund(orderId: string, reason: string): Promise<void> {
        return paymentClient.post('/payments/refund', { orderId, reason });
    },
};

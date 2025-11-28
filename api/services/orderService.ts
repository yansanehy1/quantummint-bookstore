import { orderClient } from '../client';
import type { Order } from '../../types/api';

export const orderService = {
    /**
     * Create new order
     */
    async createOrder(data: {
        bookId: string;
        amount: number;
        currency: 'USD' | 'SLL';
        paymentMethod: 'wallet' | 'stripe' | 'orange_money';
    }): Promise<Order> {
        return orderClient.post<Order>('/orders', data);
    },

    /**
     * Get user orders
     */
    async getUserOrders(userId: string): Promise<Order[]> {
        return orderClient.get<Order[]>(`/orders/user/${userId}`);
    },

    /**
     * Get order by ID
     */
    async getOrderById(id: string): Promise<Order> {
        return orderClient.get<Order>(`/orders/${id}`);
    },

    /**
     * Complete order
     */
    async completeOrder(id: string, transactionId: string, paymentMethod: string): Promise<void> {
        return orderClient.put(`/orders/${id}/complete`, { transactionId, paymentMethod });
    },

    /**
     * Check user access to book
     */
    async checkAccess(bookId: string): Promise<boolean> {
        try {
            await orderClient.get(`/orders/access/${bookId}`);
            return true;
        } catch {
            return false;
        }
    },
};

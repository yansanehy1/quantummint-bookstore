import { adminClient } from '../client';

export const adminService = {
    /**
     * Get pending book submissions
     */
    async getPendingBooks(): Promise<any[]> {
        return adminClient.get('/admin/books/pending');
    },

    /**
     * Approve book
     */
    async approveBook(bookId: string): Promise<void> {
        return adminClient.put(`/admin/books/${bookId}/approve`);
    },

    /**
     * Reject book
     */
    async rejectBook(bookId: string, reason: string): Promise<void> {
        return adminClient.put(`/admin/books/${bookId}/reject`, { reason });
    },

    /**
     * Get all users (admin only)
     */
    async getAllUsers(page = 1, limit = 50): Promise<any> {
        return adminClient.get('/admin/users', {
            params: { page, limit },
        });
    },

    /**
     * Update user role
     */
    async updateUserRole(userId: string, role: 'user' | 'seller' | 'admin'): Promise<void> {
        return adminClient.put(`/admin/users/${userId}/role`, { role });
    },

    /**
     * Get platform statistics
     */
    async getPlatformStats(): Promise<any> {
        return adminClient.get('/admin/stats');
    },

    /**
     * Manage wallet (admin)
     */
    async manageWallet(walletId: string, action: 'freeze' | 'unfreeze'): Promise<void> {
        return adminClient.put(`/admin/wallets/${walletId}/${action}`);
    },
};

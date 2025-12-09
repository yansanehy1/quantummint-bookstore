import { notificationClient } from '../client';
import type { Notification } from '../../types/api';

export const notificationService = {
    /**
     * Get user notifications
     */
    async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
        return notificationClient.get<Notification[]>(`/notifications/${userId}`, {
            params: { limit },
        });
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string): Promise<void> {
        return notificationClient.put(`/notifications/${notificationId}/read`);
    },

    /**
     * Send notification (internal)
     */
    async sendNotification(data: {
        type: string;
        userId?: string;
        target?: string;
        data: any;
    }): Promise<void> {
        return notificationClient.post('/notifications/send', data);
    },

    /**
     * Delete notification
     */
    async deleteNotification(notificationId: string): Promise<void> {
        return notificationClient.delete(`/notifications/${notificationId}`);
    },
};

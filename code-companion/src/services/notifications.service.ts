import { api } from '@/lib/api';

export const notificationsService = {
    async getAll(filters?: { isRead?: boolean; type?: string }) {
        const params = new URLSearchParams();
        if (filters?.isRead !== undefined) params.set('isRead', String(filters.isRead));
        if (filters?.type) params.set('type', filters.type);
        const query = params.toString();
        return api.get<any[]>(`/notifications${query ? `?${query}` : ''}`);
    },

    async getUnreadCount() {
        return api.get<{ count: number }>('/notifications/unread-count');
    },

    async markAsRead(id: string) {
        return api.patch(`/notifications/${id}/read`);
    },

    async markAllAsRead() {
        return api.patch('/notifications/read-all');
    },

    async deleteNotification(id: string) {
        return api.delete(`/notifications/${id}`);
    },

    async clearAll() {
        return api.delete('/notifications');
    },
};

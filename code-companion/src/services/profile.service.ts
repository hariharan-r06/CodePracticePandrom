import { api } from '@/lib/api';

export const profileService = {
    async getMyProfile() {
        return api.get<any>('/profile');
    },

    async getById(id: string) {
        return api.get<any>(`/profile/${id}`);
    },

    async update(data: { full_name?: string }) {
        return api.patch<any>('/profile', data);
    },

    async getHeatmap() {
        return api.get<{ date: string; count: number }[]>('/profile/heatmap');
    },
};

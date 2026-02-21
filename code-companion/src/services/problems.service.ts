import { api } from '@/lib/api';

export const problemsService = {
    async getAll(filters?: { pattern_id?: string; platform?: string; difficulty?: string }) {
        const params = new URLSearchParams();
        if (filters?.pattern_id) params.set('pattern_id', filters.pattern_id);
        if (filters?.platform) params.set('platform', filters.platform);
        if (filters?.difficulty) params.set('difficulty', filters.difficulty);
        const query = params.toString();
        return api.get<any[]>(`/problems${query ? `?${query}` : ''}`);
    },

    async getById(id: string) {
        return api.get<any>(`/problems/${id}`);
    },

    async create(data: any) {
        return api.post<any>('/problems', data);
    },

    async update(id: string, data: any) {
        return api.put<any>(`/problems/${id}`, data);
    },

    async delete(id: string) {
        return api.delete(`/problems/${id}`);
    },
};

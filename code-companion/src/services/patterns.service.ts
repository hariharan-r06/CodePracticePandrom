import { api } from '@/lib/api';

export const patternsService = {
    async getAll() {
        return api.get<any[]>('/patterns');
    },

    async getById(id: string) {
        return api.get<any>(`/patterns/${id}`);
    },

    async create(data: { name: string; description: string }) {
        return api.post<any>('/patterns', data);
    },

    async update(id: string, data: { name?: string; description?: string }) {
        return api.put<any>(`/patterns/${id}`, data);
    },

    async delete(id: string) {
        return api.delete(`/patterns/${id}`);
    },
};

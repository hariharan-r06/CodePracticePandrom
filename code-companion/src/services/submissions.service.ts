import { api } from '@/lib/api';

export const submissionsService = {
    async getMySubmissions(filters?: { status?: string }) {
        const params = new URLSearchParams();
        if (filters?.status) params.set('status', filters.status);
        const query = params.toString();
        return api.get<any[]>(`/submissions${query ? `?${query}` : ''}`);
    },

    async getStats() {
        return api.get<any>('/submissions/stats');
    },

    async create(problemId: string, screenshot: File, notes?: string) {
        const formData = new FormData();
        formData.append('problem_id', problemId);
        formData.append('screenshot', screenshot);
        if (notes) formData.append('notes', notes);
        return api.post<any>('/submissions', formData);
    },

    async review(id: string, data: { status: 'approved' | 'rejected'; feedback?: string }) {
        return api.patch<any>(`/submissions/${id}/review`, data);
    },
};

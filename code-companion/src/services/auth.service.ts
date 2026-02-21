import { api } from '@/lib/api';

export const authService = {
    async login(email: string, password: string) {
        const result = await api.post<{ user: any; token: string }>('/auth/login', { email, password });
        api.setToken(result.token);
        return result;
    },

    async signup(full_name: string, email: string, password: string, role: string) {
        const result = await api.post<{ user: any; token: string }>('/auth/signup', { full_name, email, password, role });
        api.setToken(result.token);
        return result;
    },

    async getMe() {
        return api.get<any>('/auth/me');
    },

    logout() {
        api.setToken(null);
    },
};

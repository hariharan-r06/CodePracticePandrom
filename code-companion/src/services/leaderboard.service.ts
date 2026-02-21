import { api } from '@/lib/api';

export const leaderboardService = {
    async get(period: 'all' | 'week' | 'month' = 'all') {
        return api.get<any[]>(`/leaderboard?period=${period}`);
    },
};

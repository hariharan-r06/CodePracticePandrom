import { supabaseAdmin } from '../config/supabase'

export const leaderboardService = {
    async getLeaderboard(period: 'all' | 'week' | 'month' = 'all') {
        let query = supabaseAdmin
            .from('submissions')
            .select('student_id, profiles(full_name, streak, avatar_url)')
            .eq('status', 'approved')

        if (period === 'week') {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            query = query.gte('submitted_at', weekAgo.toISOString())
        } else if (period === 'month') {
            const monthAgo = new Date()
            monthAgo.setDate(monthAgo.getDate() - 30)
            query = query.gte('submitted_at', monthAgo.toISOString())
        }

        const { data: submissions, error } = await query
        if (error) throw error

        const studentMap = new Map()

        submissions.forEach((s: any) => {
            const id = s.student_id
            if (!studentMap.has(id)) {
                studentMap.set(id, {
                    id,
                    name: s.profiles.full_name,
                    streak: s.profiles.streak || 0,
                    avatar_url: s.profiles.avatar_url,
                    solved_count: 0
                })
            }
            studentMap.get(id).solved_count++
        })

        const ranked = Array.from(studentMap.values())
            .map(s => ({
                ...s,
                score: (s.solved_count * 50) + (s.streak * 10)
            }))
            .sort((a, b) => b.score - a.score)
            .map((s, index) => ({ ...s, rank: index + 1 }))

        return ranked
    }
}

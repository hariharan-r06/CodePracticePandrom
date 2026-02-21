import { supabaseAdmin } from '../config/supabase'

export const profileService = {
    async getProfile(userId: string) {
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (profileError) throw profileError

        const { data: submissions, error: submissionsError } = await supabaseAdmin
            .from('submissions')
            .select('status, problem_id, problems(pattern_id)')
            .eq('student_id', userId)

        if (submissionsError) throw submissionsError

        const approvedSubmissions = submissions.filter(s => s.status === 'approved')
        const totalSolved = approvedSubmissions.length
        const patternsCompleted = new Set(approvedSubmissions.map(s => (s.problems as any)?.pattern_id)).size

        const { data: recentSubmissions, error: recentError } = await supabaseAdmin
            .from('submissions')
            .select('*, problems(title, difficulty)')
            .eq('student_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(5)

        if (recentError) throw recentError

        const { count: totalProblems, error: probError } = await supabaseAdmin
            .from('problems')
            .select('*', { count: 'exact', head: true })

        const completionRate = (totalProblems && totalProblems > 0) ? Math.round((totalSolved / totalProblems) * 100) : 0

        return {
            ...profile,
            stats: {
                totalSolved,
                patternsCompleted,
                completionRate,
                streak: profile.streak || 0
            },
            recentSubmissions
        }
    },

    async updateProfile(userId: string, data: any) {
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .update(data)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return profile
    },

    async getActivityHeatmap(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('submissions')
            .select('submitted_at')
            .eq('student_id', userId)
            .eq('status', 'approved')

        if (error) throw error

        const counts: Record<string, number> = {}
        data.forEach(s => {
            const date = s.submitted_at.split('T')[0]
            counts[date] = (counts[date] || 0) + 1
        })

        return Object.entries(counts).map(([date, count]) => ({ date, count }))
    }
}

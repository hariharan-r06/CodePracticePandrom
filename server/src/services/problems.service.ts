import { supabaseAdmin } from '../config/supabase'
import { notificationsService } from './notifications.service'

export const problemsService = {
    async getAllProblems(filters: any = {}) {
        let query = supabaseAdmin
            .from('problems')
            .select('*, patterns(name)')

        if (filters.pattern_id) query = query.eq('pattern_id', filters.pattern_id)
        if (filters.platform) query = query.eq('platform', filters.platform)
        if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)

        const { data, error } = await query
        if (error) throw error
        return data
    },

    async getProblemsByPattern(pattern_id: string) {
        const { data, error } = await supabaseAdmin
            .from('problems')
            .select('*, patterns(name)')
            .eq('pattern_id', pattern_id)

        if (error) throw error
        return data
    },

    async getProblemById(id: string) {
        const { data, error } = await supabaseAdmin
            .from('problems')
            .select('*, patterns(name)')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async createProblem(data: any, userId: string) {
        const insertData = {
            title: data.title,
            pattern_id: data.pattern_id,
            problem_url: data.problem_url,
            reference_video_url: data.reference_video_url || data.reference_video || null,
            solution_video_url: data.solution_video_url || data.solution_video || null,
            platform: data.platform.toLowerCase(),
            difficulty: data.difficulty,
            created_by: userId,
        }

        const { data: problem, error } = await supabaseAdmin
            .from('problems')
            .insert([insertData])
            .select('*, patterns(name)')
            .single()

        if (error) throw error

        await notificationsService.broadcastToRole('all', {
            type: 'new_problem',
            title: 'New Problem Available',
            message: `A new ${problem.difficulty} problem '${problem.title}' was added to ${problem.patterns.name} on ${problem.platform}.`,
            meta: { patternName: problem.patterns.name, problemTitle: problem.title, difficulty: problem.difficulty, platform: problem.platform }
        })

        return problem
    },

    async updateProblem(id: string, data: any) {
        const { data: problem, error } = await supabaseAdmin
            .from('problems')
            .update(data)
            .eq('id', id)
            .select('*, patterns(name)')
            .single()

        if (error) throw error
        return problem
    },

    async deleteProblem(id: string) {
        const { error } = await supabaseAdmin.from('problems').delete().eq('id', id)
        if (error) throw error
    }
}

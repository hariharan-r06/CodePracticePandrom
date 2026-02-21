import { supabaseAdmin } from '../config/supabase'
import { notificationsService } from './notifications.service'

export const patternsService = {
    async getAllPatterns() {
        const { data: patterns, error } = await supabaseAdmin
            .from('patterns')
            .select('*, problems(count)')

        if (error) throw error

        return patterns.map(p => ({
            ...p,
            problem_count: p.problems[0]?.count || 0
        }))
    },

    async getPatternById(id: string) {
        const { data: pattern, error } = await supabaseAdmin
            .from('patterns')
            .select('*, problems(*)')
            .eq('id', id)
            .single()

        if (error) throw error
        return pattern
    },

    async createPattern(data: any, userId: string) {
        const { data: pattern, error } = await supabaseAdmin
            .from('patterns')
            .insert([{ ...data, created_by: userId }])
            .select()
            .single()

        if (error) throw error

        await notificationsService.broadcastToRole('all', {
            type: 'new_pattern',
            title: 'New Pattern Added 🏗️',
            message: `A new pattern '${pattern.name}' has been added. Check it out!`,
            meta: { patternId: pattern.id, patternName: pattern.name }
        })

        return pattern
    },

    async updatePattern(id: string, data: any) {
        const { data: pattern, error } = await supabaseAdmin
            .from('patterns')
            .update(data)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return pattern
    },

    async deletePattern(id: string) {
        const { error } = await supabaseAdmin.from('patterns').delete().eq('id', id)
        if (error) throw error
    }
}

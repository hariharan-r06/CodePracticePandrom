import { supabaseAdmin } from '../config/supabase'
import { sseService } from './sse.service'

export const notificationsService = {
    async getNotificationsForUser(userId: string, role: string, filters: any = {}) {
        let query = supabaseAdmin
            .from('notifications')
            .select('*')
            .or(`for_user_id.eq.${userId},for_user_id.is.null`)
            .or(`for_role.eq.${role},for_role.eq.all`)

        if (filters.isRead !== undefined) query = query.eq('is_read', filters.isRead)
        if (filters.type) query = query.eq('type', filters.type)

        const { data, error } = await query.order('created_at', { ascending: false })
        if (error) throw error
        return data
    },

    async markAsRead(notificationId: string, _userId: string) {
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
        if (error) throw error
    },

    async markAllAsRead(userId: string, role: string) {
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .match({ is_read: false })
            .or(`for_user_id.eq.${userId},and(for_user_id.is.null,for_role.in.(${role},all))`)
        if (error) throw error
    },

    async broadcastToRole(role: 'student' | 'admin' | 'all', notification: any) {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert([{ ...notification, for_role: role, for_user_id: null }])
            .select()
            .single()

        if (error) throw error
        sseService.sendToRole(role, data)
    },

    async notifyUser(userId: string, notification: any) {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert([{ ...notification, for_user_id: userId, for_role: 'student' }]) // Default role
            .select()
            .single()

        if (error) throw error
        sseService.sendToUser(userId, data)
    },

    async getUnreadCount(userId: string, role: string) {
        const { count, error } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false)
            .or(`for_user_id.eq.${userId},and(for_user_id.is.null,for_role.in.(${role},all))`)

        if (error) throw error
        return { count: count || 0 }
    },

    async deleteNotification(id: string) {
        const { error } = await supabaseAdmin.from('notifications').delete().eq('id', id)
        if (error) throw error
    },

    async clearAll(userId: string) {
        const { error } = await supabaseAdmin.from('notifications').delete().eq('for_user_id', userId)
        if (error) throw error
    }
}

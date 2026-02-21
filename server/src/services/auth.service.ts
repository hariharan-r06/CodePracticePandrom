import { supabaseAdmin } from '../config/supabase'
import { signToken } from '../utils/jwt'

export const authService = {
    async signup(data: any) {
        const { email, password, full_name, role } = data

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, role }
        })

        if (authError) throw authError

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert([{ id: authData.user.id, full_name, role }])
            .select()
            .single()

        if (profileError) throw profileError

        const token = signToken({ id: profile.id, email, role: profile.role })
        return { user: { ...profile, email }, token }
    },

    async login(data: any) {
        const { email, password } = data

        // SignIn using supabase to verify credentials
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password
        })

        if (authError) throw authError

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()

        if (profileError) throw profileError

        const token = signToken({ id: profile.id, email, role: profile.role })
        return { user: { ...profile, email }, token }
    },

    async getMe(userId: string) {
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (profileError) throw profileError

        const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
        if (authError) throw authError

        return { ...profile, email: user?.email }
    }
}

import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Anon client — respects RLS (use for user-scoped operations)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

// Service role client — bypasses RLS (use only in trusted server operations)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
    const val = process.env[key]
    if (!val) throw new Error(`Missing required env variable: ${key}`)
    return val
}

export const env = {
    PORT: parseInt(process.env.PORT || '5000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SUPABASE_URL: required('SUPABASE_URL'),
    SUPABASE_ANON_KEY: required('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_KEY: required('SUPABASE_SERVICE_KEY'),
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'submissions',
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
}

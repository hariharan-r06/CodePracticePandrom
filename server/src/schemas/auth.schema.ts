import { z } from 'zod'

export const signupSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'admin']).default('student'),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

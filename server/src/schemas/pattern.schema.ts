import { z } from 'zod'

export const createPatternSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
})

export const updatePatternSchema = createPatternSchema.partial()

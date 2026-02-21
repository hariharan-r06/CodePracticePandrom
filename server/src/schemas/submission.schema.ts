import { z } from 'zod'

export const createSubmissionSchema = z.object({
    problem_id: z.string().uuid(),
    notes: z.string().max(1000).optional(),
})

export const reviewSubmissionSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    feedback: z.string().max(500).optional(),
})

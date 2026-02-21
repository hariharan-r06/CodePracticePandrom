import { z } from 'zod'

export const createProblemSchema = z.object({
    pattern_id: z.string().uuid(),
    title: z.string().min(2).max(200),
    problem_url: z.string().url(),
    reference_video: z.string().url().optional().or(z.literal('')),
    reference_video_url: z.string().url().optional().or(z.literal('')),
    solution_video: z.string().url().optional().or(z.literal('')),
    solution_video_url: z.string().url().optional().or(z.literal('')),
    platform: z.enum(['LeetCode', 'GeeksforGeeks', 'Other', 'leetcode', 'geeksforgeeks', 'other']),
    difficulty: z.enum(['easy', 'medium', 'hard']),
})

export const updateProblemSchema = createProblemSchema.partial()


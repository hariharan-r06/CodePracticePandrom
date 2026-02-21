export interface User {
    id: string
    email: string
    full_name: string
    role: 'student' | 'admin'
    avatar_url?: string
    streak: number
    created_at: string
}

export interface Pattern {
    id: string
    name: string
    description: string
    created_by: string
    created_at: string
    problem_count?: number
}

export interface Problem {
    id: string
    pattern_id: string
    title: string
    problem_url: string
    reference_video_url?: string
    solution_video_url?: string
    platform: 'leetcode' | 'geeksforgeeks' | 'other'
    difficulty: 'easy' | 'medium' | 'hard'
    created_at: string
    pattern?: Pattern
}

export interface Submission {
    id: string
    student_id: string
    problem_id: string
    screenshot_url: string
    notes?: string
    status: 'pending' | 'approved' | 'rejected'
    feedback?: string
    submitted_at: string
    reviewed_at?: string
    student?: User
    problem?: Problem
}

export interface Notification {
    id: string
    type: 'new_problem' | 'new_pattern' | 'submission_approved' | 'submission_rejected' | 'new_submission'
    title: string
    message: string
    for_role: 'student' | 'admin' | 'all'
    for_user_id?: string
    is_read: boolean
    meta?: Record<string, any>
    created_at: string
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

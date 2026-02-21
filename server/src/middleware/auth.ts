import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { supabaseAdmin } from '../config/supabase'
import { sendError } from '../utils/response'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) return sendError(res, 'No token provided', 401)

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', decoded.id)
            .single()

        if (error || !profile) return sendError(res, 'User not found', 401)

        req.user = { ...profile, email: decoded.email }
        next()
    } catch {
        sendError(res, 'Invalid or expired token', 401)
    }
}

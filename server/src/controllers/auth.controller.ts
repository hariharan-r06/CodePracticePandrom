import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'

export const authController = {
    async signup(req: Request, res: Response) {
        try {
            const result = await authService.signup(req.body)
            sendSuccess(res, result, 'User registered successfully', 201)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body)
            sendSuccess(res, result, 'Login successful')
        } catch (err: any) {
            sendError(res, err.message, 401)
        }
    },

    async getMe(req: Request, res: Response) {
        try {
            const user = await authService.getMe(req.user!.id)
            sendSuccess(res, user)
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

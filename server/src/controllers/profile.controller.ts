import { Request, Response } from 'express'
import { profileService } from '../services/profile.service'
import { sendSuccess, sendError } from '../utils/response'

export const profileController = {
    async getMyProfile(req: Request, res: Response) {
        try {
            const profile = await profileService.getProfile(req.user!.id)
            sendSuccess(res, profile)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const profile = await profileService.getProfile(req.params.id)
            sendSuccess(res, profile)
        } catch (err: any) {
            sendError(res, err.message, 404)
        }
    },

    async update(req: Request, res: Response) {
        try {
            const profile = await profileService.updateProfile(req.user!.id, req.body)
            sendSuccess(res, profile, 'Profile updated')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getHeatmap(req: Request, res: Response) {
        try {
            const data = await profileService.getActivityHeatmap(req.user!.id)
            sendSuccess(res, data)
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

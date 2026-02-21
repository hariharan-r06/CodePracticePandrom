import { Request, Response } from 'express'
import { notificationsService } from '../services/notifications.service'
import { sseService } from '../services/sse.service'
import { sendSuccess, sendError } from '../utils/response'

export const notificationsController = {
    async getAll(req: Request, res: Response) {
        try {
            const notes = await notificationsService.getNotificationsForUser(req.user!.id, req.user!.role, req.query)
            sendSuccess(res, notes)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async stream(req: Request, res: Response) {
        sseService.addClient(req.user!.id, req.user!.role, res)
    },

    async getUnreadCount(req: Request, res: Response) {
        try {
            const result = await notificationsService.getUnreadCount(req.user!.id, req.user!.role)
            sendSuccess(res, result)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async markAsRead(req: Request, res: Response) {
        try {
            await notificationsService.markAsRead(req.params.id, req.user!.id)
            sendSuccess(res, null, 'Notification marked as read')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async markAllAsRead(req: Request, res: Response) {
        try {
            await notificationsService.markAllAsRead(req.user!.id, req.user!.role)
            sendSuccess(res, null, 'All notifications marked as read')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await notificationsService.deleteNotification(req.params.id)
            sendSuccess(res, null, 'Notification deleted')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async clearAll(req: Request, res: Response) {
        try {
            await notificationsService.clearAll(req.user!.id)
            sendSuccess(res, null, 'Repository cleared')
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

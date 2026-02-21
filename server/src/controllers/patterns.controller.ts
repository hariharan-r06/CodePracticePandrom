import { Request, Response } from 'express'
import { patternsService } from '../services/patterns.service'
import { sendSuccess, sendError } from '../utils/response'

export const patternsController = {
    async getAll(_req: Request, res: Response) {
        try {
            const patterns = await patternsService.getAllPatterns()
            sendSuccess(res, patterns)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const pattern = await patternsService.getPatternById(req.params.id)
            sendSuccess(res, pattern)
        } catch (err: any) {
            sendError(res, err.message, 404)
        }
    },

    async create(req: Request, res: Response) {
        try {
            const pattern = await patternsService.createPattern(req.body, req.user!.id)
            sendSuccess(res, pattern, 'Pattern created', 201)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async update(req: Request, res: Response) {
        try {
            const pattern = await patternsService.updatePattern(req.params.id, req.body)
            sendSuccess(res, pattern, 'Pattern updated')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await patternsService.deletePattern(req.params.id)
            sendSuccess(res, null, 'Pattern deleted')
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

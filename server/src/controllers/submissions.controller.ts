import { Request, Response } from 'express'
import { submissionsService } from '../services/submissions.service'
import { sendSuccess, sendError } from '../utils/response'

export const submissionsController = {
    async getMySubmissions(req: Request, res: Response) {
        try {
            let result
            if (req.user!.role === 'admin') {
                result = await submissionsService.getAllSubmissions(req.query)
            } else {
                result = await submissionsService.getSubmissionsByStudent(req.user!.id, req.query)
            }
            sendSuccess(res, result)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getStats(req: Request, res: Response) {
        try {
            const studentId = req.user!.role === 'admin' ? undefined : req.user!.id
            const stats = await submissionsService.getSubmissionStats(studentId)
            sendSuccess(res, stats)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getById(req: Request, res: Response) {
        try {
            // Logic for fetching single submission could be added to service
            sendSuccess(res, { id: req.params.id })
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async create(req: Request, res: Response) {
        try {
            if (!req.file) return sendError(res, 'Screenshot is required', 400)
            const submission = await submissionsService.createSubmission(req.body, req.user!.id, req.file)
            sendSuccess(res, submission, 'Submission received', 201)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async review(req: Request, res: Response) {
        try {
            const submission = await submissionsService.reviewSubmission(req.params.id, req.body, req.user!.id)
            sendSuccess(res, submission, 'Submission reviewed')
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

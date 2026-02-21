import { Request, Response } from 'express'
import { problemsService } from '../services/problems.service'
import { sendSuccess, sendError } from '../utils/response'

export const problemsController = {
    async getAll(req: Request, res: Response) {
        try {
            const problems = await problemsService.getAllProblems(req.query)
            sendSuccess(res, problems)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const problem = await problemsService.getProblemById(req.params.id)
            sendSuccess(res, problem)
        } catch (err: any) {
            sendError(res, err.message, 404)
        }
    },

    async create(req: Request, res: Response) {
        try {
            const problem = await problemsService.createProblem(req.body, req.user!.id)
            sendSuccess(res, problem, 'Problem created', 201)
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async update(req: Request, res: Response) {
        try {
            const problem = await problemsService.updateProblem(req.params.id, req.body)
            sendSuccess(res, problem, 'Problem updated')
        } catch (err: any) {
            sendError(res, err.message)
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await problemsService.deleteProblem(req.params.id)
            sendSuccess(res, null, 'Problem deleted')
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

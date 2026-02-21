import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { sendError } from '../utils/response'

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return sendError(res, errors, 422)
    }
    req.body = result.data
    next()
}

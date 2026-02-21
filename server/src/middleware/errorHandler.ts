import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'
import { env } from '../config/env'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`)

    if (err.name === 'MulterError') {
        return sendError(res, `Upload error: ${err.message}`, 400)
    }

    if (err.name === 'ZodError') {
        return sendError(res, 'Validation error', 422)
    }

    const message = env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    sendError(res, message, err.status || 500)
}

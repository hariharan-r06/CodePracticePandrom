import { Response } from 'express'

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', status = 200) => {
    res.status(status).json({ success: true, message, data })
}

export const sendError = (res: Response, error: string, status = 400) => {
    res.status(status).json({ success: false, error })
}

import { Request, Response } from 'express'
import { leaderboardService } from '../services/leaderboard.service'
import { sendSuccess, sendError } from '../utils/response'

export const leaderboardController = {
    async get(req: Request, res: Response) {
        try {
            const period = (req.query.period as 'all' | 'week' | 'month') || 'all'
            const result = await leaderboardService.getLeaderboard(period)
            sendSuccess(res, result)
        } catch (err: any) {
            sendError(res, err.message)
        }
    }
}

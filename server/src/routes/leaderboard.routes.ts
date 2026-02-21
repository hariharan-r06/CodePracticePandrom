import { Router } from 'express'
import { leaderboardController } from '../controllers/leaderboard.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, leaderboardController.get)

export default router

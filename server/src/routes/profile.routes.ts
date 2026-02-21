import { Router } from 'express'
import { profileController } from '../controllers/profile.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, profileController.getMyProfile)
router.get('/heatmap', authenticate, profileController.getHeatmap)
router.patch('/', authenticate, profileController.update)
router.get('/:id', authenticate, profileController.getById)

export default router

import { Router } from 'express'
import { submissionsController } from '../controllers/submissions.controller'
import { authenticate } from '../middleware/auth'
import { adminOnly } from '../middleware/adminOnly'
import { validate } from '../middleware/validate'
import { upload } from '../middleware/upload'
import { reviewSubmissionSchema } from '../schemas/submission.schema'

const router = Router()

router.get('/', authenticate, submissionsController.getMySubmissions)
router.get('/stats', authenticate, submissionsController.getStats)
router.get('/:id', authenticate, submissionsController.getById)
router.post('/', authenticate, upload.single('screenshot'), submissionsController.create)
router.patch('/:id/review', authenticate, adminOnly, validate(reviewSubmissionSchema), submissionsController.review)

export default router

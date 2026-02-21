import { Router } from 'express'
import { problemsController } from '../controllers/problems.controller'
import { authenticate } from '../middleware/auth'
import { adminOnly } from '../middleware/adminOnly'
import { validate } from '../middleware/validate'
import { createProblemSchema, updateProblemSchema } from '../schemas/problem.schema'

const router = Router()

router.get('/', authenticate, problemsController.getAll)
router.get('/:id', authenticate, problemsController.getById)
router.post('/', authenticate, adminOnly, validate(createProblemSchema), problemsController.create)
router.put('/:id', authenticate, adminOnly, validate(updateProblemSchema), problemsController.update)
router.delete('/:id', authenticate, adminOnly, problemsController.delete)

export default router

import { Router } from 'express'
import { patternsController } from '../controllers/patterns.controller'
import { authenticate } from '../middleware/auth'
import { adminOnly } from '../middleware/adminOnly'
import { validate } from '../middleware/validate'
import { createPatternSchema, updatePatternSchema } from '../schemas/pattern.schema'

const router = Router()

router.get('/', authenticate, patternsController.getAll)
router.get('/:id', authenticate, patternsController.getById)
router.post('/', authenticate, adminOnly, validate(createPatternSchema), patternsController.create)
router.put('/:id', authenticate, adminOnly, validate(updatePatternSchema), patternsController.update)
router.delete('/:id', authenticate, adminOnly, patternsController.delete)

export default router

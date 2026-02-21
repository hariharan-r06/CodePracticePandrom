import { Router } from 'express'
import { notificationsController } from '../controllers/notifications.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, notificationsController.getAll)
router.get('/stream', authenticate, notificationsController.stream)
router.get('/unread-count', authenticate, notificationsController.getUnreadCount)
router.patch('/:id/read', authenticate, notificationsController.markAsRead)
router.patch('/read-all', authenticate, notificationsController.markAllAsRead)
router.delete('/:id', authenticate, notificationsController.delete)
router.delete('/', authenticate, notificationsController.clearAll)

export default router

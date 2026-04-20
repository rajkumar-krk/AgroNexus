import { Router } from 'express';
import { getMyNotifications, markRead, markAllRead } from '../controllers/notificationController.js';

const router = Router();

router.get('/', getMyNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);

export default router;

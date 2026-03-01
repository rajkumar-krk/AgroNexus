import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { reportPestAlert, getNearbyAlerts, getMyAlerts, updateAlertStatus } from '../controllers/pestController.js';

const router = Router();

router.post('/report', protect, authorize('farmer', 'admin'), reportPestAlert);
router.get('/nearby', protect, getNearbyAlerts);
router.get('/my', protect, getMyAlerts);
router.put('/:alertId/status', protect, updateAlertStatus);

export default router;

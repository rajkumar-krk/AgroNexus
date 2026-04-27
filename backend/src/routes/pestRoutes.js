import { Router } from 'express';
import { reportPestAlert, getNearbyAlerts, getMyAlerts, updateAlertStatus, seedPestAlerts } from '../controllers/pestController.js';

const router = Router();

router.post('/report', reportPestAlert);
router.get('/nearby', getNearbyAlerts);
router.get('/my', getMyAlerts);
router.put('/:alertId/status', updateAlertStatus);
router.post('/seed', seedPestAlerts);

export default router;

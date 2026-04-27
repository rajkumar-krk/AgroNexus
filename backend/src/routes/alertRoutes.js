import express from 'express';
import {
  getAlerts,
  getAlertStats,
  acknowledgeAlert,
  resolveAlert
} from '../controllers/alertController.js';

const router = express.Router();

// GET /api/v1/alerts — All alerts with filtering
router.get('/', getAlerts);

// GET /api/v1/alerts/stats — Alert statistics summary
router.get('/stats', getAlertStats);

// PATCH /api/v1/alerts/:id/acknowledge — Mark alert as seen
router.patch('/:id/acknowledge', acknowledgeAlert);

// PATCH /api/v1/alerts/:id/resolve — Mark alert as resolved
router.patch('/:id/resolve', resolveAlert);

export default router;

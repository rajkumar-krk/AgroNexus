import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboardSummary, getProfitabilityReport, getCropCalendar, getInputUsageReport, getYieldDNAProfile } from '../controllers/analyticsController.js';

const router = Router();
router.get('/dashboard', protect, getDashboardSummary);
router.get('/profitability', protect, getProfitabilityReport);
router.get('/crop-calendar', protect, getCropCalendar);
router.get('/inputs', protect, getInputUsageReport);
router.get('/yield-dna', protect, getYieldDNAProfile);

export default router;

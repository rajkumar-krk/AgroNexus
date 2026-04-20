import { Router } from 'express';
import { getDashboardSummary, getProfitabilityReport, getCropCalendar, getInputUsageReport, getYieldDNAProfile } from '../controllers/analyticsController.js';

const router = Router();
router.get('/dashboard', getDashboardSummary);
router.get('/profitability', getProfitabilityReport);
router.get('/crop-calendar', getCropCalendar);
router.get('/inputs', getInputUsageReport);
router.get('/yield-dna', getYieldDNAProfile);

export default router;

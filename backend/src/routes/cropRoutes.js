import { Router } from 'express';
import { createCrop, getMyCrops, getCrop, updateCrop, deleteCrop, addInputLog, getCropAnalytics, getFarmAnalytics } from '../controllers/cropController.js';

const router = Router();

router.post('/', createCrop);
router.get('/', getMyCrops);
router.get('/analytics/farm/:farmId', getFarmAnalytics);
router.get('/:cropId', getCrop);
router.put('/:cropId', updateCrop);
router.delete('/:cropId', deleteCrop);
router.post('/:cropId/inputs', addInputLog);
router.get('/:cropId/analytics', getCropAnalytics);

export default router;

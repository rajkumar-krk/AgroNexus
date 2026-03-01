import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createCrop, getMyCrops, getCrop, updateCrop, deleteCrop, addInputLog, getCropAnalytics, getFarmAnalytics } from '../controllers/cropController.js';

const router = Router();

router.post('/', protect, createCrop);
router.get('/', protect, getMyCrops);
router.get('/analytics/farm/:farmId', protect, getFarmAnalytics);
router.get('/:cropId', protect, getCrop);
router.put('/:cropId', protect, updateCrop);
router.delete('/:cropId', protect, deleteCrop);
router.post('/:cropId/inputs', protect, addInputLog);
router.get('/:cropId/analytics', protect, getCropAnalytics);

export default router;

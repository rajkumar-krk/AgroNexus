import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAdvisories, getAdvisory, createAdvisory, searchAdvisories } from '../controllers/advisoryController.js';

const router = Router();
router.get('/', getAdvisories);
router.get('/search', searchAdvisories);
router.get('/:id', getAdvisory);
router.post('/', protect, authorize('admin'), createAdvisory);

export default router;

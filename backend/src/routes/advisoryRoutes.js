import { Router } from 'express';
import { getAdvisories, getAdvisory, createAdvisory, searchAdvisories } from '../controllers/advisoryController.js';

const router = Router();
router.get('/', getAdvisories);
router.get('/search', searchAdvisories);
router.get('/:id', getAdvisory);
router.post('/', createAdvisory);

export default router;

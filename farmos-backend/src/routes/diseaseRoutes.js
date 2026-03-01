import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDiseases, getDisease, diagnoseBySymptoms, getMyDiseaseReports } from '../controllers/diseaseController.js';

const router = Router();

router.get('/', getDiseases);
router.get('/reports/my', protect, getMyDiseaseReports);
router.get('/:id', getDisease);
router.post('/diagnose', protect, diagnoseBySymptoms);

export default router;

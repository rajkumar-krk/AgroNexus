import { Router } from 'express';
import { getDiseases, getDisease, diagnoseBySymptoms, getMyDiseaseReports } from '../controllers/diseaseController.js';

const router = Router();

router.get('/', getDiseases);
router.get('/reports/my', getMyDiseaseReports);
router.get('/:id', getDisease);
router.post('/diagnose', diagnoseBySymptoms);

export default router;

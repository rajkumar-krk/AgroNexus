import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { createFarm, getMyFarms, getFarm, updateFarm, deleteFarm, getNearbyFarms } from '../controllers/farmController.js';

const router = Router();

const createFarmValidation = [
    body('name').notEmpty().withMessage('Farm name is required'),
    body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    body('areaHectares').isFloat({ gt: 0 }).withMessage('Area must be greater than 0'),
    validate,
];

router.get('/my', getMyFarms);
router.post('/', createFarmValidation, createFarm);
router.get('/nearby', getNearbyFarms);
router.get('/:farmId', getFarm);
router.put('/:farmId', updateFarm);
router.delete('/:farmId', deleteFarm);

export default router;

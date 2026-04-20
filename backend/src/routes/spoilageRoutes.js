import express from 'express';
import { getSpoilageRisk } from '../controllers/spoilageController.js';

const router = express.Router();

router.route('/risk/:batchId?').get(getSpoilageRisk);

export default router;

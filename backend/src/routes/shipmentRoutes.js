import express from 'express';
import { getActiveShipments, getBatchShipment, updateLocation } from '../controllers/shipmentController.js';

const router = express.Router();

router.route('/').get(getActiveShipments);
router.route('/batch/:batchId').get(getBatchShipment);
router.route('/:id/location').put(updateLocation);

export default router;

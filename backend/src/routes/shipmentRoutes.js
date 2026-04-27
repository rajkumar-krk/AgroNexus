import express from 'express';
import { getActiveShipments, getBatchShipment, updateLocation, recordShipmentEvent } from '../controllers/shipmentController.js';

const router = express.Router();

router.route('/').get(getActiveShipments);
router.route('/batch/:batchId').get(getBatchShipment);
router.route('/:id/location').put(updateLocation);
router.route('/event').post(recordShipmentEvent);

export default router;

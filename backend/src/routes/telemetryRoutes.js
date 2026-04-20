import express from 'express';
import {
  getBatchTelemetry,
  addTelemetry
} from '../controllers/telemetryController.js';

const router = express.Router();

router
  .route('/')
  .post(addTelemetry);

router
  .route('/:batchId')
  .get(getBatchTelemetry);

export default router;

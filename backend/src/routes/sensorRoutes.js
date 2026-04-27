import express from 'express';
import {
  storeSensorData,
  getLiveSensorData,
  getSensorHistory,
  getGPSHistory
} from '../controllers/sensorController.js';

const router = express.Router();

// POST /api/v1/sensor/store — ESP32 sends data here
router.post('/store', storeSensorData);

// GET /api/v1/sensor/live — Latest sensor reading
router.get('/live', getLiveSensorData);

// GET /api/v1/sensor/history — Historical data for charts
router.get('/history', getSensorHistory);

// GET /api/v1/sensor/gps-history — GPS coordinate trail for map
router.get('/gps-history', getGPSHistory);

export default router;

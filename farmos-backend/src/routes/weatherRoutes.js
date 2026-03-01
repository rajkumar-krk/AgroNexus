import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getCurrentWeather, getForecast, getAlerts, getSprayWindows, getWeatherHistory } from '../controllers/weatherController.js';

const router = Router();
router.get('/current', protect, getCurrentWeather);
router.get('/forecast', protect, getForecast);
router.get('/alerts', protect, getAlerts);
router.get('/spray-windows', protect, getSprayWindows);
router.get('/history', protect, getWeatherHistory);

export default router;

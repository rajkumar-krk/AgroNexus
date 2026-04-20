import { Router } from 'express';
import { getCurrentWeather, getForecast, getAlerts, getSprayWindows, getWeatherHistory } from '../controllers/weatherController.js';

const router = Router();
router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/alerts', getAlerts);
router.get('/spray-windows', getSprayWindows);
router.get('/history', getWeatherHistory);

export default router;

import { Router } from 'express';
import { getMarketPrices, getLatestPrice, getPriceTrend, getBestSellDay } from '../controllers/marketController.js';

const router = Router();
router.get('/prices', getMarketPrices);
router.get('/latest', getLatestPrice);
router.get('/trend', getPriceTrend);
router.get('/best-sell-day', getBestSellDay);

export default router;

import express from 'express';
import {
  analyzeNow,
  getInsights,
  getLatestInsight,
  getCropAdvice,
  chatWithAI
} from '../controllers/aiController.js';

const router = express.Router();

// POST /api/v1/ai/analyze — Manually trigger Gemini analysis
router.post('/analyze', analyzeNow);

// GET /api/v1/ai/insights — AI insights history
router.get('/insights', getInsights);

// GET /api/v1/ai/insights/latest — Most recent AI insight
router.get('/insights/latest', getLatestInsight);

// POST /api/v1/ai/crop-advisor — Generate tailored agricultural strategy
router.post('/crop-advisor', getCropAdvice);

// POST /api/v1/ai/chat — Handle conversational requests for chatbot and voice
router.post('/chat', chatWithAI);

export default router;

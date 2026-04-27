import AIInsight from '../models/AIInsight.js';
import SensorData from '../models/SensorData.js';
import { analyzeSensorData } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Manually trigger AI analysis on latest DB sensor data
 * @route   POST /api/v1/ai/analyze
 * @access  Public
 */
export const analyzeNow = async (req, res) => {
  try {
    const { batchId } = req.body;

    // Get the latest sensor reading from DB
    const query = batchId ? { batchId } : {};
    const latestData = await SensorData.findOne(query).sort({ timestamp: -1 });

    if (!latestData) {
      return errorResponse(res, 'No sensor data available for analysis. Send sensor data first.', 404);
    }

    // Run Gemini AI analysis
    const insight = await analyzeSensorData(latestData);

    return successResponse(res, insight, 'AI analysis completed', 201);

  } catch (error) {
    console.error('analyzeNow error:', error);
    return errorResponse(res, error.message || 'AI analysis failed', 500);
  }
};

/**
 * @desc    Get AI insights history
 * @route   GET /api/v1/ai/insights
 * @access  Public
 */
export const getInsights = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const { batchId, risk } = req.query;

    const query = {};
    if (batchId) query.batchId = batchId;
    if (risk) query.risk = risk;

    const insights = await AIInsight.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return successResponse(res, insights, `${insights.length} AI insights`);

  } catch (error) {
    console.error('getInsights error:', error);
    return errorResponse(res, 'Failed to fetch AI insights', 500);
  }
};

/**
 * @desc    Get the latest AI insight
 * @route   GET /api/v1/ai/insights/latest
 * @access  Public
 */
export const getLatestInsight = async (req, res) => {
  try {
    const { batchId } = req.query;
    const query = batchId ? { batchId } : {};

    const insight = await AIInsight.findOne(query).sort({ createdAt: -1 });

    if (!insight) {
      return successResponse(res, null, 'No AI insights available yet');
    }

    return successResponse(res, insight, 'Latest AI insight');

  } catch (error) {
    console.error('getLatestInsight error:', error);
    return errorResponse(res, 'Failed to fetch latest insight', 500);
  }
};

import { generateCropAdvice, processChat } from '../services/geminiService.js';

export const getCropAdvice = async (req, res) => {
  try {
    const advice = await generateCropAdvice(req.body);
    return successResponse(res, advice, 'Crop advice generated');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const responseText = await processChat(req.body.message);
    return successResponse(res, responseText, 'Chat complete');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

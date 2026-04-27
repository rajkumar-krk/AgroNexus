import SensorData from '../models/SensorData.js';
import { processSensorData } from '../services/sensorPipeline.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Store incoming ESP32 sensor data — triggers full auto-processing pipeline
 * @route   POST /api/v1/sensor/store
 * @access  Public (ESP32 device)
 */
export const storeSensorData = async (req, res) => {
  try {
    const { temperature, humidity, gas, moisture, latitude, longitude, batchId, deviceId } = req.body;

    // Validate required fields
    if (temperature === undefined || humidity === undefined) {
      return errorResponse(res, 'Temperature and humidity are required', 400);
    }

    // Run the full pipeline: store → alerts → AI analysis
    const result = await processSensorData({
      temperature: Number(temperature),
      humidity: Number(humidity),
      gas: Number(gas || 0),
      moisture: Number(moisture || 0),
      latitude: Number(latitude || 0),
      longitude: Number(longitude || 0),
      batchId: batchId || null,
      deviceId: deviceId || 'ESP32-001'
    });

    return successResponse(res, {
      sensorData: result.sensorData,
      alertCount: result.alertCount,
      hasCriticalAlert: result.hasCriticalAlert,
      insight: result.insight ? {
        risk: result.insight.risk,
        issue: result.insight.issue,
        recommendation: result.insight.recommendation
      } : null
    }, 'Sensor data stored and processed', 201);

  } catch (error) {
    console.error('storeSensorData error:', error);
    return errorResponse(res, error.message || 'Failed to store sensor data', 500);
  }
};

/**
 * @desc    Get latest sensor reading (most recent record)
 * @route   GET /api/v1/sensor/live
 * @access  Public
 */
export const getLiveSensorData = async (req, res) => {
  try {
    const { batchId } = req.query;

    const query = batchId ? { batchId } : {};
    const latest = await SensorData.findOne(query).sort({ timestamp: -1 });

    if (!latest) {
      return successResponse(res, null, 'No sensor data available yet');
    }

    return successResponse(res, latest, 'Latest sensor data');
  } catch (error) {
    console.error('getLiveSensorData error:', error);
    return errorResponse(res, 'Failed to fetch live data', 500);
  }
};

/**
 * @desc    Get sensor history (last N records for charts)
 * @route   GET /api/v1/sensor/history
 * @access  Public
 */
export const getSensorHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);
    const { batchId } = req.query;

    const query = batchId ? { batchId } : {};
    const history = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    // Return in chronological order (oldest first) for chart rendering
    return successResponse(res, history.reverse(), `Last ${history.length} sensor readings`);
  } catch (error) {
    console.error('getSensorHistory error:', error);
    return errorResponse(res, 'Failed to fetch sensor history', 500);
  }
};

/**
 * @desc    Get GPS coordinate history (for polyline tracking)
 * @route   GET /api/v1/sensor/gps-history
 * @access  Public
 */
export const getGPSHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const { batchId } = req.query;

    const query = batchId
      ? { batchId, latitude: { $ne: 0 }, longitude: { $ne: 0 } }
      : { latitude: { $ne: 0 }, longitude: { $ne: 0 } };

    const points = await SensorData.find(query)
      .select('latitude longitude timestamp batchId')
      .sort({ timestamp: -1 })
      .limit(limit);

    // Return chronological order
    const coordHistory = points.reverse().map(p => ({
      lat: p.latitude,
      lng: p.longitude,
      timestamp: p.timestamp,
      batchId: p.batchId
    }));

    return successResponse(res, coordHistory, `${coordHistory.length} GPS points`);
  } catch (error) {
    console.error('getGPSHistory error:', error);
    return errorResponse(res, 'Failed to fetch GPS history', 500);
  }
};

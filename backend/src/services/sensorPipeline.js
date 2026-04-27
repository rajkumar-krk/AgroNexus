import SensorData from '../models/SensorData.js';
import { checkThresholds } from './alertService.js';
import { analyzeSensorData } from './geminiService.js';

// Debounce AI calls — only analyze every 5th reading or when thresholds trigger
let readingCount = 0;
const AI_ANALYZE_EVERY = 5; // Analyze every 5th reading to save API quota

/**
 * Full auto-processing pipeline for incoming sensor data.
 * 
 * Flow:
 * 1. Store raw sensor data in MongoDB
 * 2. Check thresholds → generate alerts if breached
 * 3. Periodically run Gemini AI analysis (or force if critical alert)
 * 
 * @param {Object} rawData - Raw sensor payload from ESP32
 * @returns {Object} - { sensorData, alerts, insight }
 */
export async function processSensorData(rawData) {
  const {
    temperature,
    humidity,
    gas = 0,
    moisture = 0,
    latitude = 0,
    longitude = 0,
    batchId = null,
    deviceId = 'ESP32-001'
  } = rawData;

  // ── Step 1: Store in MongoDB ──
  const sensorData = await SensorData.create({
    temperature,
    humidity,
    gas,
    moisture,
    latitude,
    longitude,
    batchId,
    deviceId
  });

  console.log(`📡 Sensor data stored: T=${temperature}°C H=${humidity}% G=${gas} M=${moisture}% [${batchId || 'no-batch'}]`);

  // ── Step 2: Check thresholds → auto-generate alerts ──
  const alerts = await checkThresholds(sensorData);
  const hasCriticalAlert = alerts.some(a => a.severity === 'critical');

  // ── Step 3: Gemini AI analysis (periodic or on critical) ──
  let insight = null;
  readingCount++;

  if (hasCriticalAlert || readingCount >= AI_ANALYZE_EVERY) {
    readingCount = 0; // reset counter
    try {
      insight = await analyzeSensorData(sensorData);
    } catch (err) {
      console.error('Pipeline: AI analysis failed, continuing...', err.message);
    }
  }

  return {
    sensorData,
    alerts,
    insight,
    alertCount: alerts.length,
    hasCriticalAlert
  };
}

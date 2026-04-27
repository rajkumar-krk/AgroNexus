import Alert from '../models/Alert.js';
import { sendCloudAlertEmail } from './emailService.js';

// ── Configurable Thresholds ──
const THRESHOLDS = {
  TEMP_HIGH: 35,       // °C — crop spoilage risk
  TEMP_CRITICAL: 45,   // °C — critical heat
  HUMIDITY_HIGH: 85,   // % — fungal growth risk
  HUMIDITY_LOW: 20,    // % — dehydration risk
  GAS_WARNING: 300,    // Gas sensor value — early spoilage
  GAS_DANGER: 500,     // Gas sensor value — active spoilage
  MOISTURE_LOW: 20,    // % — soil too dry
  MOISTURE_CRITICAL: 10 // % — critical dehydration
};

/**
 * Check sensor data against thresholds and auto-generate alerts.
 * Called automatically when new sensor data is stored.
 * @param {Object} sensorData - The sensor reading to evaluate
 * @returns {Array} - Array of created alerts
 */
export async function checkThresholds(sensorData) {
  const alerts = [];
  const { temperature, humidity, gas, moisture, batchId } = sensorData;

  const snapshot = {
    temperature: sensorData.temperature,
    humidity: sensorData.humidity,
    gas: sensorData.gas,
    moisture: sensorData.moisture,
    latitude: sensorData.latitude,
    longitude: sensorData.longitude
  };

  // ── Temperature Checks ──
  if (temperature > THRESHOLDS.TEMP_CRITICAL) {
    alerts.push({
      type: 'temperature',
      message: `🔥 CRITICAL: Temperature at ${temperature}°C exceeds ${THRESHOLDS.TEMP_CRITICAL}°C — immediate spoilage risk for batch ${batchId || 'N/A'}`,
      severity: 'critical',
      batchId,
      sensorSnapshot: snapshot
    });
  } else if (temperature > THRESHOLDS.TEMP_HIGH) {
    alerts.push({
      type: 'temperature',
      message: `⚠️ Temperature at ${temperature}°C exceeds safe threshold of ${THRESHOLDS.TEMP_HIGH}°C — monitor batch ${batchId || 'N/A'}`,
      severity: 'high',
      batchId,
      sensorSnapshot: snapshot
    });
  }

  // ── Gas / Spoilage Checks ──
  if (gas > THRESHOLDS.GAS_DANGER) {
    alerts.push({
      type: 'spoilage',
      message: `☠️ SPOILAGE DETECTED: Gas level ${gas} exceeds danger threshold ${THRESHOLDS.GAS_DANGER} — batch ${batchId || 'N/A'} may be compromised`,
      severity: 'critical',
      batchId,
      sensorSnapshot: snapshot
    });
  } else if (gas > THRESHOLDS.GAS_WARNING) {
    alerts.push({
      type: 'gas',
      message: `⚠️ Gas level ${gas} rising above warning threshold ${THRESHOLDS.GAS_WARNING} — early spoilage indicator for batch ${batchId || 'N/A'}`,
      severity: 'high',
      batchId,
      sensorSnapshot: snapshot
    });
  }

  // ── Moisture Checks ──
  if (moisture > 0 && moisture < THRESHOLDS.MOISTURE_CRITICAL) {
    alerts.push({
      type: 'moisture',
      message: `🏜️ CRITICAL: Soil moisture at ${moisture}% — severe dehydration risk for batch ${batchId || 'N/A'}`,
      severity: 'critical',
      batchId,
      sensorSnapshot: snapshot
    });
  } else if (moisture > 0 && moisture < THRESHOLDS.MOISTURE_LOW) {
    alerts.push({
      type: 'moisture',
      message: `💧 Soil moisture at ${moisture}% below ${THRESHOLDS.MOISTURE_LOW}% — batch ${batchId || 'N/A'} needs irrigation`,
      severity: 'medium',
      batchId,
      sensorSnapshot: snapshot
    });
  }

  // ── Humidity Checks ──
  if (humidity > THRESHOLDS.HUMIDITY_HIGH) {
    alerts.push({
      type: 'humidity',
      message: `💧 Humidity at ${humidity}% exceeds ${THRESHOLDS.HUMIDITY_HIGH}% — fungal growth risk for batch ${batchId || 'N/A'}`,
      severity: 'medium',
      batchId,
      sensorSnapshot: snapshot
    });
  } else if (humidity < THRESHOLDS.HUMIDITY_LOW) {
    alerts.push({
      type: 'humidity',
      message: `🌵 Humidity at ${humidity}% below ${THRESHOLDS.HUMIDITY_LOW}% — dehydration risk for batch ${batchId || 'N/A'}`,
      severity: 'medium',
      batchId,
      sensorSnapshot: snapshot
    });
  }

  // Store all generated alerts in DB
  const createdAlerts = [];
  for (const alertData of alerts) {
    try {
      const alert = await Alert.create(alertData);
      createdAlerts.push(alert);
      console.log(`🚨 Alert created: [${alert.severity.toUpperCase()}] ${alert.type} — ${alert.message.substring(0, 60)}...`);

      // Trigger EmailJS dispatch for High or Critical alerts
      if (alert.severity === 'high' || alert.severity === 'critical') {
        const titleCaseEvent = alert.type.charAt(0).toUpperCase() + alert.type.slice(1);
        await sendCloudAlertEmail({
          event: `${alert.severity === 'critical' ? '❌ Critical' : '⚠️ Warning'} ${titleCaseEvent} Alert`,
          status: `${titleCaseEvent} Risk`,
          location: `Lat: ${sensorData.latitude || 'Unknown'}, Lng: ${sensorData.longitude || 'Unknown'}`,
          time: new Date().toLocaleString(),
          details: alert.message
        });
      }

    } catch (err) {
      console.error('Failed to create alert:', err.message);
    }
  }

  return createdAlerts;
}

export { THRESHOLDS };

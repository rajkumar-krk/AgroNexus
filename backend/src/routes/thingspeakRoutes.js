import express from 'express';

const router = express.Router();

/**
 * POST /api/v1/thingspeak/alert
 * Receives alert payload from frontend when ThingSpeak thresholds are exceeded.
 * Logs the alert and simulates an ESP32 buzzer trigger.
 */
router.post('/alert', (req, res) => {
    const { type, value, threshold, timestamp, title, message } = req.body;

    // Log alert details
    console.log('');
    console.log('🚨 ═══════════════════════════════════════════');
    console.log(`🚨 THINGSPEAK ALERT TRIGGERED`);
    console.log(`🚨 Type:      ${type || 'unknown'}`);
    console.log(`🚨 Title:     ${title || 'N/A'}`);
    console.log(`🚨 Value:     ${value}`);
    console.log(`🚨 Threshold: ${threshold}`);
    console.log(`🚨 Message:   ${message || 'N/A'}`);
    console.log(`🚨 Time:      ${timestamp || new Date().toISOString()}`);
    console.log('🚨 ═══════════════════════════════════════════');
    console.log('');

    // Simulate buzzer trigger
    // In production, this would send an HTTP request to the ESP32:
    // await axios.post('http://ESP32_IP/buzzer', { state: 'on', duration: 5000 });
    console.log('🔊 [BUZZER] Simulated buzzer ON for 5 seconds');

    // Simulate buzzer off after 5 seconds
    setTimeout(() => {
        console.log('🔇 [BUZZER] Simulated buzzer OFF');
    }, 5000);

    res.json({
        success: true,
        message: 'Alert received and buzzer triggered (simulated)',
        alert: {
            type,
            value,
            threshold,
            timestamp: timestamp || new Date().toISOString(),
            buzzerTriggered: true,
        },
    });
});

/**
 * GET /api/v1/thingspeak/status
 * Returns the status of the ThingSpeak integration.
 */
router.get('/status', (req, res) => {
    res.json({
        success: true,
        data: {
            connected: true,
            lastAlertTime: new Date().toISOString(),
            buzzerStatus: 'standby',
            esp32Connected: false, // Will be true when physical device is connected
        },
    });
});

export default router;

// Alert Service - Handles cold chain alerts and notifications
// Future: Connect to Firebase/ESP32 hardware

export const alertService = {
  // Get active alerts
  async getActiveAlerts() {
    return [
      {
        id: 'ALT-001',
        type: 'warning',
        severity: 'medium',
        title: 'Temperature Deviation',
        message: 'Temperature deviation in Cold Room B - 4.1°C detected',
        deviceId: 'CR-002',
        timestamp: '2024-03-15T10:30:00Z',
        acknowledged: false,
        resolved: false
      },
      {
        id: 'ALT-002',
        type: 'info',
        severity: 'low',
        title: 'GPS Coverage',
        message: 'Shipment SHP-001 entered low coverage area - GPS backup active',
        deviceId: 'SHP-001',
        timestamp: '2024-03-15T09:15:00Z',
        acknowledged: true,
        resolved: false
      },
      {
        id: 'ALT-003',
        type: 'success',
        severity: 'info',
        title: 'System Status',
        message: 'All systems operational - 98% uptime this week',
        deviceId: 'SYSTEM',
        timestamp: '2024-03-15T08:00:00Z',
        acknowledged: true,
        resolved: true
      },
      {
        id: 'ALT-004',
        type: 'error',
        severity: 'high',
        title: 'Device Offline',
        message: 'Shipment Sensor 4 offline for 30 minutes',
        deviceId: 'ESP32-004',
        timestamp: '2024-03-15T07:45:00Z',
        acknowledged: false,
        resolved: false
      }
    ]
  },

  // Get alert history
  async getAlertHistory(limit = 50) {
    const alerts = []
    for (let i = 0; i < limit; i++) {
      const types = ['warning', 'info', 'success', 'error']
      const type = types[Math.floor(Math.random() * types.length)]
      alerts.push({
        id: `ALT-HIST-${i + 1}`,
        type,
        severity: type === 'error' ? 'high' : type === 'warning' ? 'medium' : 'low',
        title: `Historical Alert ${i + 1}`,
        message: `This is a historical alert entry for demonstration purposes`,
        deviceId: `DEVICE-${Math.floor(Math.random() * 10)}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString(),
        acknowledged: Math.random() > 0.3,
        resolved: Math.random() > 0.5
      })
    }
    return alerts
  },

  // Get alert statistics
  async getAlertStats() {
    return {
      total: 156,
      active: 4,
      resolved: 142,
      acknowledged: 12,
      byType: {
        error: 8,
        warning: 34,
        info: 89,
        success: 25
      },
      bySeverity: {
        high: 12,
        medium: 45,
        low: 99
      }
    }
  },

  // Acknowledge alert
  async acknowledgeAlert(alertId) {
    // Future: Update in Firebase
    return { success: true, alertId }
  },

  // Resolve alert
  async resolveAlert(alertId) {
    // Future: Update in Firebase
    return { success: true, alertId }
  }
}

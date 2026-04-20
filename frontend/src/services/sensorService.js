// Sensor Service - Safe fallbacks implemented
// Future: Connect to Firebase/ESP32 hardware

export const sensorService = {
  // Get sensor data - ALWAYS returns data
  async getSensorData() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      return {
        temperature: 4.2,
        humidity: 82,
        gasLevel: 'Normal',
        systemStatus: 'Safe',
        lastUpdate: new Date().toISOString(),
        deviceId: 'ESP32-001',
        batteryLevel: 87
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      // Always return fallback data
      return {
        temperature: 4.2,
        humidity: 82,
        gasLevel: 'Normal',
        systemStatus: 'Safe',
        lastUpdate: new Date().toISOString(),
        deviceId: 'ESP32-001',
        batteryLevel: 87
      }
    }
  },

  // Get sensor history
  async getSensorHistory(timeRange = '24h') {
    try {
      // Mock historical data
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
      return Array.from({ length: hours }, (_, i) => ({
        timestamp: new Date(Date.now() - (hours - i) * 3600000).toISOString(),
        temperature: 3.5 + Math.random() * 2,
        humidity: 78 + Math.random() * 8,
        gasLevel: Math.random() > 0.9 ? 'Warning' : 'Normal'
      }))
    } catch (error) {
      console.error('Error fetching sensor history:', error)
      // Always return fallback data
      return Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
        temperature: 3.5,
        humidity: 78,
        gasLevel: 'Normal'
      }))
    }
  },

  // Get device status - ALWAYS returns data
  async getDeviceStatus() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      return [
        {
          id: 'sensor-001',
          name: 'Temperature Sensor 1',
          status: 'online',
          temperature: 4.2,
          humidity: 82,
          batteryLevel: 85,
          signalStrength: 92,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'sensor-002',
          name: 'Humidity Sensor 1',
          status: 'online',
          temperature: 4.1,
          humidity: 83,
          batteryLevel: 88,
          signalStrength: 89,
          lastUpdate: new Date().toISOString()
        }
      ]
    } catch (error) {
      console.error('Error fetching device status:', error)
      // Return fallback device
      return [
        {
          id: 'sensor-001',
          name: 'Temperature Sensor 1',
          status: 'online',
          temperature: 4.2,
          humidity: 82,
          batteryLevel: 85,
          signalStrength: 92,
          lastUpdate: new Date().toISOString()
        }
      ]
    }
  },

  // Get device list
  async getDevices() {
    try {
      return [
        { id: 'ESP32-001', name: 'Cold Room A Sensor', status: 'Online', battery: 87 },
        { id: 'ESP32-002', name: 'Cold Room B Sensor', status: 'Online', battery: 92 },
        { id: 'ESP32-003', name: 'Freezer Unit Sensor', status: 'Online', battery: 65 },
        { id: 'ESP32-004', name: 'Shipment Sensor 1', status: 'Offline', battery: 12 }
      ]
    } catch (error) {
      console.error('Error fetching device list:', error)
      // Return fallback device list
      return [
        { id: 'ESP32-001', name: 'Cold Room A Sensor', status: 'Online', battery: 87 }
      ]
    }
  }
}

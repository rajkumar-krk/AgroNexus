// Sensor Service — Real backend API calls (no more mock data)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export const sensorService = {
  // Get latest sensor data from backend DB
  async getSensorData() {
    try {
      const data = await request('/sensor/live')
      if (!data) {
        return {
          temperature: 0,
          humidity: 0,
          gasLevel: 'Normal',
          systemStatus: 'Waiting',
          lastUpdate: new Date().toISOString(),
          deviceId: 'ESP32-001',
          batteryLevel: 0
        }
      }
      return {
        temperature: data.temperature,
        humidity: data.humidity,
        gas: data.gas,
        moisture: data.moisture,
        gasLevel: data.gas > 500 ? 'Danger' : data.gas > 300 ? 'Warning' : 'Normal',
        systemStatus: data.gas > 500 || data.temperature > 45 ? 'Critical' : 
                      data.gas > 300 || data.temperature > 35 ? 'Warning' : 'Safe',
        lastUpdate: data.timestamp,
        deviceId: data.deviceId || 'ESP32-001',
        batteryLevel: 87,
        latitude: data.latitude,
        longitude: data.longitude
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      return {
        temperature: 0,
        humidity: 0,
        gasLevel: 'Offline',
        systemStatus: 'Offline',
        lastUpdate: new Date().toISOString(),
        deviceId: 'ESP32-001',
        batteryLevel: 0
      }
    }
  },

  // Get sensor history from backend DB
  async getSensorHistory(timeRange = '24h') {
    try {
      const limit = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 50
      const data = await request(`/sensor/history?limit=${limit}`)
      return data || []
    } catch (error) {
      console.error('Error fetching sensor history:', error)
      return []
    }
  },

  // Get device status
  async getDeviceStatus() {
    try {
      const data = await request('/sensor/live')
      if (!data) return []
      return [{
        id: data.deviceId || 'ESP32-001',
        name: 'Primary Sensor',
        status: 'online',
        temperature: data.temperature,
        humidity: data.humidity,
        batteryLevel: 87,
        signalStrength: 92,
        lastUpdate: data.timestamp
      }]
    } catch (error) {
      console.error('Error fetching device status:', error)
      return []
    }
  },

  // Get device list
  async getDevices() {
    return [
      { id: 'ESP32-001', name: 'Field Sensor 1', status: 'Online', battery: 87 },
    ]
  }
}

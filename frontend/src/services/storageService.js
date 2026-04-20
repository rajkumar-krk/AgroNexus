// Storage Service - Handles cold storage data
// Future: Connect to Firebase/ESP32 hardware

export const storageService = {
  // Get storage units status
  async getStorageUnits() {
    return [
      {
        id: 'CR-001',
        name: 'Cold Room A',
        temperature: 3.2,
        humidity: 85,
        status: 'Optimal',
        capacity: 78,
        compressorHealth: 'Good',
        lastMaintenance: '2024-02-15',
        energyUsage: 2.4
      },
      {
        id: 'CR-002',
        name: 'Cold Room B',
        temperature: 4.1,
        humidity: 80,
        status: 'Good',
        capacity: 92,
        compressorHealth: 'Good',
        lastMaintenance: '2024-01-20',
        energyUsage: 2.8
      },
      {
        id: 'FR-001',
        name: 'Freezer Unit 1',
        temperature: -18.5,
        humidity: 70,
        status: 'Optimal',
        capacity: 65,
        compressorHealth: 'Excellent',
        lastMaintenance: '2024-03-01',
        energyUsage: 3.2
      }
    ]
  },

  // Get storage performance metrics
  async getStorageMetrics() {
    return {
      averageTemperature: 4.2,
      averageHumidity: 82,
      totalCapacity: 235,
      usedCapacity: 178,
      energyEfficiency: 87,
      uptime: 99.2,
      maintenanceAlerts: 2
    }
  },

  // Get temperature trends
  async getTemperatureTrends(timeRange = '24h') {
    const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
      'Cold Room A': 2.8 + Math.random() * 1.2,
      'Cold Room B': 3.5 + Math.random() * 1.5,
      'Freezer Unit 1': -19 + Math.random() * 2
    }))
  }
}

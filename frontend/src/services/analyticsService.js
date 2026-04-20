// Analytics Service - Handles storage analytics and predictions
// Future: Connect to Firebase/ESP32 hardware

export const analyticsService = {
  // Get storage performance analytics
  async getStorageAnalytics() {
    return {
      energyEfficiency: {
        current: 87,
        target: 90,
        trend: 'improving',
        monthlyData: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
          efficiency: 80 + Math.random() * 15
        }))
      },
      temperatureStability: {
        variance: 0.8,
        targetVariance: 1.0,
        compliance: 96.5
      },
      capacityUtilization: {
        current: 75.6,
        optimal: 80,
        forecast: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 3600000).toISOString().split('T')[0],
          utilization: 70 + Math.random() * 20
        }))
      }
    }
  },

  // Get shelf life predictions
  async getShelfLifePredictions() {
    return [
      {
        id: 'BATCH-001',
        crop: 'Tomatoes',
        origin: 'Farm A',
        harvestDate: '2024-03-10',
        currentStorage: 'Cold Room A',
        avgTemperature: 4.2,
        timeTempExposure: 120, // hours
        predictedShelfLife: 14, // days
        remainingDays: 8,
        qualityScore: 92,
        spoilageRisk: 'Low',
        recommendations: [
          'Maintain current temperature',
          'Monitor humidity levels',
          'Consider early market if price favorable'
        ]
      },
      {
        id: 'BATCH-002',
        crop: 'Potatoes',
        origin: 'Farm B',
        harvestDate: '2024-03-08',
        currentStorage: 'Cold Room B',
        avgTemperature: 4.1,
        timeTempExposure: 168, // hours
        predictedShelfLife: 30, // days
        remainingDays: 18,
        qualityScore: 88,
        spoilageRisk: 'Medium',
        recommendations: [
          'Reduce temperature by 0.5°C if possible',
          'Increase monitoring frequency',
          'Plan shipment within 15 days'
        ]
      },
      {
        id: 'BATCH-003',
        crop: 'Apples',
        origin: 'Farm C',
        harvestDate: '2024-03-05',
        currentStorage: 'Freezer Unit 1',
        avgTemperature: -18.5,
        timeTempExposure: 240, // hours
        predictedShelfLife: 180, // days
        remainingDays: 165,
        qualityScore: 96,
        spoilageRisk: 'Very Low',
        recommendations: [
          'Continue current storage conditions',
          'Routine quality checks monthly',
          'Plan for seasonal market release'
        ]
      }
    ]
  },

  // Get spoilage detection analysis
  async getSpoilageAnalysis() {
    return {
      overallRisk: 'Low',
      riskScore: 23,
      riskFactors: [
        { factor: 'Temperature Variance', impact: 'Low', score: 15 },
        { factor: 'Humidity Levels', impact: 'Medium', score: 35 },
        { factor: 'Storage Duration', impact: 'Low', score: 20 },
        { factor: 'Device Reliability', impact: 'Very Low', score: 10 }
      ],
      highRiskBatches: [
        {
          batchId: 'BATCH-045',
          crop: 'Strawberries',
          risk: 'High',
          reason: 'Temperature fluctuations detected',
          action: 'Immediate inspection required'
        }
      ],
      recommendations: [
        'Increase monitoring frequency for high-risk batches',
        'Calibrate sensors in Cold Room B',
        'Review door opening procedures'
      ]
    }
  },

  // Get traceability data
  async getTraceabilityData(batchId) {
    return {
      batchId,
      crop: 'Tomatoes',
      origin: {
        farm: 'Farm A, Punjab',
        coordinates: { lat: 30.9010, lng: 75.8573 },
        harvestDate: '2024-03-10',
        farmer: 'Gurpreet Singh'
      },
      storage: [
        {
          location: 'Cold Room A',
          entryDate: '2024-03-10T14:00:00Z',
          exitDate: '2024-03-15T08:00:00Z',
          avgTemperature: 4.2,
          avgHumidity: 85
        }
      ],
      shipments: [
        {
          id: 'SHP-001',
          departure: '2024-03-15T08:00:00Z',
          arrival: '2024-03-15T14:30:00Z',
          destination: 'Mandi X, Delhi',
          avgTemperature: 4.1
        }
      ],
      qualityChecks: [
        {
          date: '2024-03-10T14:30:00Z',
          type: 'Initial Quality',
          score: 94,
          inspector: 'Quality Team A'
        },
        {
          date: '2024-03-15T08:30:00Z',
          type: 'Pre-Shipment',
          score: 92,
          inspector: 'Quality Team B'
        }
      ],
      qrCode: `AGR-${batchId}-20240310`
    }
  }
}

// Batch Management Service
// Future: Connect to Firebase/ESP32 hardware

// Safe fallback demo data
const fallbackBatches = [
  {
    id: 'batch-001',
    cropName: 'Tomatoes',
    batchId: 'TOM-2024-001',
    origin: 'Farm A, Maharashtra',
    currentLocation: 'Cold Storage Unit 1',
    storageUnit: 'CS-001',
    temperature: 4.2,
    humidity: 85,
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    createdAt: '2024-03-01T08:00:00Z',
    lastUpdate: '2024-03-02T10:30:00Z',
    quantity: 500,
    harvestDate: '2024-03-01T06:00:00Z',
    expectedShelfLife: 14,
    currentShelfLife: 13,
    destination: 'Mandi X, Delhi'
  }
]

// Demo data for multiple crop batches
const demoBatches = [
  {
    id: 'batch-001',
    cropName: 'Tomatoes',
    batchId: 'TOM-2024-001',
    origin: 'Farm A, Maharashtra',
    currentLocation: 'Cold Storage Unit 1',
    storageUnit: 'CS-001',
    temperature: 4.2,
    humidity: 85,
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    createdAt: '2024-03-01T08:00:00Z',
    lastUpdate: '2024-03-02T10:30:00Z',
    quantity: 500,
    harvestDate: '2024-03-01T06:00:00Z',
    expectedShelfLife: 14,
    currentShelfLife: 13,
    destination: 'Mandi X, Delhi'
  },
  {
    id: 'batch-002',
    cropName: 'Bananas',
    batchId: 'BAN-2024-001',
    origin: 'Farm B, Karnataka',
    currentLocation: 'In Transit',
    storageUnit: 'REEFER-002',
    temperature: 13.5,
    humidity: 90,
    gasLevel: 'Normal',
    status: 'In Transit',
    riskLevel: 'Medium',
    createdAt: '2024-03-02T05:00:00Z',
    lastUpdate: '2024-03-02T09:15:00Z',
    quantity: 300,
    harvestDate: '2024-03-01T16:00:00Z',
    expectedShelfLife: 7,
    currentShelfLife: 6,
    destination: 'Distribution Center, Mumbai'
  },
  {
    id: 'batch-003',
    cropName: 'Mangoes',
    batchId: 'MAN-2024-001',
    origin: 'Farm C, Andhra Pradesh',
    currentLocation: 'Cold Storage Unit 2',
    storageUnit: 'CS-002',
    temperature: 10.0,
    humidity: 88,
    gasLevel: 'Elevated',
    status: 'In Storage',
    riskLevel: 'High',
    createdAt: '2024-03-01T14:00:00Z',
    lastUpdate: '2024-03-02T11:00:00Z',
    quantity: 750,
    harvestDate: '2024-03-01T10:00:00Z',
    expectedShelfLife: 21,
    currentShelfLife: 20,
    destination: 'Export Terminal, Chennai'
  },
  {
    id: 'batch-004',
    cropName: 'Leafy Greens',
    batchId: 'LFG-2024-001',
    origin: 'Farm D, Tamil Nadu',
    currentLocation: 'Cold Storage Unit 3',
    storageUnit: 'CS-003',
    temperature: 2.5,
    humidity: 95,
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    createdAt: '2024-03-02T03:00:00Z',
    lastUpdate: '2024-03-02T10:45:00Z',
    quantity: 150,
    harvestDate: '2024-03-02T01:00:00Z',
    expectedShelfLife: 5,
    currentShelfLife: 4,
    destination: 'Local Market, Chennai'
  }
]

export const batchService = {
  // Get all batches - ALWAYS returns data
  async getAllBatches() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      return [...demoBatches]
    } catch (error) {
      console.error('Error fetching batches:', error)
      return [...fallbackBatches] // Always return fallback data
    }
  },

  // Get batch by ID - ALWAYS returns data or throws
  async getBatchById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      const batch = demoBatches.find(b => b.id === id)
      if (!batch) {
        throw new Error(`Batch with ID ${id} not found`)
      }
      return { ...batch }
    } catch (error) {
      console.error('Error fetching batch:', error)
      // Return fallback batch if ID matches, otherwise throw
      if (id === 'batch-001') {
        return { ...fallbackBatches[0] }
      }
      throw error
    }
  },

  // Add new batch - ALWAYS returns data
  async addBatch(batchData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const newBatch = {
        id: `batch-${Date.now()}`,
        batchId: `${batchData.cropName?.substring(0, 3).toUpperCase() || 'NEW'}-${new Date().getFullYear()}-${String(demoBatches.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        currentShelfLife: batchData.expectedShelfLife || 10,
        ...batchData
      }
      
      demoBatches.push(newBatch)
      return { ...newBatch }
    } catch (error) {
      console.error('Error adding batch:', error)
      // Return fallback batch
      return { ...fallbackBatches[0] }
    }
  },

  // Update batch - ALWAYS returns data
  async updateBatch(id, updates) {
    try {
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const batchIndex = demoBatches.findIndex(b => b.id === id)
      if (batchIndex === -1) {
        throw new Error(`Batch with ID ${id} not found`)
      }
      
      demoBatches[batchIndex] = {
        ...demoBatches[batchIndex],
        ...updates,
        lastUpdate: new Date().toISOString()
      }
      
      return { ...demoBatches[batchIndex] }
    } catch (error) {
      console.error('Error updating batch:', error)
      // Return fallback batch
      return { ...fallbackBatches[0] }
    }
  },

  // Delete batch - ALWAYS returns data
  async deleteBatch(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const batchIndex = demoBatches.findIndex(b => b.id === id)
      if (batchIndex === -1) {
        throw new Error(`Batch with ID ${id} not found`)
      }
      
      const deletedBatch = demoBatches.splice(batchIndex, 1)[0]
      return deletedBatch
    } catch (error) {
      console.error('Error deleting batch:', error)
      // Return fallback batch as "deleted"
      return { ...fallbackBatches[0] }
    }
  },

  // Get batches by status - ALWAYS returns data
  async getBatchesByStatus(status) {
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      return demoBatches.filter(b => b.status === status)
    } catch (error) {
      console.error('Error filtering batches by status:', error)
      return status === 'In Storage' ? [...fallbackBatches] : []
    }
  },

  // Get batches by risk level - ALWAYS returns data
  async getBatchesByRiskLevel(riskLevel) {
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      return demoBatches.filter(b => b.riskLevel === riskLevel)
    } catch (error) {
      console.error('Error filtering batches by risk:', error)
      return riskLevel === 'Low' ? [...fallbackBatches] : []
    }
  },

  // Get batches by storage unit - ALWAYS returns data
  async getBatchesByStorageUnit(storageUnit) {
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      return demoBatches.filter(b => b.storageUnit === storageUnit)
    } catch (error) {
      console.error('Error filtering batches by storage:', error)
      return storageUnit === 'CS-001' ? [...fallbackBatches] : []
    }
  },

  // Get batch statistics - ALWAYS returns data
  async getBatchStats() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const stats = {
        total: demoBatches.length,
        inStorage: demoBatches.filter(b => b.status === 'In Storage').length,
        inTransit: demoBatches.filter(b => b.status === 'In Transit').length,
        highRisk: demoBatches.filter(b => b.riskLevel === 'High').length,
        mediumRisk: demoBatches.filter(b => b.riskLevel === 'Medium').length,
        lowRisk: demoBatches.filter(b => b.riskLevel === 'Low').length,
        totalQuantity: demoBatches.reduce((sum, b) => sum + (b.quantity || 0), 0),
        averageTemperature: demoBatches.reduce((sum, b) => sum + b.temperature, 0) / demoBatches.length,
        averageHumidity: demoBatches.reduce((sum, b) => sum + b.humidity, 0) / demoBatches.length
      }
      
      return stats
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Return fallback stats
      return {
        total: 1,
        inStorage: 1,
        inTransit: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 1,
        totalQuantity: 500,
        averageTemperature: 4.2,
        averageHumidity: 85
      }
    }
  },

  // Simulate real-time updates - ALWAYS returns cleanup function
  startRealTimeUpdates(callback) {
    try {
      const interval = setInterval(async () => {
        try {
          // Randomly update some batch values to simulate real-time sensor data
          const randomBatchIndex = Math.floor(Math.random() * demoBatches.length)
          const batch = demoBatches[randomBatchIndex]
          
          // Small random variations in temperature and humidity
          const tempVariation = (Math.random() - 0.5) * 0.4 // ±0.2°C
          const humidityVariation = (Math.random() - 0.5) * 4 // ±2%
          
          const updatedBatch = {
            ...batch,
            temperature: Math.round((batch.temperature + tempVariation) * 10) / 10,
            humidity: Math.round(batch.humidity + humidityVariation),
            lastUpdate: new Date().toISOString()
          }
          
          demoBatches[randomBatchIndex] = updatedBatch
          callback(updatedBatch)
        } catch (error) {
          console.error('Error in real-time update:', error)
          // Send fallback update
          callback(fallbackBatches[0])
        }
      }, 5000) // Update every 5 seconds
      
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Error starting real-time updates:', error)
      return () => {} // Return empty cleanup function
    }
  }
}

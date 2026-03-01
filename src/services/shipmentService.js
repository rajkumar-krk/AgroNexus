// Shipment Service - Handles GPS tracking and shipment data
// Future: Connect to Firebase/ESP32 hardware

export const shipmentService = {
  // Get active shipments
  async getActiveShipments() {
    return [
      {
        id: 'SHP-001',
        origin: 'Farm A, Punjab',
        destination: 'Mandi X, Delhi',
        currentLocation: 'Near Karnal, Haryana',
        temperature: 4.2,
        humidity: 78,
        status: 'In Transit',
        lastUpdate: '5 mins ago',
        estimatedArrival: '2024-03-15 14:30',
        driver: 'Raj Kumar',
        vehicleNumber: 'HR-38-AB-1234'
      },
      {
        id: 'SHP-002',
        origin: 'Cold Storage B',
        destination: 'Distribution Center',
        currentLocation: 'NH-44, Sonipat',
        temperature: 3.8,
        humidity: 82,
        status: 'In Transit',
        lastUpdate: '12 mins ago',
        estimatedArrival: '2024-03-15 16:00',
        driver: 'Amit Singh',
        vehicleNumber: 'HR-26-CD-5678'
      },
      {
        id: 'SHP-003',
        origin: 'Warehouse C',
        destination: 'Retail Hub',
        currentLocation: 'Loading at Warehouse',
        temperature: 4.5,
        humidity: 75,
        status: 'Loading',
        lastUpdate: '2 mins ago',
        estimatedArrival: '2024-03-15 18:00',
        driver: 'Vikram Mehta',
        vehicleNumber: 'DL-01-EF-9012'
      }
    ]
  },

  // Get shipment history
  async getShipmentHistory() {
    return [
      {
        id: 'SHP-998',
        origin: 'Farm D',
        destination: 'Mandi Y',
        completedDate: '2024-03-14',
        duration: '4h 30m',
        avgTemperature: 4.1,
        status: 'Completed',
        qualityScore: 98
      },
      {
        id: 'SHP-997',
        origin: 'Cold Storage E',
        destination: 'Distribution Center',
        completedDate: '2024-03-13',
        duration: '3h 15m',
        avgTemperature: 3.9,
        status: 'Completed',
        qualityScore: 95
      }
    ]
  },

  // Get GPS coordinates for map
  async getShipmentLocation(shipmentId) {
    // Mock GPS coordinates - will connect to real GPS hardware later
    const locations = {
      'SHP-001': { lat: 29.6841, lng: 76.9802 },
      'SHP-002': { lat: 28.9850, lng: 77.0249 },
      'SHP-003': { lat: 28.6139, lng: 77.2090 }
    }
    return locations[shipmentId] || { lat: 28.6139, lng: 77.2090 }
  }
}

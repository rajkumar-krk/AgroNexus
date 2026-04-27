// Shipment Service — Real backend API calls (no more mock data)
let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
if (API_BASE.endsWith('/')) API_BASE = API_BASE.slice(0, -1)
if (!API_BASE.endsWith('/api/v1')) API_BASE = API_BASE + '/api/v1'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export const shipmentService = {
  // Get active shipments from backend
  async getActiveShipments() {
    try {
      return await request('/shipments') || []
    } catch (error) {
      console.error('Error fetching active shipments:', error)
      return []
    }
  },

  // Get shipment history
  async getShipmentHistory() {
    try {
      return await request('/shipments?status=Delivered') || []
    } catch (error) {
      console.error('Error fetching shipment history:', error)
      return []
    }
  },

  // Get GPS coordinates for a shipment from sensor data
  async getShipmentLocation(shipmentId) {
    try {
      const data = await request('/sensor/live')
      if (data && data.latitude && data.latitude !== 0) {
        return { lat: data.latitude, lng: data.longitude }
      }
      return { lat: 17.385, lng: 78.4867 } // Default to Hyderabad
    } catch (error) {
      console.error('Error fetching shipment location:', error)
      return { lat: 17.385, lng: 78.4867 }
    }
  },

  // Get GPS history trail
  async getGPSHistory(batchId) {
    try {
      const data = await request(`/sensor/gps-history?limit=100${batchId ? `&batchId=${batchId}` : ''}`)
      return data || []
    } catch (error) {
      console.error('Error fetching GPS history:', error)
      return []
    }
  }
}

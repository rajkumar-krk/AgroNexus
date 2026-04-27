// Alert Service — Real backend API calls (no more mock data)
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

export const alertService = {
  // Get active (unacknowledged) alerts from DB
  async getActiveAlerts() {
    try {
      const result = await request('/alerts?acknowledged=false&limit=20')
      return result?.alerts || []
    } catch (error) {
      console.error('Error fetching active alerts:', error)
      return []
    }
  },

  // Get alert history (all alerts)
  async getAlertHistory(limit = 50) {
    try {
      const result = await request(`/alerts?limit=${limit}`)
      return result?.alerts || []
    } catch (error) {
      console.error('Error fetching alert history:', error)
      return []
    }
  },

  // Get alert statistics
  async getAlertStats() {
    try {
      return await request('/alerts/stats')
    } catch (error) {
      console.error('Error fetching alert stats:', error)
      return { total: 0, active: 0, resolved: 0, bySeverity: {} }
    }
  },

  // Acknowledge alert
  async acknowledgeAlert(alertId) {
    try {
      await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      return { success: true, alertId }
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      return { success: false, alertId }
    }
  },

  // Resolve alert
  async resolveAlert(alertId) {
    try {
      await fetch(`${API_BASE}/alerts/${alertId}/resolve`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      return { success: true, alertId }
    } catch (error) {
      console.error('Error resolving alert:', error)
      return { success: false, alertId }
    }
  }
}

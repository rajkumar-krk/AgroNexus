import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
if (API_BASE.endsWith('/')) API_BASE = API_BASE.slice(0, -1)
if (!API_BASE.endsWith('/api/v1')) API_BASE = API_BASE + '/api/v1'

const POLL_INTERVAL = 5000 // 5 seconds
const MAX_HISTORY = 50
const MAX_COORDS = 100
const TOAST_DEBOUNCE = 30000 // 30s between toasts of same type

// ── Alert Thresholds (mirror backend, used for UI highlighting) ──
const THRESHOLDS = {
  TEMP_HIGH: 35,
  GAS_SPOILAGE: 500,
  HUMIDITY_HIGH: 85,
  MOISTURE_LOW: 20,
}

const SensorContext = createContext(null)

/**
 * Computes spoilage risk score from live data for the gauge UI.
 */
function computeSpoilageRisk(data, history) {
  if (!data) return { level: 'Safe', score: 0, color: 'emerald' }

  const { temperature, gas } = data

  // Check gas trending upward
  let gasIncreasing = false
  if (history.length >= 3) {
    const recent = history.slice(-5)
    const first = recent[0]?.gas || 0
    const last = recent[recent.length - 1]?.gas || 0
    gasIncreasing = last > first + 20
  }

  if ((gas > THRESHOLDS.GAS_SPOILAGE || gasIncreasing) && temperature > THRESHOLDS.TEMP_HIGH) {
    return { level: 'Critical', score: 85 + Math.min(gas / 100, 15), color: 'rose' }
  }
  if (gas > THRESHOLDS.GAS_SPOILAGE) {
    return { level: 'Critical', score: 80, color: 'rose' }
  }
  if (gas > 300 || temperature > 30) {
    const score = 40 + Math.min((gas / 10) + (temperature * 2), 35)
    return { level: 'Moderate', score: Math.round(score), color: 'amber' }
  }
  return { level: 'Safe', score: Math.max(5, Math.round(gas / 10 + temperature)), color: 'emerald' }
}

async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export function SensorProvider({ children }) {
  // ── Core state ──
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [coordHistory, setCoordHistory] = useState([])
  const [alerts, setAlerts] = useState([])
  const [insights, setInsights] = useState([])
  const [latestInsight, setLatestInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Toast debounce ref
  const lastToastRef = useRef({})
  const lastTimestampRef = useRef('')

  const fireToast = useCallback((type, message, icon) => {
    const now = Date.now()
    const lastFired = lastToastRef.current[type] || 0
    if (now - lastFired < TOAST_DEBOUNCE) return
    lastToastRef.current[type] = now

    if (type === 'critical') {
      toast.error(message, { duration: 8000, icon, id: `alert-${type}` })
    } else {
      toast(message, { duration: 6000, icon, id: `alert-${type}`, style: { background: '#FEF3C7', color: '#92400E', fontWeight: 600 } })
    }
  }, [])

  // ── Poll live data from backend ──
  const fetchLiveData = useCallback(async () => {
    try {
      const liveData = await fetchJSON('/sensor/live')
      
      if (!liveData) {
        setIsConnected(true)
        setLoading(false)
        return
      }

      const isNewReading = liveData.timestamp !== lastTimestampRef.current
      lastTimestampRef.current = liveData.timestamp

      setData(liveData)
      setIsConnected(true)
      setLastUpdated(new Date())
      setError(null)

      if (isNewReading) {
        setHistory(prev => {
          const updated = [...prev, liveData]
          return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated
        })

        if (liveData.latitude && liveData.latitude !== 0 && liveData.longitude !== 0) {
          setCoordHistory(prev => {
            const updated = [...prev, [liveData.latitude, liveData.longitude]]
            return updated.length > MAX_COORDS ? updated.slice(-MAX_COORDS) : updated
          })
        }

        // Fire toast alerts for threshold breaches
        if (liveData.temperature > THRESHOLDS.TEMP_HIGH) {
          fireToast('temp', `🌡️ Temperature HIGH: ${liveData.temperature.toFixed(1)}°C`, '🔥')
        }
        if (liveData.gas > THRESHOLDS.GAS_SPOILAGE) {
          fireToast('critical', `⚠️ SPOILAGE ALERT: Gas value ${liveData.gas}!`, '☠️')
        }
        if (liveData.humidity > THRESHOLDS.HUMIDITY_HIGH) {
          fireToast('humidity', `💧 Humidity HIGH: ${liveData.humidity.toFixed(1)}%`, '💧')
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch live data')
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [fireToast])

  // ── Fetch alerts from backend ──
  const fetchAlerts = useCallback(async () => {
    try {
      const result = await fetchJSON('/alerts?limit=20&acknowledged=false')
      if (result?.alerts) {
        setAlerts(result.alerts)
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
  }, [])

  // ── Fetch AI insights from backend ──
  const fetchInsights = useCallback(async () => {
    try {
      const result = await fetchJSON('/ai/insights?limit=10')
      if (result) {
        setInsights(result)
        if (result.length > 0) setLatestInsight(result[0])
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err)
    }
  }, [])

  // ── Trigger manual AI analysis ──
  const triggerAnalysis = useCallback(async (batchId) => {
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId })
      })
      const json = await res.json()
      if (json.success && json.data) {
        setLatestInsight(json.data)
        setInsights(prev => [json.data, ...prev].slice(0, 10))
        toast.success('🤖 AI analysis completed!', { duration: 4000 })
      }
      return json.data
    } catch (err) {
      console.error('AI analysis failed:', err)
      toast.error('AI analysis failed. Please try again.')
      return null
    }
  }, [])

  // ── Acknowledge alert ──
  const acknowledgeAlert = useCallback(async (alertId) => {
    try {
      await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'PATCH' })
      setAlerts(prev => prev.filter(a => a._id !== alertId))
    } catch (err) {
      console.error('Failed to acknowledge alert:', err)
    }
  }, [])

  // ── Spoilage risk ──
  const spoilageRisk = useMemo(() => computeSpoilageRisk(data, history), [data, history])

  // Active alert count (for badges)
  const alertBadgeCount = alerts.length

  // ── Start polling ──
  useEffect(() => {
    fetchLiveData()
    fetchAlerts()
    fetchInsights()

    const liveInterval = setInterval(fetchLiveData, POLL_INTERVAL)
    const alertInterval = setInterval(fetchAlerts, 15000) // every 15s
    const insightInterval = setInterval(fetchInsights, 30000) // every 30s

    return () => {
      clearInterval(liveInterval)
      clearInterval(alertInterval)
      clearInterval(insightInterval)
    }
  }, [fetchLiveData, fetchAlerts, fetchInsights])

  const value = {
    // Live data
    data,
    history,
    coordHistory,
    loading,
    error,
    lastUpdated,
    isConnected,

    // Alerts
    alerts,
    activeAlerts: alerts,
    alertBadgeCount,
    acknowledgeAlert,
    dismissAlert: acknowledgeAlert,

    // AI Insights
    insights,
    latestInsight,
    triggerAnalysis,

    // Computed
    spoilageRisk,
    thresholds: THRESHOLDS,
  }

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  )
}

export function useSensorContext() {
  const context = useContext(SensorContext)
  if (!context) {
    throw new Error('useSensorContext must be used within a SensorProvider')
  }
  return context
}

// Also export as useThingSpeakContext for backward compatibility
export const useThingSpeakContext = useSensorContext

export default SensorContext

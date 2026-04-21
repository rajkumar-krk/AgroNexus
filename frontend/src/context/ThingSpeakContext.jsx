import React, { createContext, useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useThingSpeak } from '../hooks/useThingSpeak'
import toast from 'react-hot-toast'

// ── Alert Thresholds ──
const THRESHOLDS = {
  TEMP_HIGH: 10,      // °C — cold chain breach
  GAS_SPOILAGE: 500,  // Gas sensor value
  HUMIDITY_HIGH: 85,  // %
}

// Debounce interval for toasts (ms)
const TOAST_DEBOUNCE = 30000 // 30 seconds

// Create context
const ThingSpeakContext = createContext(null)

/**
 * Computes spoilage risk based on gas + temperature readings.
 *   - gas increasing + temp > 10 → "Critical"
 *   - gas > 300 OR temp > 8     → "Moderate"
 *   - else                      → "Safe"
 */
function computeSpoilageRisk(data, history) {
  if (!data) return { level: 'Safe', score: 0, color: 'emerald' }

  const { temperature, gas } = data

  // Check if gas is trending upward (compare last 5 readings)
  let gasIncreasing = false
  if (history.length >= 3) {
    const recent = history.slice(-5)
    const first = recent[0]?.gas || 0
    const last = recent[recent.length - 1]?.gas || 0
    gasIncreasing = last > first + 20 // significant increase
  }

  // Critical: gas rising + temp high
  if ((gas > THRESHOLDS.GAS_SPOILAGE || gasIncreasing) && temperature > THRESHOLDS.TEMP_HIGH) {
    return { level: 'Critical', score: 85 + Math.min(gas / 100, 15), color: 'rose' }
  }

  // Critical: gas very high alone
  if (gas > THRESHOLDS.GAS_SPOILAGE) {
    return { level: 'Critical', score: 80, color: 'rose' }
  }

  // Moderate
  if (gas > 300 || temperature > 8) {
    const score = 40 + Math.min((gas / 10) + (temperature * 2), 35)
    return { level: 'Moderate', score: Math.round(score), color: 'amber' }
  }

  // Safe
  return { level: 'Safe', score: Math.max(5, Math.round(gas / 10 + temperature)), color: 'emerald' }
}

export function ThingSpeakProvider({ children }) {
  const thingSpeak = useThingSpeak()
  const { data, history } = thingSpeak

  // ── Alert State ──
  const [activeAlerts, setActiveAlerts] = useState([])
  const [alertBadgeCount, setAlertBadgeCount] = useState(0)
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  // Track last toast times per alert type (debounce)
  const lastToastRef = useRef({})

  const fireToast = useCallback((type, message, icon) => {
    const now = Date.now()
    const lastFired = lastToastRef.current[type] || 0
    if (now - lastFired < TOAST_DEBOUNCE) return // debounced

    lastToastRef.current[type] = now

    if (type === 'critical') {
      toast.error(message, { duration: 8000, icon, id: `alert-${type}` })
    } else {
      toast(message, { duration: 6000, icon, id: `alert-${type}`, style: { background: '#FEF3C7', color: '#92400E', fontWeight: 600 } })
    }
  }, [])

  // ── Evaluate alert conditions whenever data changes ──
  useEffect(() => {
    if (!data) return

    const newAlerts = []

    // Temperature > 10°C
    if (data.temperature > THRESHOLDS.TEMP_HIGH) {
      const alert = {
        id: 'temp-high',
        type: 'warning',
        severity: 'high',
        title: 'Temperature Breach',
        message: `Temperature at ${data.temperature.toFixed(1)}°C — exceeds ${THRESHOLDS.TEMP_HIGH}°C threshold`,
        value: data.temperature,
        threshold: THRESHOLDS.TEMP_HIGH,
        timestamp: new Date().toISOString(),
      }
      newAlerts.push(alert)
      fireToast('temp', `🌡️ Temperature HIGH: ${data.temperature.toFixed(1)}°C`, '🔥')
    }

    // Gas > 500
    if (data.gas > THRESHOLDS.GAS_SPOILAGE) {
      const alert = {
        id: 'gas-spoilage',
        type: 'critical',
        severity: 'critical',
        title: 'Spoilage Detected',
        message: `Gas sensor value ${data.gas} — exceeds spoilage threshold of ${THRESHOLDS.GAS_SPOILAGE}`,
        value: data.gas,
        threshold: THRESHOLDS.GAS_SPOILAGE,
        timestamp: new Date().toISOString(),
      }
      newAlerts.push(alert)
      fireToast('critical', `⚠️ SPOILAGE ALERT: Gas value ${data.gas}!`, '☠️')
    }

    // Humidity > 85%
    if (data.humidity > THRESHOLDS.HUMIDITY_HIGH) {
      const alert = {
        id: 'humidity-high',
        type: 'warning',
        severity: 'medium',
        title: 'High Humidity',
        message: `Humidity at ${data.humidity.toFixed(1)}% — exceeds ${THRESHOLDS.HUMIDITY_HIGH}% threshold`,
        value: data.humidity,
        threshold: THRESHOLDS.HUMIDITY_HIGH,
        timestamp: new Date().toISOString(),
      }
      newAlerts.push(alert)
      fireToast('humidity', `💧 Humidity HIGH: ${data.humidity.toFixed(1)}%`, '💧')
    }

    setActiveAlerts(newAlerts)
    setAlertBadgeCount(newAlerts.filter(a => !dismissedAlerts.has(a.id)).length)
  }, [data, dismissedAlerts, fireToast])

  // ── Spoilage Risk ──
  const spoilageRisk = useMemo(() => computeSpoilageRisk(data, history), [data, history])

  // ── Backend alert trigger ──
  const triggerBackendAlert = useCallback(async (alertData) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
      await fetch(`${API_BASE}/thingspeak/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      })
    } catch (err) {
      console.error('[ThingSpeak] Failed to trigger backend alert:', err)
    }
  }, [])

  // Trigger backend alert when critical alerts fire
  useEffect(() => {
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical')
    criticalAlerts.forEach(alert => {
      triggerBackendAlert(alert)
    })
  }, [activeAlerts, triggerBackendAlert])

  const dismissAlert = useCallback((alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }, [])

  const value = {
    ...thingSpeak,
    activeAlerts,
    alertBadgeCount,
    dismissAlert,
    spoilageRisk,
    thresholds: THRESHOLDS,
    triggerBackendAlert,
  }

  return (
    <ThingSpeakContext.Provider value={value}>
      {children}
    </ThingSpeakContext.Provider>
  )
}

// Hook to consume ThingSpeak context
export function useThingSpeakContext() {
  const context = useContext(ThingSpeakContext)
  if (!context) {
    throw new Error('useThingSpeakContext must be used within a ThingSpeakProvider')
  }
  return context
}

export default ThingSpeakContext

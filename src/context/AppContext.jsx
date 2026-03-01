import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  // Global data cache
  sensorData: null,
  storageUnits: [],
  activeShipments: [],
  alerts: [],
  // UI state
  sidebarOpen: true,
  theme: 'light',
  notifications: []
}

// Action types
export const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_SENSOR_DATA: 'SET_SENSOR_DATA',
  SET_STORAGE_UNITS: 'SET_STORAGE_UNITS',
  SET_ACTIVE_SHIPMENTS: 'SET_ACTIVE_SHIPMENTS',
  SET_ALERTS: 'SET_ALERTS',
  ADD_ALERT: 'ADD_ALERT',
  UPDATE_ALERT: 'UPDATE_ALERT',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case APP_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case APP_ACTIONS.SET_USER:
      return { ...state, user: action.payload }
    
    case APP_ACTIONS.SET_SENSOR_DATA:
      return { ...state, sensorData: action.payload }
    
    case APP_ACTIONS.SET_STORAGE_UNITS:
      return { ...state, storageUnits: action.payload }
    
    case APP_ACTIONS.SET_ACTIVE_SHIPMENTS:
      return { ...state, activeShipments: action.payload }
    
    case APP_ACTIONS.SET_ALERTS:
      return { ...state, alerts: action.payload }
    
    case APP_ACTIONS.ADD_ALERT:
      return { 
        ...state, 
        alerts: [action.payload, ...state.alerts].slice(0, 100) // Keep only last 100
      }
    
    case APP_ACTIONS.UPDATE_ALERT:
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload.id ? { ...alert, ...action.payload.updates } : alert
        )
      }
    
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen }
    
    case APP_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload }
    
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          { ...action.payload, id: Date.now() },
          ...state.notifications
        ].slice(0, 50) // Keep only last 50
      }
    
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ 
          type: APP_ACTIONS.REMOVE_NOTIFICATION, 
          payload: state.notifications[0].id 
        })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.notifications])

  const value = {
    ...state,
    dispatch,
    // Convenience actions
    setLoading: (loading) => dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error }),
    setUser: (user) => dispatch({ type: APP_ACTIONS.SET_USER, payload: user }),
    setSensorData: (data) => dispatch({ type: APP_ACTIONS.SET_SENSOR_DATA, payload: data }),
    setStorageUnits: (units) => dispatch({ type: APP_ACTIONS.SET_STORAGE_UNITS, payload: units }),
    setActiveShipments: (shipments) => dispatch({ type: APP_ACTIONS.SET_ACTIVE_SHIPMENTS, payload: shipments }),
    setAlerts: (alerts) => dispatch({ type: APP_ACTIONS.SET_ALERTS, payload: alerts }),
    addAlert: (alert) => dispatch({ type: APP_ACTIONS.ADD_ALERT, payload: alert }),
    updateAlert: (id, updates) => dispatch({ type: APP_ACTIONS.UPDATE_ALERT, payload: { id, updates } }),
    toggleSidebar: () => dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR }),
    setTheme: (theme) => dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme }),
    addNotification: (notification) => dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (id) => dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id })
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Export context for direct access if needed
export default AppContext

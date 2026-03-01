import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { batchService } from '../services/batchService'

// Initial state
const initialState = {
  batches: [],
  selectedBatch: null,
  loading: false,
  error: null,
  stats: null,
  realTimeUpdates: null
}

// Action types
export const BATCH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BATCHES: 'SET_BATCHES',
  SET_SELECTED_BATCH: 'SET_SELECTED_BATCH',
  ADD_BATCH: 'ADD_BATCH',
  UPDATE_BATCH: 'UPDATE_BATCH',
  DELETE_BATCH: 'DELETE_BATCH',
  SET_STATS: 'SET_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  START_REAL_TIME_UPDATES: 'START_REAL_TIME_UPDATES',
  STOP_REAL_TIME_UPDATES: 'STOP_REAL_TIME_UPDATES',
  UPDATE_BATCH_REAL_TIME: 'UPDATE_BATCH_REAL_TIME'
}

// Reducer
function batchReducer(state, action) {
  switch (action.type) {
    case BATCH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case BATCH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case BATCH_ACTIONS.SET_BATCHES:
      return { ...state, batches: action.payload, loading: false, error: null }
    
    case BATCH_ACTIONS.SET_SELECTED_BATCH:
      return { ...state, selectedBatch: action.payload }
    
    case BATCH_ACTIONS.ADD_BATCH:
      return {
        ...state,
        batches: [action.payload, ...state.batches],
        loading: false,
        error: null
      }
    
    case BATCH_ACTIONS.UPDATE_BATCH:
      return {
        ...state,
        batches: state.batches.map(batch =>
          batch.id === action.payload.id ? { ...batch, ...action.payload.updates } : batch
        ),
        selectedBatch: state.selectedBatch?.id === action.payload.id 
          ? { ...state.selectedBatch, ...action.payload.updates }
          : state.selectedBatch,
        loading: false,
        error: null
      }
    
    case BATCH_ACTIONS.DELETE_BATCH:
      return {
        ...state,
        batches: state.batches.filter(batch => batch.id !== action.payload),
        selectedBatch: state.selectedBatch?.id === action.payload ? null : state.selectedBatch,
        loading: false,
        error: null
      }
    
    case BATCH_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload }
    
    case BATCH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case BATCH_ACTIONS.UPDATE_BATCH_REAL_TIME:
      return {
        ...state,
        batches: state.batches.map(batch =>
          batch.id === action.payload.id ? action.payload : batch
        ),
        selectedBatch: state.selectedBatch?.id === action.payload.id 
          ? action.payload 
          : state.selectedBatch
      }
    
    default:
      return state
  }
}

// Create context
const BatchContext = createContext()

// Provider component
export function BatchProvider({ children }) {
  const [state, dispatch] = useReducer(batchReducer, initialState)

  // Load initial data
  useEffect(() => {
    loadBatches()
    loadStats()
  }, [])

  // Real-time updates
  useEffect(() => {
    const stopUpdates = batchService.startRealTimeUpdates((updatedBatch) => {
      dispatch({ type: BATCH_ACTIONS.UPDATE_BATCH_REAL_TIME, payload: updatedBatch })
    })

    return () => {
      if (stopUpdates) stopUpdates()
    }
  }, [])

  const loadBatches = async () => {
    try {
      dispatch({ type: BATCH_ACTIONS.SET_LOADING, payload: true })
      const batches = await batchService.getAllBatches()
      dispatch({ type: BATCH_ACTIONS.SET_BATCHES, payload: batches })
    } catch (error) {
      dispatch({ type: BATCH_ACTIONS.SET_ERROR, payload: error.message })
    }
  }

  const loadStats = async () => {
    try {
      const stats = await batchService.getBatchStats()
      dispatch({ type: BATCH_ACTIONS.SET_STATS, payload: stats })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const addBatch = async (batchData) => {
    try {
      dispatch({ type: BATCH_ACTIONS.SET_LOADING, payload: true })
      const newBatch = await batchService.addBatch(batchData)
      dispatch({ type: BATCH_ACTIONS.ADD_BATCH, payload: newBatch })
      loadStats() // Refresh stats
      return newBatch
    } catch (error) {
      dispatch({ type: BATCH_ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const updateBatch = async (id, updates) => {
    try {
      dispatch({ type: BATCH_ACTIONS.SET_LOADING, payload: true })
      const updatedBatch = await batchService.updateBatch(id, updates)
      dispatch({ type: BATCH_ACTIONS.UPDATE_BATCH, payload: { id, updates } })
      loadStats() // Refresh stats
      return updatedBatch
    } catch (error) {
      dispatch({ type: BATCH_ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const deleteBatch = async (id) => {
    try {
      dispatch({ type: BATCH_ACTIONS.SET_LOADING, payload: true })
      await batchService.deleteBatch(id)
      dispatch({ type: BATCH_ACTIONS.DELETE_BATCH, payload: id })
      loadStats() // Refresh stats
    } catch (error) {
      dispatch({ type: BATCH_ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const selectBatch = (batch) => {
    dispatch({ type: BATCH_ACTIONS.SET_SELECTED_BATCH, payload: batch })
  }

  const clearError = () => {
    dispatch({ type: BATCH_ACTIONS.CLEAR_ERROR })
  }

  const value = {
    ...state,
    // Actions
    loadBatches,
    loadStats,
    addBatch,
    updateBatch,
    deleteBatch,
    selectBatch,
    clearError,
    
    // Computed values
    activeBatches: state.batches.filter(b => b.status === 'In Storage' || b.status === 'In Transit'),
    highRiskBatches: state.batches.filter(b => b.riskLevel === 'High'),
    inStorageBatches: state.batches.filter(b => b.status === 'In Storage'),
    inTransitBatches: state.batches.filter(b => b.status === 'In Transit'),
    
    // Utility functions
    getBatchById: (id) => state.batches.find(b => b.id === id),
    getBatchesByCrop: (cropName) => state.batches.filter(b => b.cropName === cropName),
    getBatchesByStatus: (status) => state.batches.filter(b => b.status === status),
    getBatchesByRisk: (riskLevel) => state.batches.filter(b => b.riskLevel === riskLevel)
  }

  return (
    <BatchContext.Provider value={value}>
      {children}
    </BatchContext.Provider>
  )
}

// Hook to use context
export function useBatch() {
  const context = useContext(BatchContext)
  if (!context) {
    throw new Error('useBatch must be used within a BatchProvider')
  }
  return context
}

// Export context for direct access if needed
export default BatchContext

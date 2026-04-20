import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Package, Thermometer, Droplets, Wind, MapPin, Home } from 'lucide-react'
import { useBatch } from '../context/BatchContext'

const cropOptions = [
  'Tomatoes', 'Bananas', 'Mangoes', 'Leafy Greens', 
  'Potatoes', 'Onions', 'Apples', 'Oranges',
  'Strawberries', 'Grapes', 'Carrots', 'Cabbage'
]

const storageUnitOptions = [
  'CS-001', 'CS-002', 'CS-003', 'CS-004',
  'REEFER-001', 'REEFER-002', 'REEFER-003',
  'TRANSIT-001', 'TRANSIT-002'
]

const statusOptions = [
  'In Storage', 'In Transit', 'Processing', 'Delivered'
]

const riskLevelOptions = [
  'Low', 'Medium', 'High', 'Critical'
]

export function AddBatchModal({ isOpen, onClose }) {
  const { addBatch, loading } = useBatch()
  const [formData, setFormData] = useState({
    cropName: '',
    origin: '',
    storageUnit: '',
    temperature: '',
    humidity: '',
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    quantity: '',
    destination: '',
    expectedShelfLife: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.cropName) newErrors.cropName = 'Crop name is required'
    if (!formData.origin) newErrors.origin = 'Origin is required'
    if (!formData.storageUnit) newErrors.storageUnit = 'Storage unit is required'
    if (!formData.temperature || formData.temperature < -20 || formData.temperature > 30) {
      newErrors.temperature = 'Temperature must be between -20°C and 30°C'
    }
    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100) {
      newErrors.humidity = 'Humidity must be between 0% and 100%'
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    if (!formData.destination) newErrors.destination = 'Destination is required'
    if (!formData.expectedShelfLife || formData.expectedShelfLife <= 0) {
      newErrors.expectedShelfLife = 'Expected shelf life must be greater than 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await addBatch({
        ...formData,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        quantity: parseFloat(formData.quantity),
        expectedShelfLife: parseInt(formData.expectedShelfLife)
      })
      
      // Reset form
      setFormData({
        cropName: '',
        origin: '',
        storageUnit: '',
        temperature: '',
        humidity: '',
        gasLevel: 'Normal',
        status: 'In Storage',
        riskLevel: 'Low',
        quantity: '',
        destination: '',
        expectedShelfLife: ''
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error adding batch:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Batch</h2>
              <p className="text-sm text-muted-foreground">Create a new crop batch for monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crop Name *</label>
                <select
                  value={formData.cropName}
                  onChange={(e) => handleInputChange('cropName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.cropName ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                >
                  <option value="">Select crop</option>
                  {cropOptions.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Origin *</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="Farm location"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.origin ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Storage Unit *</label>
                <select
                  value={formData.storageUnit}
                  onChange={(e) => handleInputChange('storageUnit', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.storageUnit ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                >
                  <option value="">Select storage unit</option>
                  {storageUnitOptions.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.storageUnit && <p className="text-red-500 text-xs mt-1">{errors.storageUnit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Destination *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Final destination"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.destination ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Thermometer size={18} className="text-blue-500" />
              Environmental Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Temperature (°C) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="4.0"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.temperature ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Humidity (%) *</label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  placeholder="85"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.humidity ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.humidity && <p className="text-red-500 text-xs mt-1">{errors.humidity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gas Level</label>
                <select
                  value={formData.gasLevel}
                  onChange={(e) => handleInputChange('gasLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Elevated">Elevated</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status & Risk */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wind size={18} className="text-green-500" />
              Status & Risk Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                >
                  {riskLevelOptions.map(risk => (
                    <option key={risk} value={risk}>{risk}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quantity & Shelf Life */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" />
              Quantity & Shelf Life
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity (kg) *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="500"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.quantity ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expected Shelf Life (days) *</label>
                <input
                  type="number"
                  value={formData.expectedShelfLife}
                  onChange={(e) => handleInputChange('expectedShelfLife', e.target.value)}
                  placeholder="14"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.expectedShelfLife ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none`}
                />
                {errors.expectedShelfLife && <p className="text-red-500 text-xs mt-1">{errors.expectedShelfLife}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Batch
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

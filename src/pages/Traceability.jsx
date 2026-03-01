import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { analyticsService } from '../services/analyticsService'
import { 
  SectionCard, 
  MetricCard,
  StatusBadge 
} from '../components/widgets'
import { 
  QrCode, 
  MapPin, 
  Clock,
  CheckCircle2,
  Package,
  Thermometer,
  Droplets
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function Traceability() {
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [traceabilityData, setTraceabilityData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleBatchSearch = async (batchId) => {
    if (!batchId) return
    
    setLoading(true)
    try {
      const data = await analyticsService.getTraceabilityData(batchId)
      setTraceabilityData(data)
      setSelectedBatch(batchId)
    } catch (error) {
      console.error('Error fetching traceability data:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockBatches = [
    { id: 'BATCH-001', crop: 'Tomatoes', status: 'In Transit' },
    { id: 'BATCH-002', crop: 'Potatoes', status: 'In Storage' },
    { id: 'BATCH-003', crop: 'Apples', status: 'In Storage' }
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <SectionCard
          title="QR Crop Traceability"
          subtitle="Complete supply chain traceability from farm to market"
          icon={QrCode}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Scanner Placeholder */}
            <div className="h-64 bg-muted/20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center">
                <QrCode size={48} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">QR Scanner</p>
                <p className="text-sm text-muted-foreground mt-1">Scan QR code to trace batch</p>
              </div>
            </div>

            {/* Quick Search */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Quick Batch Search</h4>
              <div className="space-y-3">
                {mockBatches.map((batch) => (
                  <div 
                    key={batch.id}
                    onClick={() => handleBatchSearch(batch.id)}
                    className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{batch.id}</p>
                        <p className="text-sm text-muted-foreground">{batch.crop}</p>
                      </div>
                      <StatusBadge 
                        status={batch.status === 'In Storage' ? 'optimal' : 'good'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Traceability Results */}
      {traceabilityData && (
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <SectionCard
            title={`Traceability Report: ${selectedBatch}`}
            subtitle="Complete journey from farm to destination"
            icon={Package}
          >
            <div className="space-y-6">
              {/* Origin Information */}
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Origin Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Farm"
                    value={traceabilityData.origin.farm}
                    icon={Package}
                  />
                  <MetricCard
                    title="Harvest Date"
                    value={new Date(traceabilityData.origin.harvestDate).toLocaleDateString()}
                    icon={Clock}
                  />
                  <MetricCard
                    title="Farmer"
                    value={traceabilityData.origin.farmer}
                    icon={CheckCircle2}
                  />
                  <MetricCard
                    title="QR Code"
                    value={traceabilityData.qrCode}
                    icon={QrCode}
                  />
                </div>
              </div>

              {/* Storage Timeline */}
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Package size={20} className="text-blue-500" />
                  Storage Timeline
                </h4>
                <div className="space-y-3">
                  {traceabilityData.storage.map((storage, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-xl bg-blue-10 flex items-center justify-center">
                        <Package size={20} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{storage.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(storage.entryDate).toLocaleString()} - {new Date(storage.exitDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Thermometer size={14} />
                          <span>{storage.avgTemperature}°C</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Droplets size={14} />
                          <span>{storage.avgHumidity}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipments */}
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <MapPin size={20} className="text-green-500" />
                  Shipment History
                </h4>
                <div className="space-y-3">
                  {traceabilityData.shipments.map((shipment, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-xl bg-green-10 flex items-center justify-center">
                        <MapPin size={20} className="text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{shipment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {shipment.departure && new Date(shipment.departure).toLocaleString()} - 
                          {shipment.arrival && new Date(shipment.arrival).toLocaleString()}
                        </p>
                        <p className="text-sm">{shipment.destination}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Thermometer size={14} />
                          <span>{shipment.avgTemperature}°C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Checks */}
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  Quality Checks
                </h4>
                <div className="space-y-3">
                  {traceabilityData.qualityChecks.map((check, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-xl bg-emerald-10 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{check.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(check.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={check.score > 90 ? 'optimal' : 'good'} />
                        <p className="text-sm font-medium mt-1">{check.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </motion.div>
  )
}

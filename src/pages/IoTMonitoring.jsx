import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { useBatch } from '../context/BatchContext'
import { 
  SectionCard, 
  MetricCard, 
  DeviceStatusCard,
  ChartCard
} from '../components/widgets'
import { BatchFilter } from '../components/BatchFilter'
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Wifi,
  Battery,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function IoTMonitoring() {
  const { 
    batches, 
    activeBatches, 
    highRiskBatches,
    loading,
    selectedBatch,
    selectBatch
  } = useBatch()
  
  const [filteredBatchId, setFilteredBatchId] = useState(null)

  // Filter batches based on selection
  const displayBatches = React.useMemo(() => {
    if (!filteredBatchId) return batches
    return batches.filter(batch => batch.id === filteredBatchId)
  }, [batches, filteredBatchId])

  // Calculate aggregated sensor metrics
  const sensorMetrics = React.useMemo(() => {
    if (displayBatches.length === 0) {
      return {
        avgTemp: 0,
        avgHumidity: 0,
        normalGas: 0,
        elevatedGas: 0,
        onlineDevices: 0
      }
    }

    const totalTemp = displayBatches.reduce((sum, batch) => sum + batch.temperature, 0)
    const totalHumidity = displayBatches.reduce((sum, batch) => sum + batch.humidity, 0)
    const normalGas = displayBatches.filter(batch => batch.gasLevel === 'Normal').length
    const elevatedGas = displayBatches.filter(batch => batch.gasLevel === 'Elevated').length
    const onlineDevices = displayBatches.filter(batch => batch.status !== 'Delivered').length

    return {
      avgTemp: Math.round((totalTemp / displayBatches.length) * 10) / 10,
      avgHumidity: Math.round(totalHumidity / displayBatches.length),
      normalGas,
      elevatedGas,
      onlineDevices
    }
  }, [displayBatches])

  if (loading && batches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

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
          title="Multi-Batch IoT Sensor Monitoring"
          subtitle={`Real-time sensor data from ${displayBatches.length} batches`}
          icon={Activity}
          actions={
            <BatchFilter 
              selectedBatch={filteredBatchId} 
              onBatchChange={setFilteredBatchId}
            />
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Sensors"
              value={sensorMetrics.onlineDevices}
              icon={Activity}
              color="text-primary"
              subtitle={`${displayBatches.length} total devices`}
            />
            <MetricCard
              title="Avg Temperature"
              value={`${sensorMetrics.avgTemp}°C`}
              icon={Thermometer}
              color="text-blue-500"
              subtitle="Across all batches"
            />
            <MetricCard
              title="Avg Humidity"
              value={`${sensorMetrics.avgHumidity}%`}
              icon={Droplets}
              color="text-green-500"
              subtitle="Across all batches"
            />
            <MetricCard
              title="Gas Alerts"
              value={sensorMetrics.elevatedGas}
              icon={Wind}
              color="text-orange-500"
              subtitle={`${sensorMetrics.normalGas} normal`}
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Batch Sensor Cards */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Batch Sensor Status"
          subtitle="Real-time monitoring per batch"
          icon={Activity}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayBatches.map((batch) => (
              <DeviceStatusCard
                key={batch.id}
                device={{
                  name: `${batch.cropName} - ${batch.batchId}`,
                  id: batch.id,
                  status: batch.riskLevel === 'High' ? 'offline' : 
                         batch.riskLevel === 'Medium' ? 'warning' : 'online',
                  temperature: batch.temperature,
                  humidity: batch.humidity,
                  batteryLevel: 85 + Math.random() * 15, // Mock battery level
                  signalStrength: Math.floor(70 + Math.random() * 30), // Mock signal
                  lastUpdate: new Date(batch.lastUpdate).toLocaleString(),
                  location: batch.currentLocation,
                  gasLevel: batch.gasLevel
                }}
                onClick={() => selectBatch(batch)}
              />
            ))}
          </div>
          
          {displayBatches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity size={48} className="mx-auto mb-2 opacity-50" />
              <p>No batches found</p>
              <p className="text-sm">Select a different filter or add new batches</p>
            </div>
          )}
        </SectionCard>
      </motion.div>

      {/* High Risk Batches */}
      {highRiskBatches.length > 0 && (
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <SectionCard
            title="High Risk Sensor Readings"
            subtitle={`${highRiskBatches.length} batches require attention`}
            icon={AlertTriangle}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {highRiskBatches.map((batch) => (
                <DeviceStatusCard
                  key={batch.id}
                  device={{
                    name: `${batch.cropName} - ${batch.batchId}`,
                    id: batch.id,
                    status: 'offline',
                    temperature: batch.temperature,
                    humidity: batch.humidity,
                    batteryLevel: 85 + Math.random() * 15,
                    signalStrength: Math.floor(70 + Math.random() * 30),
                    lastUpdate: new Date(batch.lastUpdate).toLocaleString(),
                    location: batch.currentLocation,
                    gasLevel: batch.gasLevel
                  }}
                  onClick={() => selectBatch(batch)}
                />
              ))}
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Sensor Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Temperature Trends"
            subtitle="Real-time temperature monitoring"
            icon={TrendingUp}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <TrendingUp size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Temperature chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {displayBatches.length > 0 ? 
                    `${Math.min(...displayBatches.map(b => b.temperature))}°C - ${Math.max(...displayBatches.map(b => b.temperature))}°C` 
                    : 'No data'}
                </p>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Humidity Distribution"
            subtitle="Environmental humidity analysis"
            icon={Droplets}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <Droplets size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Humidity chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {displayBatches.length > 0 ? 
                    `${Math.min(...displayBatches.map(b => b.humidity))}% - ${Math.max(...displayBatches.map(b => b.humidity))}%` 
                    : 'No data'}
                </p>
              </div>
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Sensor Network Status */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Sensor Network Status"
          subtitle="Overall system health and connectivity"
          icon={Wifi}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Wifi size={20} className="text-green-500" />
                <h4 className="font-medium">Network Connectivity</h4>
              </div>
              <p className="text-2xl font-bold text-green-500">
                {Math.round((sensorMetrics.onlineDevices / Math.max(displayBatches.length, 1)) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {sensorMetrics.onlineDevices} of {displayBatches.length} devices online
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Battery size={20} className="text-blue-500" />
                <h4 className="font-medium">Battery Status</h4>
              </div>
              <p className="text-2xl font-bold text-blue-500">Good</p>
              <p className="text-sm text-muted-foreground">
                All devices above 80% battery
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={20} className="text-orange-500" />
                <h4 className="font-medium">Data Quality</h4>
              </div>
              <p className="text-2xl font-bold text-orange-500">Optimal</p>
              <p className="text-sm text-muted-foreground">
                Real-time updates every 5 seconds
              </p>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

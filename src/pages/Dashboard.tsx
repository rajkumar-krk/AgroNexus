import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { useBatch } from '../context/BatchContext'
import { 
  MetricCard, 
  DeviceStatusCard, 
  SectionCard, 
  AlertItem,
  ChartCard
} from '../components/widgets'
import { AddBatchModal } from '../components/AddBatchModal'
import { BatchFilter } from '../components/BatchFilter'
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Shield,
  Snowflake,
  Truck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  FlaskConical,
  QrCode,
  Bell,
  BarChart3,
  Clock,
  Plus,
  Package
} from 'lucide-react'

const container = createStaggerContainer(0.08)

const featureCards = [
  {
    title: 'IoT Monitoring',
    description: 'Real-time sensor data and device monitoring',
    icon: Activity,
    path: '/iot-monitoring'
  },
  {
    title: 'Cold Storage',
    description: 'Storage unit health and performance',
    icon: Snowflake,
    path: '/cold-storage'
  },
  {
    title: 'GPS Tracking',
    description: 'Live shipment tracking and monitoring',
    icon: MapPin,
    path: '/shipment-gps'
  },
  {
    title: 'Spoilage Detection',
    description: 'AI-powered spoilage risk analysis',
    icon: FlaskConical,
    path: '/spoilage-detection'
  },
  {
    title: 'Traceability',
    description: 'Complete supply chain traceability',
    icon: QrCode,
    path: '/traceability'
  },
  {
    title: 'Cloud Alerts',
    description: 'Real-time alerts and notifications',
    icon: Bell,
    path: '/cloud-alerts'
  },
  {
    title: 'Storage Analytics',
    description: 'Performance analytics and insights',
    icon: BarChart3,
    path: '/storage-analytics'
  },
  {
    title: 'Shelf Life',
    description: 'AI-powered shelf life predictions',
    icon: Clock,
    path: '/shelf-life'
  }
]

export function Dashboard() {
  const { 
    batches = [], 
    activeBatches = [], 
    highRiskBatches = [], 
    inStorageBatches = [], 
    inTransitBatches = [],
    stats,
    loading,
    selectedBatch,
    selectBatch
  } = useBatch()
  
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [filteredBatchId, setFilteredBatchId] = useState(null)

  // Calculate aggregated metrics from batches with safe defaults
  const aggregatedMetrics = React.useMemo(() => {
    if (!batches || batches.length === 0) {
      return { avgTemp: 0, avgHumidity: 0, totalQuantity: 0 }
    }
    
    const totalTemp = batches.reduce((sum, batch) => sum + (batch.temperature || 0), 0)
    const totalHumidity = batches.reduce((sum, batch) => sum + (batch.humidity || 0), 0)
    const totalQty = batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)
    
    return {
      avgTemp: Math.round((totalTemp / batches.length) * 10) / 10,
      avgHumidity: Math.round(totalHumidity / batches.length),
      totalQuantity: totalQty
    }
  }, [batches])

  // Filter batches based on selection with safe defaults
  const displayBatches = React.useMemo(() => {
    if (!batches || !Array.isArray(batches)) return []
    if (!filteredBatchId) return batches
    return batches.filter(batch => batch && batch.id === filteredBatchId)
  }, [batches, filteredBatchId])

  if (loading && (!batches || batches.length === 0)) {
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
          title="Multi-Batch Cold Chain Monitoring"
          subtitle={`Monitor ${batches.length} active crop batches in real time`}
          icon={Activity}
          actions={
            <div className="flex items-center gap-3">
              <BatchFilter 
                selectedBatch={filteredBatchId} 
                onBatchChange={setFilteredBatchId}
              />
              <button
                onClick={() => setShowAddBatchModal(true)}
                className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Batch
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Batches"
              value={activeBatches.length}
              icon={Package}
              color="text-primary"
              subtitle={`${inStorageBatches.length} in storage, ${inTransitBatches.length} in transit`}
            />
            <MetricCard
              title="Avg Temperature"
              value={`${aggregatedMetrics.avgTemp}°C`}
              icon={Thermometer}
              color="text-blue-500"
              subtitle="Across all batches"
            />
            <MetricCard
              title="Avg Humidity"
              value={`${aggregatedMetrics.avgHumidity}%`}
              icon={Droplets}
              color="text-green-500"
              subtitle="Across all batches"
            />
            <MetricCard
              title="High Risk Batches"
              value={highRiskBatches.length}
              icon={AlertTriangle}
              color="text-red-500"
              subtitle="Requires immediate attention"
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Batch Overview */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Batch Overview"
          subtitle={`${displayBatches.length} batches${filteredBatchId ? ' (filtered)' : ''}`}
          icon={Package}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayBatches && displayBatches.length > 0 ? displayBatches.slice(0, 6).map((batch) => (
              batch && (
                <DeviceStatusCard
                  key={batch.id}
                  device={{
                    name: `${batch.cropName || 'Unknown'} - ${batch.batchId || 'N/A'}`,
                    id: batch.id,
                    status: batch.riskLevel === 'High' ? 'offline' : 
                           batch.riskLevel === 'Medium' ? 'warning' : 'online',
                    temperature: batch.temperature || 0,
                    humidity: batch.humidity || 0,
                    capacity: batch.quantity ? Math.round((batch.quantity / 1000) * 100) : 0,
                    lastUpdate: batch.lastUpdate ? new Date(batch.lastUpdate).toLocaleString() : 'Unknown',
                    location: batch.currentLocation || 'Unknown',
                    destination: batch.destination || 'Unknown'
                  }}
                  onClick={() => selectBatch && selectBatch(batch)}
                />
              )
            )) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Package size={48} className="mx-auto mb-2 opacity-50" />
                <p>No batches found</p>
                <p className="text-sm">Add your first batch to get started</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Storage Health Summary */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Storage Units"
          subtitle={`${inStorageBatches.length} batches in storage`}
          icon={Snowflake}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inStorageBatches && inStorageBatches.length > 0 ? inStorageBatches.slice(0, 4).map((batch) => (
              batch && (
                <DeviceStatusCard
                  key={batch.id}
                  device={{
                    name: `${batch.cropName || 'Unknown'} - ${batch.storageUnit || 'N/A'}`,
                    id: batch.id,
                    status: batch.riskLevel === 'High' ? 'offline' : 
                           batch.riskLevel === 'Medium' ? 'warning' : 'online',
                    temperature: batch.temperature || 0,
                    humidity: batch.humidity || 0,
                    capacity: batch.quantity ? Math.round((batch.quantity / 1000) * 100) : 0,
                    lastUpdate: batch.lastUpdate ? new Date(batch.lastUpdate).toLocaleString() : 'Unknown',
                    location: batch.currentLocation || 'Unknown'
                  }}
                  onClick={() => selectBatch && selectBatch(batch)}
                />
              )
            )) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Snowflake size={48} className="mx-auto mb-2 opacity-50" />
                <p>No batches in storage</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Shipment Summary */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Active Shipments"
          subtitle={`${inTransitBatches.length} batches in transit`}
          icon={Truck}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inTransitBatches && inTransitBatches.length > 0 ? inTransitBatches.map((batch) => (
              batch && (
                <DeviceStatusCard
                  key={batch.id}
                  device={{
                    name: `${batch.cropName || 'Unknown'} - ${batch.batchId || 'N/A'}`,
                    id: batch.id,
                    status: 'online',
                    temperature: batch.temperature || 0,
                    humidity: batch.humidity || 0,
                    lastUpdate: batch.lastUpdate ? new Date(batch.lastUpdate).toLocaleString() : 'Unknown',
                    location: batch.currentLocation || 'Unknown',
                    destination: batch.destination || 'Unknown'
                  }}
                  onClick={() => selectBatch && selectBatch(batch)}
                />
              )
            )) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Truck size={48} className="mx-auto mb-2 opacity-50" />
                <p>No batches in transit</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* High Risk Alerts */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="High Risk Batches"
          subtitle={`${highRiskBatches.length} batches require immediate attention`}
          icon={AlertTriangle}
        >
          <div className="space-y-3">
            {highRiskBatches && highRiskBatches.length > 0 ? highRiskBatches.map((batch) => (
              batch && (
                <AlertItem
                  key={batch.id}
                  alert={{
                    id: batch.id,
                    type: 'error',
                    title: `High Risk: ${batch.cropName || 'Unknown'} - ${batch.batchId || 'N/A'}`,
                    message: `Temperature: ${batch.temperature || 0}°C, Risk Level: ${batch.riskLevel || 'Unknown'}`,
                    timestamp: batch.lastUpdate || new Date().toISOString(),
                    deviceId: batch.id,
                    acknowledged: false,
                    resolved: false
                  }}
                  onAcknowledge={(id) => console.log('Acknowledge batch alert:', id)}
                  onResolve={(id) => console.log('Resolve batch alert:', id)}
                />
              )
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle size={48} className="mx-auto mb-2 opacity-50" />
                <p>No high-risk batches</p>
                <p className="text-sm">All batches are within safe parameters</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Feature Overview Cards */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="System Modules"
          subtitle="Access all cold chain monitoring features"
          icon={Activity}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                custom={index}
                viewport={{ once: true, margin: '-100px' }}
                initial="hidden"
                whileInView="visible"
                onClick={() => window.location.href = feature.path}
                className="p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon size={20} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-sm">{feature.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* Mini Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Temperature Distribution"
            subtitle="Across all batches"
            icon={TrendingUp}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <TrendingUp size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Temperature chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {batches && batches.length > 0 ? 
                    `${Math.min(...batches.map(b => b.temperature || 0))}°C - ${Math.max(...batches.map(b => b.temperature || 0))}°C` 
                    : 'No data'}
                </p>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Batch Status Overview"
            subtitle="Current batch distribution"
            icon={Package}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <Package size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Status chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">In Storage: {inStorageBatches?.length || 0} | In Transit: {inTransitBatches?.length || 0}</p>
              </div>
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Add Batch Modal */}
      <AddBatchModal 
        isOpen={showAddBatchModal} 
        onClose={() => setShowAddBatchModal(false)} 
      />
    </motion.div>
  )
}

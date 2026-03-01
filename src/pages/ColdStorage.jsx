import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { useBatch } from '../context/BatchContext'
import { 
  MetricCard, 
  DeviceStatusCard, 
  SectionCard, 
  ChartCard 
} from '../components/widgets'
import { BatchFilter } from '../components/BatchFilter'
import { 
  Snowflake, 
  Thermometer, 
  Droplets, 
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function ColdStorage() {
  const { 
    batches, 
    inStorageBatches, 
    highRiskBatches,
    loading,
    selectedBatch,
    selectBatch
  } = useBatch()
  
  const [filteredBatchId, setFilteredBatchId] = useState(null)

  // Filter batches based on selection
  const displayBatches = React.useMemo(() => {
    if (!filteredBatchId) return inStorageBatches
    return inStorageBatches.filter(batch => batch.id === filteredBatchId)
  }, [inStorageBatches, filteredBatchId])

  // Calculate storage metrics
  const storageMetrics = React.useMemo(() => {
    if (!displayBatches || displayBatches.length === 0) {
      return {
        avgTemp: 4.5,
        avgHumidity: 85,
        totalUnits: 0,
        activeUnits: 0,
        optimalUnits: 0,
        warningUnits: 0
      }
    }

    const avgTemp = displayBatches.reduce((sum, batch) => sum + (batch.temperature || 0), 0) / displayBatches.length
    const avgHumidity = displayBatches.reduce((sum, batch) => sum + (batch.humidity || 0), 0) / displayBatches.length
    
    return {
      avgTemp: Math.round(avgTemp * 10) / 10,
      avgHumidity: Math.round(avgHumidity),
      totalUnits: displayBatches.length,
      activeUnits: displayBatches.filter(batch => batch.status === 'In Storage').length,
      optimalUnits: displayBatches.filter(batch => batch.riskLevel === 'Low').length,
      warningUnits: displayBatches.filter(batch => batch.riskLevel === 'Medium' || batch.riskLevel === 'High').length
    }
  }, [displayBatches])

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
          title="Multi-Batch Cold Storage Health"
          subtitle={`Monitor ${displayBatches.length} storage units in real time`}
          icon={Snowflake}
          actions={
            <BatchFilter 
              selectedBatch={filteredBatchId} 
              onBatchChange={setFilteredBatchId}
            />
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Units"
              value={storageMetrics.activeUnits}
              icon={Snowflake}
              color="text-primary"
              subtitle={`${storageMetrics.totalUnits} total units`}
            />
            <MetricCard
              title="Avg Temperature"
              value={`${storageMetrics.avgTemp}°C`}
              icon={Thermometer}
              color="text-blue-500"
              subtitle="Optimal: 3-6°C"
            />
            <MetricCard
              title="Avg Humidity"
              value={`${storageMetrics.avgHumidity}%`}
              icon={Droplets}
              color="text-green-500"
              subtitle="Optimal: 80-90%"
            />
            <MetricCard
              title="Warning Units"
              value={storageMetrics.warningUnits}
              icon={AlertTriangle}
              color="text-orange-500"
              subtitle="Require attention"
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Storage Units */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Storage Units"
          subtitle="Individual storage unit monitoring"
          icon={Snowflake}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayBatches && displayBatches.length > 0 ? displayBatches.map((batch) => (
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
                <p>No storage units found</p>
                <p className="text-sm">Add batches to storage to see monitoring data</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* High Risk Storage */}
      {highRiskBatches && highRiskBatches.length > 0 && (
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <SectionCard
            title="High Risk Storage Units"
            subtitle={`${highRiskBatches.filter(b => b.status === 'In Storage').length} units require attention`}
            icon={AlertTriangle}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {highRiskBatches.filter(batch => batch.status === 'In Storage').map((batch) => (
                batch && (
                  <DeviceStatusCard
                    key={batch.id}
                    device={{
                      name: `${batch.cropName || 'Unknown'} - ${batch.storageUnit || 'N/A'}`,
                      id: batch.id,
                      status: 'offline',
                      temperature: batch.temperature || 0,
                      humidity: batch.humidity || 0,
                      lastUpdate: batch.lastUpdate ? new Date(batch.lastUpdate).toLocaleString() : 'Unknown',
                      location: batch.currentLocation || 'Unknown'
                    }}
                    onClick={() => selectBatch && selectBatch(batch)}
                  />
                )
              ))}
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Storage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Temperature Trends"
            subtitle="Last 24 hours"
            icon={TrendingUp}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <TrendingUp size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Temperature chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Range: {displayBatches.length > 0 ? 
                    `${Math.min(...displayBatches.map(b => b.temperature || 0))}°C - ${Math.max(...displayBatches.map(b => b.temperature || 0))}°C` 
                    : 'No data'}
                </p>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
          <ChartCard
            title="Humidity Levels"
            subtitle="Environmental humidity analysis"
            icon={Droplets}
          >
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <Droplets size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Humidity chart placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Range: {displayBatches.length > 0 ? 
                    `${Math.min(...displayBatches.map(b => b.humidity || 0))}% - ${Math.max(...displayBatches.map(b => b.humidity || 0))}%` 
                    : 'No data'}
                </p>
              </div>
            </div>
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  )
}

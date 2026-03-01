import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { analyticsService } from '../services/analyticsService'
import { 
  SectionCard, 
  MetricCard, 
  ChartCard 
} from '../components/widgets'
import { 
  BarChart3, 
  TrendingUp,
  Zap,
  Activity,
  Thermometer,
  Droplets
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function StorageAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsService.getStorageAnalytics()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Update analytics every 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
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
          title="Storage Analytics"
          subtitle="Performance insights and optimization opportunities"
          icon={BarChart3}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Energy Efficiency"
              value={`${analyticsData?.energyEfficiency?.current || 0}%`}
              icon={Zap}
              color="text-green-500"
              trend={{ 
                type: analyticsData?.energyEfficiency?.trend === 'improving' ? 'up' : 'down', 
                value: `${analyticsData?.energyEfficiency?.current - 85}%`, 
                period: 'vs target' 
              }}
              subtitle={`Target: ${analyticsData?.energyEfficiency?.target || 0}%`}
            />
            <MetricCard
              title="Temp Stability"
              value={`${analyticsData?.temperatureStability?.variance || 0}°C`}
              icon={Thermometer}
              color="text-blue-500"
              subtitle={`${analyticsData?.temperatureStability?.compliance || 0}% compliance`}
            />
            <MetricCard
              title="Capacity Utilization"
              value={`${analyticsData?.capacityUtilization?.current || 0}%`}
              icon={Activity}
              color="text-orange-500"
              subtitle={`Optimal: ${analyticsData?.capacityUtilization?.optimal || 0}%`}
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Energy Efficiency Chart */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <ChartCard
          title="Energy Efficiency Trends"
          subtitle="Monthly performance tracking"
          icon={Zap}
        >
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
            <div className="text-center">
              <TrendingUp size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Energy Efficiency Chart</p>
              <p className="text-sm text-muted-foreground mt-1">
                {analyticsData?.energyEfficiency?.monthlyData?.length || 0} months of data
              </p>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Capacity Utilization Forecast */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <ChartCard
          title="Capacity Utilization Forecast"
          subtitle="30-day capacity prediction"
          icon={Activity}
        >
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
            <div className="text-center">
              <BarChart3 size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Capacity Forecast Chart</p>
              <p className="text-sm text-muted-foreground mt-1">
                {analyticsData?.capacityUtilization?.forecast?.length || 0} days forecast
              </p>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Performance Metrics"
          subtitle="Key performance indicators"
          icon={BarChart3}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Analysis */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Thermometer size={20} className="text-primary" />
                Temperature Analysis
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    <span className="font-medium">{analyticsData?.temperatureStability?.variance || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Target Variance</span>
                    <span className="font-medium">{analyticsData?.temperatureStability?.targetVariance || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Compliance Rate</span>
                    <span className="font-medium">{analyticsData?.temperatureStability?.compliance || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Analysis */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap size={20} className="text-green-500" />
                Energy Analysis
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Efficiency</span>
                    <span className="font-medium">{analyticsData?.energyEfficiency?.current || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Target Efficiency</span>
                    <span className="font-medium">{analyticsData?.energyEfficiency?.target || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Trend</span>
                    <span className="font-medium capitalize">{analyticsData?.energyEfficiency?.trend || 'stable'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Optimization Recommendations */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Optimization Recommendations"
          subtitle="AI-powered suggestions for improvement"
          icon={TrendingUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium mb-2">Energy Optimization</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adjust temperature setpoints by 0.5°C during off-peak hours</li>
                <li>• Schedule defrost cycles during low-demand periods</li>
                <li>• Optimize door opening schedules</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium mb-2">Capacity Optimization</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reorganize storage layout for better air circulation</li>
                <li>• Implement dynamic pricing based on capacity</li>
                <li>• Consider temporary storage during peak periods</li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

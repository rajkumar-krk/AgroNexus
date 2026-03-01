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
  Clock, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Droplets
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function ShelfLife() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsService.getShelfLifePredictions()
        setPredictions(data)
      } catch (error) {
        console.error('Error fetching shelf life data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Update predictions every hour
    const interval = setInterval(fetchData, 3600000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very Low': return 'text-green-600'
      case 'Low': return 'text-blue-600'
      case 'Medium': return 'text-yellow-600'
      case 'High': return 'text-orange-600'
      case 'Very High': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskStatus = (risk) => {
    switch (risk) {
      case 'Very Low': return 'optimal'
      case 'Low': return 'good'
      case 'Medium': return 'warning'
      case 'High': return 'offline'
      case 'Very High': return 'offline'
      default: return 'good'
    }
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
          title="Shelf Life Predictor"
          subtitle="AI-powered shelf life predictions and recommendations"
          icon={Clock}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Batches"
              value={predictions.length}
              icon={Calendar}
              color="text-primary"
            />
            <MetricCard
              title="Avg Quality Score"
              value={
                predictions.length > 0 
                  ? Math.round(predictions.reduce((sum, p) => sum + p.qualityScore, 0) / predictions.length)
                  : 0
              }
              icon={CheckCircle2}
              color="text-green-500"
            />
            <MetricCard
              title="High Risk Batches"
              value={predictions.filter(p => p.spoilageRisk === 'High' || p.spoilageRisk === 'Very High').length}
              icon={AlertTriangle}
              color="text-red-500"
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Shelf Life Predictions */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Batch Predictions"
          subtitle={`${predictions.length} batches analyzed`}
          icon={Calendar}
        >
          <div className="space-y-4">
            {predictions.map((batch) => (
              <div key={batch.id} className="p-6 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{batch.crop}</h4>
                    <p className="text-sm text-muted-foreground">{batch.id}</p>
                    <p className="text-sm text-muted-foreground">Origin: {batch.origin}</p>
                    <p className="text-sm text-muted-foreground">Current Storage: {batch.currentStorage}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={getRiskStatus(batch.spoilageRisk)} />
                    <p className={`text-sm font-medium mt-1 ${getRiskColor(batch.spoilageRisk)}`}>
                      {batch.spoilageRisk} Risk
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Harvest Date</p>
                    <p className="font-medium">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Temperature</p>
                    <p className="font-medium flex items-center gap-1">
                      <Thermometer size={14} />
                      {batch.avgTemperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time-Temp Exposure</p>
                    <p className="font-medium">{batch.timeTempExposure} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quality Score</p>
                    <p className="font-medium">{batch.qualityScore}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted Shelf Life</span>
                      <span className="font-bold text-lg">{batch.predictedShelfLife} days</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(batch.remainingDays / batch.predictedShelfLife) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {batch.remainingDays} days remaining
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Storage Conditions</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer size={14} />
                        <span>{batch.avgTemperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets size={14} />
                        <span>Optimal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Recommendations
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {batch.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* Risk Summary */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Risk Distribution"
          subtitle="Spoilage risk breakdown across all batches"
          icon={AlertTriangle}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map((risk) => {
              const count = predictions.filter(p => p.spoilageRisk === risk).length
              const percentage = predictions.length > 0 ? (count / predictions.length) * 100 : 0
              
              return (
                <div key={risk} className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${getRiskColor(risk)}`}>
                    {count}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{risk}</p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

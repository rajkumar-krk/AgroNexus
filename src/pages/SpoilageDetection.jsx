import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { analyticsService } from '../services/analyticsService'
import { 
  SectionCard, 
  MetricCard, 
  AlertItem,
  StatusBadge 
} from '../components/widgets'
import { 
  FlaskConical, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Activity,
  CheckCircle2
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function SpoilageDetection() {
  const [spoilageAnalysis, setSpoilageAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analysis = await analyticsService.getSpoilageAnalysis()
        setSpoilageAnalysis(analysis)
      } catch (error) {
        console.error('Error fetching spoilage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Update every 5 minutes for spoilage detection
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
          title="Spoilage Detection"
          subtitle="AI-powered analysis of spoilage risk factors"
          icon={FlaskConical}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Overall Risk"
              value={spoilageAnalysis?.overallRisk || 'Low'}
              icon={Shield}
              color={getRiskColor(spoilageAnalysis?.overallRisk)}
              subtitle={`Risk Score: ${spoilageAnalysis?.riskScore || 0}`}
            />
            <MetricCard
              title="Risk Score"
              value={spoilageAnalysis?.riskScore || 0}
              icon={Activity}
              color="text-orange-500"
              subtitle="Lower is better"
            />
            <MetricCard
              title="High Risk Batches"
              value={spoilageAnalysis?.highRiskBatches?.length || 0}
              icon={AlertTriangle}
              color="text-red-500"
              subtitle="Requires immediate attention"
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Risk Factors */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Risk Factor Analysis"
          subtitle="Contributing factors to spoilage risk"
          icon={TrendingUp}
        >
          <div className="space-y-4">
            {spoilageAnalysis?.riskFactors?.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{factor.factor}</p>
                    <p className="text-sm text-muted-foreground">Impact Level</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge 
                    status={factor.impact.toLowerCase() === 'very low' ? 'optimal' : 
                            factor.impact.toLowerCase() === 'low' ? 'good' : 
                            factor.impact.toLowerCase() === 'medium' ? 'warning' : 'offline'}
                  />
                  <p className="text-sm font-medium mt-1">{factor.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* High Risk Batches */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="High Risk Batches"
          subtitle={`${spoilageAnalysis?.highRiskBatches?.length || 0} batches require immediate attention`}
          icon={AlertTriangle}
        >
          <div className="space-y-3">
            {spoilageAnalysis?.highRiskBatches?.map((batch) => (
              <AlertItem
                key={batch.batchId}
                alert={{
                  id: batch.batchId,
                  type: 'error',
                  title: `High Risk Batch: ${batch.batchId}`,
                  message: batch.reason,
                  timestamp: new Date().toISOString(),
                  deviceId: batch.batchId,
                  acknowledged: false,
                  resolved: false
                }}
                onAcknowledge={(id) => console.log('Acknowledge batch alert:', id)}
                onResolve={(id) => console.log('Resolve batch alert:', id)}
              />
            ))}
            
            {(!spoilageAnalysis?.highRiskBatches || spoilageAnalysis.highRiskBatches.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 size={48} className="mx-auto mb-2 opacity-50" />
                <p>No high-risk batches</p>
                <p className="text-sm">All batches within acceptable risk parameters</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="AI Recommendations"
          subtitle="System-generated recommendations to reduce spoilage risk"
          icon={FlaskConical}
        >
          <div className="space-y-3">
            {spoilageAnalysis?.recommendations?.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle2 size={20} className="text-green-500 mt-0.5 shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

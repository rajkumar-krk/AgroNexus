import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { alertService } from '../services/alertService'
import { 
  SectionCard, 
  MetricCard, 
  AlertItem,
  StatusBadge 
} from '../components/widgets'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  Filter
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function CloudAlerts() {
  const [activeAlerts, setActiveAlerts] = useState([])
  const [alertHistory, setAlertHistory] = useState([])
  const [alertStats, setAlertStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [active, history, stats] = await Promise.all([
          alertService.getActiveAlerts(),
          alertService.getAlertHistory(20),
          alertService.getAlertStats()
        ])
        
        setActiveAlerts(active)
        setAlertHistory(history)
        setAlertStats(stats)
      } catch (error) {
        console.error('Error fetching alert data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Update alerts every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await alertService.acknowledgeAlert(alertId)
      setActiveAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      )
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const handleResolveAlert = async (alertId) => {
    try {
      await alertService.resolveAlert(alertId)
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const filteredAlerts = filter === 'all' 
    ? activeAlerts 
    : activeAlerts.filter(alert => alert.type === filter)

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
          title="Cloud Alerts & Logs"
          subtitle="Real-time alerts and system notifications"
          icon={Bell}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Alerts"
              value={alertStats?.total || 0}
              icon={Bell}
              color="text-primary"
            />
            <MetricCard
              title="Active"
              value={alertStats?.active || 0}
              icon={AlertTriangle}
              color="text-orange-500"
            />
            <MetricCard
              title="Resolved"
              value={alertStats?.resolved || 0}
              icon={CheckCircle2}
              color="text-green-500"
            />
            <MetricCard
              title="Acknowledged"
              value={alertStats?.acknowledged || 0}
              icon={Info}
              color="text-blue-500"
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* Alert Statistics */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Alert Statistics"
          subtitle="Breakdown by type and severity"
          icon={TrendingUp}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Type */}
            <div>
              <h4 className="font-medium mb-3">By Type</h4>
              <div className="space-y-2">
                {alertStats?.byType && Object.entries(alertStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      {type === 'error' && <XCircle size={16} className="text-red-500" />}
                      {type === 'warning' && <AlertTriangle size={16} className="text-yellow-500" />}
                      {type === 'info' && <Info size={16} className="text-blue-500" />}
                      {type === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                      <span className="capitalize">{type}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Severity */}
            <div>
              <h4 className="font-medium mb-3">By Severity</h4>
              <div className="space-y-2">
                {alertStats?.bySeverity && Object.entries(alertStats.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={severity === 'high' ? 'offline' : 
                                severity === 'medium' ? 'warning' : 'optimal'}
                      />
                      <span className="capitalize">{severity}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Active Alerts */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Active Alerts"
          subtitle={`${filteredAlerts.length} alerts requiring attention`}
          icon={AlertTriangle}
        >
          {/* Filter */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-muted-foreground" />
            <div className="flex gap-2">
              {['all', 'error', 'warning', 'info', 'success'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === type 
                      ? 'bg-primary text-white' 
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledgeAlert}
                onResolve={handleResolveAlert}
              />
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 size={48} className="mx-auto mb-2 opacity-50" />
                <p>No active alerts</p>
                <p className="text-sm">System is running smoothly</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Recent History */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Recent History"
          subtitle="Last 20 resolved alerts"
          icon={Clock}
        >
          <div className="space-y-3">
            {alertHistory.slice(0, 10).map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                showActions={false}
              />
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

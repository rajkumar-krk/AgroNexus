import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  Filter,
  Clock,
  ShieldCheck,
  Activity
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }
  })
}

export function CloudAlerts() {
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        api.getAlerts({ limit: 50 }),
        api.getAlertStats()
      ])
      
      if (alertsRes.success && alertsRes.data?.alerts) {
        setAlerts(alertsRes.data.alerts)
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error('Error fetching alert data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleAcknowledge = async (alertId) => {
    try {
      await api.acknowledgeAlert(alertId)
      setAlerts(prev => prev.filter(a => a._id !== alertId))
      // Refresh stats
      const statsRes = await api.getAlertStats()
      if (statsRes.success) setStats(statsRes.data)
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const handleResolve = async (alertId) => {
    try {
      await api.resolveAlert(alertId)
      setAlerts(prev => prev.filter(a => a._id !== alertId))
      const statsRes = await api.getAlertStats()
      if (statsRes.success) setStats(statsRes.data)
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter || a.severity === filter)

  const severityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle size={18} className="text-red-600" />
      case 'high': return <AlertTriangle size={18} className="text-orange-600" />
      case 'medium': return <AlertTriangle size={18} className="text-amber-500" />
      case 'low': return <Info size={18} className="text-blue-500" />
      default: return <Info size={18} className="text-muted-foreground" />
    }
  }

  const severityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'high': return 'bg-orange-50 border-orange-200'
      case 'medium': return 'bg-amber-50 border-amber-200'
      case 'low': return 'bg-blue-50 border-blue-200'
      default: return 'bg-muted/30 border-border/60'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center animate-pulse">
            <Bell size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-muted-foreground">Loading alerts from database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ═══ Hero Header ═══ */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-900 via-red-800 to-rose-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-400/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
            <span className="text-red-100 text-xs font-medium uppercase tracking-wider">Real-time Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Cloud Alerts & Logs
          </h1>
          <p className="text-red-100/80 text-sm mt-1">
            {alerts.filter(a => !a.acknowledged).length} unacknowledged alerts from sensor monitoring
          </p>
        </div>
      </motion.div>

      {/* ═══ Stats Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Alerts', value: stats?.total || 0, icon: Bell, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active', value: stats?.active || 0, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Critical', value: stats?.bySeverity?.critical || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            variants={fadeUp} custom={i + 1} initial="hidden" animate="visible"
            className="bg-white rounded-2xl border border-border/60 p-4 sm:p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{m.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ Severity Breakdown ═══ */}
      {stats?.bySeverity && (
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-violet-600" />
              Alert Severity Breakdown
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className={`rounded-xl p-3 border ${severityColor(severity)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {severityIcon(severity)}
                    <span className="text-sm font-semibold capitalize">{severity}</span>
                  </div>
                  <p className="text-2xl font-extrabold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Filter + Active Alerts ═══ */}
      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            Active Alerts
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {filteredAlerts.length} alerts
            </span>
          </h2>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <Filter size={14} className="text-muted-foreground flex-shrink-0" />
          {['all', 'critical', 'high', 'medium', 'low'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0 ${
                filter === type 
                  ? 'bg-primary text-white' 
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className={`rounded-2xl border p-4 transition-all ${severityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-100' : 
                  alert.severity === 'high' ? 'bg-orange-100' : 
                  alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {severityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground capitalize">
                      {alert.type}
                    </span>
                    {alert.batchId && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        • Batch: {alert.batchId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAcknowledge(alert._id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleResolve(alert._id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck size={48} className="mx-auto mb-3 opacity-30 text-emerald-500" />
              <p className="font-medium text-emerald-600">All Clear</p>
              <p className="text-xs mt-1">No active alerts — system is running smoothly</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══ System Status ═══ */}
      <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Activity size={14} className="text-emerald-500" />
            Alerts auto-refresh every 15 seconds
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck size={14} className="text-cyan-500" />
            Source: MongoDB — Real-time threshold monitoring
          </div>
        </div>
      </motion.div>
    </div>
  )
}

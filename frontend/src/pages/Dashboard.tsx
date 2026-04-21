import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useBatch } from '../context/BatchContext'
import { useThingSpeakContext } from '../context/ThingSpeakContext'
import { AddBatchModal } from '../components/AddBatchModal'
import { BatchFilter } from '../components/BatchFilter'
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Snowflake,
  Truck,
  MapPin,
  FlaskConical,
  QrCode,
  Bell,
  BarChart3,
  Clock,
  Plus,
  Package,
  ArrowUpRight,
  Shield,
  Zap,
  Eye,
  Radio,
  Wifi,
  WifiOff,
  Wind
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }
  })
}

const quickLinks = [
  { title: 'Live Monitor',    icon: Radio,         path: '/dashboard/live-monitor',         color: 'from-cyan-500 to-blue-600',      shadow: 'shadow-cyan-500/15' },
  { title: 'IoT Monitoring',  icon: Activity,      path: '/dashboard/iot-monitoring',       color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/15' },
  { title: 'Cold Storage',    icon: Snowflake,     path: '/dashboard/cold-storage',         color: 'from-sky-500 to-blue-600',       shadow: 'shadow-sky-500/15' },
  { title: 'GPS Tracking',    icon: MapPin,        path: '/dashboard/shipment-gps',         color: 'from-violet-500 to-purple-600',  shadow: 'shadow-violet-500/15' },
  { title: 'Spoilage AI',     icon: FlaskConical,  path: '/dashboard/spoilage-detection',   color: 'from-amber-500 to-orange-600',   shadow: 'shadow-amber-500/15' },
  { title: 'Traceability',    icon: QrCode,        path: '/dashboard/traceability',         color: 'from-teal-500 to-cyan-600',      shadow: 'shadow-teal-500/15' },
  { title: 'Cloud Alerts',    icon: Bell,          path: '/dashboard/cloud-alerts',         color: 'from-rose-500 to-red-600',       shadow: 'shadow-rose-500/15' },
  { title: 'Analytics',       icon: BarChart3,     path: '/dashboard/storage-analytics',    color: 'from-indigo-500 to-blue-600',    shadow: 'shadow-indigo-500/15' },
  { title: 'Shelf Life',      icon: Clock,         path: '/dashboard/shelf-life',           color: 'from-lime-500 to-green-600',     shadow: 'shadow-lime-500/15' },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { 
    batches = [], 
    activeBatches = [], 
    highRiskBatches = [], 
    inStorageBatches = [], 
    inTransitBatches = [],
    loading,
    selectBatch
  } = useBatch()
  
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [filteredBatchId, setFilteredBatchId] = useState(null)

  // ThingSpeak live data
  const { data: tsData, isConnected: tsConnected, activeAlerts, spoilageRisk, lastUpdated: tsLastUpdated } = useThingSpeakContext()

  const metrics = React.useMemo(() => {
    if (!batches.length) return { avgTemp: 0, avgHumidity: 0 }
    const t = batches.reduce((s, b) => s + (b.temperature || 0), 0) / batches.length
    const h = batches.reduce((s, b) => s + (b.humidity || 0), 0) / batches.length
    return { avgTemp: Math.round(t * 10) / 10, avgHumidity: Math.round(h) }
  }, [batches])

  const displayBatches = React.useMemo(() => {
    if (!filteredBatchId) return batches
    return batches.filter(b => b.id === filteredBatchId)
  }, [batches, filteredBatchId])

  if (loading && !batches.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
            <Activity size={20} className="text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading cold chain data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ═══ Hero Header ═══ */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden gradient-primary p-6 sm:p-8"
      >
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Live Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
              Cold Chain Dashboard
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1">
              {batches.length} active batches • {inStorageBatches.length} stored • {inTransitBatches.length} in transit
            </p>
          </div>
          <div className="flex gap-2">
            <BatchFilter 
              selectedBatch={filteredBatchId} 
              onBatchChange={setFilteredBatchId}
            />
            <motion.button
              onClick={() => setShowAddBatchModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center gap-2 text-sm font-semibold border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={16} /> Add Batch
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ═══ Live IoT Feed from ThingSpeak ═══ */}
      {tsData && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-heading font-bold flex items-center gap-2">
              <Radio size={16} className="text-cyan-500" />
              Live ThingSpeak Feed
              <span className={`ml-1 w-2 h-2 rounded-full ${tsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            </h2>
            <button
              onClick={() => navigate('/dashboard/live-monitor')}
              className="text-xs font-semibold text-cyan-600 hover:underline flex items-center gap-1"
            >
              <Eye size={12} /> Full Monitor
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`bg-white rounded-xl border p-3 ${tsData.temperature > 10 ? 'border-red-300 bg-red-50/50' : 'border-border/60'}`}>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Temp</p>
              <p className={`text-xl font-extrabold ${tsData.temperature > 10 ? 'text-red-600' : 'text-foreground'}`}>{tsData.temperature.toFixed(1)}°C</p>
            </div>
            <div className={`bg-white rounded-xl border p-3 ${tsData.humidity > 85 ? 'border-amber-300 bg-amber-50/50' : 'border-border/60'}`}>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Humidity</p>
              <p className={`text-xl font-extrabold ${tsData.humidity > 85 ? 'text-amber-600' : 'text-foreground'}`}>{tsData.humidity.toFixed(1)}%</p>
            </div>
            <div className={`bg-white rounded-xl border p-3 ${tsData.gas > 500 ? 'border-red-300 bg-red-50/50' : 'border-border/60'}`}>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Gas</p>
              <p className={`text-xl font-extrabold ${tsData.gas > 500 ? 'text-red-600' : 'text-foreground'}`}>{tsData.gas.toFixed(0)}</p>
            </div>
            <div className={`bg-white rounded-xl border border-border/60 p-3`}>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Risk</p>
              <p className={`text-xl font-extrabold ${
                spoilageRisk.color === 'rose' ? 'text-rose-600' : spoilageRisk.color === 'amber' ? 'text-amber-500' : 'text-emerald-500'
              }`}>{spoilageRisk.level}</p>
            </div>
          </div>
          {activeAlerts.length > 0 && (
            <div className="mt-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle size={14} />
              {activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''} — View Live Monitor for details
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ Metric Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Batches',  value: activeBatches.length,       sub: `${inStorageBatches.length} stored`,  icon: Package,       color: 'text-emerald-600', bg: 'bg-emerald-50',  trend: '+2', trendUp: true },
          { label: 'Avg Temperature', value: `${metrics.avgTemp}°C`,     sub: 'Across batches',    icon: Thermometer,   color: 'text-sky-600',     bg: 'bg-sky-50',      trend: '-0.3°', trendUp: false },
          { label: 'Avg Humidity',    value: `${metrics.avgHumidity}%`,  sub: 'Across batches',    icon: Droplets,      color: 'text-violet-600',  bg: 'bg-violet-50',   trend: '+2%', trendUp: true },
          { label: 'High Risk',       value: highRiskBatches.length,     sub: 'Needs attention',   icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',      trend: highRiskBatches.length > 0 ? '!' : '✓', trendUp: false },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            variants={fadeUp} custom={i + 1} initial="hidden" animate="visible"
            className="bg-white rounded-2xl border border-border/60 p-4 sm:p-5 hover-lift group cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                <m.icon size={18} className={m.color} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                m.trendUp ? 'bg-emerald-50 text-emerald-600' : m.label === 'High Risk' && highRiskBatches.length > 0 ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'
              }`}>
                {m.trend}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground leading-none">{m.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ Quick Access Modules ═══ */}
      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            Quick Access
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <motion.button
              key={link.title}
              onClick={() => navigate(link.path)}
              className={`relative group rounded-2xl p-4 bg-white border border-border/60 hover-lift text-left overflow-hidden`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-md ${link.shadow} mb-3`}>
                <link.icon size={18} className="text-white" />
              </div>
              <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</p>
              <ArrowUpRight size={14} className="absolute top-3 right-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Batch Overview ═══ */}
      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold flex items-center gap-2">
            <Package size={18} className="text-emerald-600" />
            Batch Overview
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {displayBatches.length} batches{filteredBatchId ? ' (filtered)' : ''}
            </span>
          </h2>
          <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <Eye size={14} /> View All
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {displayBatches.length > 0 ? displayBatches.slice(0, 6).map((batch, i) => (
            <motion.div
              key={batch.id}
              variants={fadeUp} custom={i + 7} initial="hidden" animate="visible"
              onClick={() => selectBatch?.(batch)}
              className="bg-white rounded-2xl border border-border/60 p-4 hover-lift cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    batch.riskLevel === 'High' ? 'bg-red-50' : batch.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'
                  }`}>
                    <Activity size={18} className={
                      batch.riskLevel === 'High' ? 'text-red-600' : batch.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                    } />
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {batch.cropName} – {batch.batchId}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{batch.currentLocation || 'Unknown'}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  batch.riskLevel === 'High' 
                    ? 'bg-red-100 text-red-700' 
                    : batch.riskLevel === 'Medium' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {batch.status === 'in_transit' ? '🚚 Transit' : '🧊 Stored'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold">{batch.temperature?.toFixed(1) || '0'}°</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Temp</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold">{batch.humidity || 0}%</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Humidity</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold">{batch.quantity || 0}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Qty (kg)</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground mb-1">
                  <span>Capacity</span>
                  <span>{batch.quantity ? Math.round((batch.quantity / 1000) * 100) : 0}%</span>
                </div>
                <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${batch.quantity ? Math.min(Math.round((batch.quantity / 1000) * 100), 100) : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      batch.riskLevel === 'High' ? 'bg-red-500' : batch.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No batches found</p>
              <p className="text-xs mt-1">Add your first batch to start monitoring</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══ Risk Alerts ═══ */}
      {highRiskBatches.length > 0 && (
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-heading font-bold text-red-600 flex items-center gap-2">
              <Shield size={18} />
              Risk Alerts
            </h2>
          </div>
          <div className="space-y-3">
            {highRiskBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => selectBatch?.(batch)}
              >
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={22} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-red-800 text-sm">
                    {batch.cropName} – {batch.batchId}
                  </p>
                  <p className="text-xs text-red-600/70 mt-0.5">
                    Temp: {batch.temperature}°C • Humidity: {batch.humidity}% • Risk: {batch.riskLevel}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-red-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Status Summary ═══ */}
      <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Storage */}
        <div className="bg-white rounded-2xl border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Snowflake size={16} className="text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Storage Units</h3>
              <p className="text-[11px] text-muted-foreground">{inStorageBatches.length} batches stored</p>
            </div>
          </div>
          <div className="space-y-2">
            {inStorageBatches.length > 0 ? inStorageBatches.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium">{b.cropName} – {b.batchId}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{b.temperature?.toFixed(1)}°C</span>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-4">No batches in storage</p>
            )}
          </div>
        </div>

        {/* Transit */}
        <div className="bg-white rounded-2xl border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Truck size={16} className="text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Active Shipments</h3>
              <p className="text-[11px] text-muted-foreground">{inTransitBatches.length} in transit</p>
            </div>
          </div>
          <div className="space-y-2">
            {inTransitBatches.length > 0 ? inTransitBatches.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Truck size={12} className="text-violet-500" />
                  <span className="text-xs font-medium">{b.cropName} – {b.batchId}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{b.currentLocation || '—'}</span>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-4">No active shipments</p>
            )}
          </div>
        </div>
      </motion.div>

      <AddBatchModal 
        isOpen={showAddBatchModal} 
        onClose={() => setShowAddBatchModal(false)} 
      />
    </div>
  )
}

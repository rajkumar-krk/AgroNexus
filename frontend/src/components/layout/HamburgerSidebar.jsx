import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useApp } from '../../context/AppContext'
import { useBatch } from '../../context/BatchContext'
import { AddBatchModal } from '../AddBatchModal'
import { 
  LayoutDashboard, Activity, Snowflake, MapPin, FlaskConical, QrCode,
  Bell, BarChart3, Clock, User, Package, ChevronDown, Plus, X,
  Store, Users, Sprout, Menu, Radio
} from 'lucide-react'

const coldChainItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/live-monitor', name: 'Live Monitor', icon: Radio },
  { path: '/dashboard/iot-monitoring', name: 'IoT Monitoring', icon: Activity },
  { path: '/dashboard/cold-storage', name: 'Cold Storage', icon: Snowflake },
  { path: '/dashboard/shipment-gps', name: 'Shipment GPS', icon: MapPin },
  { path: '/dashboard/spoilage-detection', name: 'Spoilage AI', icon: FlaskConical },
  { path: '/dashboard/traceability', name: 'Traceability', icon: QrCode },
  { path: '/dashboard/cloud-alerts', name: 'Cloud Alerts', icon: Bell },
  { path: '/dashboard/storage-analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/shelf-life', name: 'Shelf Life', icon: Clock },
]

const agriItems = [
  { path: '/dashboard/market', name: 'Marketplace', icon: Store },
  { path: '/dashboard/community', name: 'Kisan Connect', icon: Users },
  { path: '/dashboard/analytics', name: 'Farm Analytics', icon: BarChart3 },
  { path: '/dashboard/advisor', name: 'AI Crop Advisor', icon: Sprout },
]

export function HamburgerSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useApp()
  const { batches, selectedBatch, selectBatch } = useBatch()
  const [cropsExpanded, setCropsExpanded] = useState(false)
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)

  const isActive = (path) => {
    if (!path || !location?.pathname) return false
    if (path === '/dashboard') return location.pathname === path || location.pathname === '/'
    return location.pathname === path
  }

  const handleNav = (path) => {
    if (path && navigate) { navigate(path); toggleSidebar() }
  }

  const NavItem = ({ item }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    return (
      <motion.button
        onClick={() => handleNav(item.path)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
          active
            ? "gradient-primary text-white shadow-md shadow-emerald-500/15"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
        whileTap={{ scale: 0.97 }}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          active ? "bg-white/20" : "bg-muted/40"
        )}>
          <Icon size={16} />
        </div>
        <span className="text-[13px] font-medium">{item.name}</span>
      </motion.button>
    )
  }

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 left-0 h-full w-72 bg-white border-r border-border/60 shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-emerald-500/15">
                    <Sprout size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base">AgroNexus</h2>
                    <p className="text-[10px] text-muted-foreground">Cold Chain Platform</p>
                  </div>
                </div>
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-1 block">
                  Cold Chain
                </span>
                {coldChainItems.map((item) => <NavItem key={item.path} item={item} />)}

                <div className="pt-3 mt-2 border-t border-border/60">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-1 block">
                    Agriculture
                  </span>
                </div>
                {agriItems.map((item) => <NavItem key={item.path} item={item} />)}

                <div className="pt-3 mt-2 border-t border-border/60">
                  <NavItem item={{ path: '/dashboard/profile', name: 'Profile', icon: User }} />
                </div>

                {/* Batches */}
                <div className="pt-3 mt-2 border-t border-border/60">
                  <button
                    onClick={() => setCropsExpanded(!cropsExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
                        <Package size={16} />
                      </div>
                      <span className="text-[13px] font-medium text-muted-foreground">
                        Batches ({batches?.length || 0})
                      </span>
                    </div>
                    <motion.div animate={{ rotate: cropsExpanded ? 180 : 0 }}>
                      <ChevronDown size={14} className="text-muted-foreground" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {cropsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pt-1 pl-4">
                          {batches?.length > 0 ? batches.map((batch) => (
                            <button
                              key={batch.id}
                              onClick={() => { selectBatch?.(batch); handleNav('/dashboard') }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[12px]",
                                selectedBatch?.id === batch.id
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-muted-foreground hover:bg-muted/30"
                              )}
                            >
                              <div className={cn("w-2 h-2 rounded-full",
                                batch.riskLevel === 'High' ? 'bg-red-500' : batch.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                              )} />
                              <span className="truncate">{batch.cropName} – {batch.batchId}</span>
                            </button>
                          )) : (
                            <p className="px-3 py-2 text-[11px] text-muted-foreground/50">No batches</p>
                          )}
                          <button
                            onClick={() => { setShowAddBatchModal(true); setCropsExpanded(true) }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 text-[12px]"
                          >
                            <Plus size={12} /> <span className="font-medium">Add Batch</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/60 text-center">
                <p className="text-[10px] text-muted-foreground/50">AgroNexus v1.0.0</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {showAddBatchModal && (
        <AddBatchModal isOpen={showAddBatchModal} onClose={() => setShowAddBatchModal(false)} />
      )}
    </>
  )
}

export function HamburgerButton() {
  const { sidebarOpen, toggleSidebar } = useApp()
  return (
    <motion.button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
      aria-label="Toggle menu"
      whileTap={{ scale: 0.9 }}
    >
      <Menu size={20} />
    </motion.button>
  )
}

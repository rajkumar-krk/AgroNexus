import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useBatch } from '../../context/BatchContext'
import { AddBatchModal } from '../../components/AddBatchModal'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard,
  Activity,
  Snowflake,
  MapPin,
  FlaskConical,
  QrCode,
  Bell,
  BarChart3,
  Clock,
  Package,
  ChevronDown,
  ChevronRight,
  Plus,
  Store,
  Users,
  Sprout,
  User,
  Radio
} from 'lucide-react'

const navigationItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/live-monitor', name: 'Live Monitor', icon: Radio },
  { path: '/dashboard/iot-monitoring', name: 'IoT Monitoring', icon: Activity },
  { path: '/dashboard/cold-storage', name: 'Cold Storage', icon: Snowflake },
  { path: '/dashboard/shipment-gps', name: 'Shipment GPS', icon: MapPin },
  { path: '/dashboard/spoilage-detection', name: 'Spoilage AI', icon: FlaskConical },
  { path: '/dashboard/traceability', name: 'Traceability', icon: QrCode },
  { path: '/dashboard/cloud-alerts', name: 'Cloud Alerts', icon: Bell },
  { path: '/dashboard/shelf-life', name: 'Shelf Life', icon: Clock },
]

const agriItems = [
  { path: '/dashboard/market', name: 'Marketplace', icon: Store },
  { path: '/dashboard/community', name: 'Kisan Connect', icon: Users },
  { path: '/dashboard/analytics', name: 'Farm Analytics', icon: BarChart3 },
  { path: '/dashboard/advisor', name: 'AI Crop Advisor', icon: Sprout },
]

export function Sidebar({ className = '' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { batches, selectedBatch, selectBatch, addBatch } = useBatch()
  const [cropsExpanded, setCropsExpanded] = useState(false)
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)

  const isActive = (path) => {
    if (!path || !location?.pathname) return false
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/'
    }
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    if (path && navigate) navigate(path)
  }

  const handleCropClick = (batch) => {
    if (batch && selectBatch) {
      selectBatch(batch)
      handleNavigation('/dashboard')
    }
  }

  const NavItem = ({ item }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    return (
      <motion.button
        onClick={() => handleNavigation(item.path)}
        className={cn(
          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left group",
          active
            ? "gradient-primary text-white shadow-lg shadow-emerald-500/20"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
        whileHover={{ x: active ? 0 : 3 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
          active 
            ? "bg-white/20" 
            : "bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          <Icon size={16} />
        </div>
        <span className="text-[13px] font-medium truncate">{item.name}</span>
      </motion.button>
    )
  }

  return (
    <aside className={cn(
      "hidden lg:flex flex-col w-60 space-y-1 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-4",
      className
    )}>
      {/* Cold Chain Section */}
      <div className="mb-1">
        <span className="px-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
          Cold Chain
        </span>
      </div>
      {navigationItems.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      {/* Agriculture Section */}
      <div className="pt-4 mt-2 border-t border-border/60">
        <span className="px-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
          Agriculture
        </span>
      </div>
      {agriItems.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      {/* Profile */}
      <div className="pt-3 mt-2 border-t border-border/60">
        <NavItem item={{ path: '/dashboard/profile', name: 'Profile', icon: User }} />
      </div>

      {/* Crops/Batches */}
      <div className="pt-3 mt-1 border-t border-border/60">
        <button
          onClick={() => setCropsExpanded(!cropsExpanded)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Package size={16} />
            </div>
            <span className="text-[13px] font-medium">
              Batches ({batches?.length || 0})
            </span>
          </div>
          <motion.div animate={{ rotate: cropsExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: cropsExpanded ? 'auto' : 0, opacity: cropsExpanded ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="space-y-1 pt-1 pl-4">
            {batches && batches.length > 0 ? (
              batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => handleCropClick(batch)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-[12px]",
                    selectedBatch?.id === batch.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    batch.riskLevel === 'High' ? 'bg-red-500' : batch.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  )} />
                  <span className="truncate">{batch.cropName} – {batch.batchId}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-[11px] text-muted-foreground/60">No batches yet</p>
            )}

            <button
              onClick={() => { setShowAddBatchModal(true); setCropsExpanded(true) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-dashed border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all text-[12px]"
            >
              <Plus size={14} />
              <span className="font-medium">Add Batch</span>
            </button>
          </div>
        </motion.div>
      </div>

      {showAddBatchModal && (
        <AddBatchModal
          isOpen={showAddBatchModal}
          onClose={() => setShowAddBatchModal(false)}
        />
      )}
    </aside>
  )
}

import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useBatch } from '../../context/BatchContext'
import { AddBatchModal } from '../../components/AddBatchModal'
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
  Plus
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Activity,
  Snowflake,
  MapPin,
  FlaskConical,
  QrCode,
  Bell,
  BarChart3,
  Clock
}

const navigationItems = [
  { path: '/dashboard', name: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/dashboard/iot-monitoring', name: 'IoT Sensor Monitoring', icon: 'Activity' },
  { path: '/dashboard/cold-storage', name: 'Cold Storage Health', icon: 'Snowflake' },
  { path: '/dashboard/shipment-gps', name: 'Live Shipment GPS', icon: 'MapPin' },
  { path: '/dashboard/spoilage-detection', name: 'Spoilage Detection', icon: 'FlaskConical' },
  { path: '/dashboard/traceability', name: 'QR Crop Traceability', icon: 'QrCode' },
  { path: '/dashboard/cloud-alerts', name: 'Cloud Alerts & Logs', icon: 'Bell' },
  { path: '/dashboard/storage-analytics', name: 'Storage Analytics', icon: 'BarChart3' },
  { path: '/dashboard/shelf-life', name: 'Shelf Life Predictor', icon: 'Clock' }
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
    if (path && navigate) {
      navigate(path)
    }
  }

  const handleCropClick = (batch) => {
    if (batch && selectBatch) {
      selectBatch(batch)
      // Navigate to dashboard to show selected crop
      handleNavigation('/dashboard')
    }
  }

  const toggleCropsMenu = () => {
    setCropsExpanded(!cropsExpanded)
  }

  const handleAddBatch = () => {
    setShowAddBatchModal(true)
    setCropsExpanded(true) // Expand crops menu when adding new batch
  }

  return (
    <aside className={cn(
      "hidden lg:flex flex-col w-64 space-y-2 sticky top-24 h-fit",
      className
    )}>
      {/* Main Navigation */}
      {navigationItems && navigationItems.length > 0 ? navigationItems.map((item) => {
        if (!item || !item.path) return null
        
        const IconComponent = iconMap[item.icon]
        const active = isActive(item.path)
        
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-bold",
              active
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
            )}
          >
            {IconComponent && <IconComponent size={20} />}
            <span className="text-sm">{item.name || 'Unknown'}</span>
          </button>
        )
      }) : (
        <div className="text-center text-muted-foreground py-4">
          <p>No navigation items</p>
        </div>
      )}

      {/* Crops/Batches Section */}
      <div className="mt-4 pt-4 border-t border-border">
        {/* Crops Header */}
        <button
          onClick={toggleCropsMenu}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <Package size={20} />
            <span className="text-sm font-bold">
              Crops / Batches ({batches?.length || 0})
            </span>
          </div>
          {cropsExpanded ? (
            <ChevronDown size={16} className="transition-transform duration-200" />
          ) : (
            <ChevronRight size={16} className="transition-transform duration-200" />
          )}
        </button>

        {/* Crops List - Collapsible */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            cropsExpanded ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="space-y-1 pt-2">
            {batches && batches.length > 0 ? (
              batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => handleCropClick(batch)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200",
                    selectedBatch?.id === batch.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">
                    {batch.cropName} - {batch.batchId}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                <p>No batches available</p>
                <p className="text-xs mt-1">Add a new batch to begin</p>
              </div>
            )}

            {/* Add Batch Button */}
            <button
              onClick={handleAddBatch}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add New Batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <AddBatchModal
          isOpen={showAddBatchModal}
          onClose={() => setShowAddBatchModal(false)}
        />
      )}
    </aside>
  )
}

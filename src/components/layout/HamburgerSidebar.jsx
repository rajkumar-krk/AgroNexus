import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useApp } from '../../context/AppContext'
import { useBatch } from '../../context/BatchContext'
import { AddBatchModal } from '../AddBatchModal'
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
  User,
  Package,
  ChevronDown,
  ChevronRight,
  Plus,
  X
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
  Clock,
  User
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
  { path: '/dashboard/shelf-life', name: 'Shelf Life Predictor', icon: 'Clock' },
  { path: '/dashboard/profile', name: 'Profile', icon: 'User' }
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
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/'
    }
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    if (path && navigate) {
      navigate(path)
      toggleSidebar() // Close sidebar after navigation
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

  const handleOverlayClick = () => {
    toggleSidebar()
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
            className="fixed top-0 left-0 h-full w-72 bg-background border-r border-border shadow-xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Package size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">AgroNexus</h2>
                    <p className="text-xs text-muted-foreground">Cold Chain Platform</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navigationItems && navigationItems.length > 0 ? navigationItems.map((item) => {
                  if (!item || !item.path) return null
                  
                  const IconComponent = iconMap[item.icon]
                  const active = isActive(item.path)
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 text-left font-medium",
                        active
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {IconComponent && <IconComponent size={18} />}
                      <span className="text-sm">{item.name || 'Unknown'}</span>
                    </button>
                  )
                }) : (
                  <div className="text-center text-muted-foreground py-4">
                    <p>No navigation items</p>
                  </div>
                )}

                {/* Crops/Batches Section */}
                <div className="pt-4 border-t border-border mt-4">
                  {/* Crops Header */}
                  <button
                    onClick={toggleCropsMenu}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Package size={18} />
                      <span className="text-sm font-medium">
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
                  <AnimatePresence>
                    {cropsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pt-2 pl-6">
                          {batches && batches.length > 0 ? (
                            batches.map((batch) => (
                              <button
                                key={batch.id}
                                onClick={() => handleCropClick(batch)}
                                className={cn(
                                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
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
                            <div className="px-3 py-3 text-center text-muted-foreground text-sm">
                              <p>No batches available</p>
                              <p className="text-xs mt-1">Add a new batch to begin</p>
                            </div>
                          )}

                          {/* Add Batch Button */}
                          <button
                            onClick={handleAddBatch}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                          >
                            <Plus size={14} />
                            <span className="text-sm font-medium">Add New Batch</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <div className="text-center text-xs text-muted-foreground">
                  <p>Version 1.0.0</p>
                  <p className="mt-1">© 2024 AgroNexus</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <AddBatchModal
          isOpen={showAddBatchModal}
          onClose={() => setShowAddBatchModal(false)}
        />
      )}
    </>
  )
}

// Hamburger Menu Button Component
export function HamburgerButton() {
  const { sidebarOpen, toggleSidebar } = useApp()

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Toggle menu"
    >
      <motion.div
        animate={{ rotate: sidebarOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Package size={20} />
      </motion.div>
    </button>
  )
}

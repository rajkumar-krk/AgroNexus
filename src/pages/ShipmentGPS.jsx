import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { shipmentService } from '../services/shipmentService'
import { 
  SectionCard, 
  DeviceStatusCard, 
  AlertItem 
} from '../components/widgets'
import { 
  MapPin, 
  Truck, 
  Thermometer, 
  Droplets,
  Clock,
  Navigation
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function ShipmentGPS() {
  const [activeShipments, setActiveShipments] = useState([])
  const [shipmentHistory, setShipmentHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [active, history] = await Promise.all([
          shipmentService.getActiveShipments(),
          shipmentService.getShipmentHistory()
        ])
        
        setActiveShipments(active)
        setShipmentHistory(history)
      } catch (error) {
        console.error('Error fetching shipment data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Simulate real-time updates
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds
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
          title="Live Shipment GPS"
          subtitle="Real-time tracking of all active shipments"
          icon={MapPin}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <div className="h-64 bg-muted/20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center">
                <Navigation size={48} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Live GPS Map</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeShipments.length} active shipments
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck size={16} className="text-primary" />
                    <span className="text-sm font-medium">Active Shipments</span>
                  </div>
                  <p className="text-2xl font-bold">{activeShipments.length}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">Avg Temperature</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {activeShipments.length > 0 
                      ? (activeShipments.reduce((sum, s) => sum + s.temperature, 0) / activeShipments.length).toFixed(1)
                      : 0}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Active Shipments */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Active Shipments"
          subtitle={`${activeShipments.length} shipments in transit`}
          icon={Truck}
        >
          <div className="space-y-4">
            {activeShipments.map((shipment) => (
              <DeviceStatusCard
                key={shipment.id}
                device={{
                  ...shipment,
                  name: `${shipment.id} - ${shipment.origin} to ${shipment.destination}`,
                  id: shipment.id,
                  status: shipment.status === 'In Transit' ? 'online' : 'loading',
                  temperature: shipment.temperature,
                  humidity: shipment.humidity,
                  lastUpdate: shipment.lastUpdate
                }}
                onClick={() => console.log('Shipment clicked:', shipment.id)}
              />
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Shipment Alerts"
          subtitle="Recent alerts and notifications"
          icon={MapPin}
        >
          <div className="space-y-3">
            {activeShipments
              .filter(s => s.temperature > 5 || s.temperature < 2)
              .map((shipment) => ({
                id: `SHIP-ALERT-${shipment.id}`,
                type: shipment.temperature > 5 ? 'warning' : 'error',
                title: 'Temperature Alert',
                message: `Shipment ${shipment.id} temperature ${shipment.temperature}°C outside optimal range`,
                timestamp: new Date().toISOString(),
                deviceId: shipment.id,
                acknowledged: false,
                resolved: false
              }))
              .map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={(id) => console.log('Acknowledge alert:', id)}
                  onResolve={(id) => console.log('Resolve alert:', id)}
                />
              ))}
            
            {activeShipments.filter(s => s.temperature > 5 || s.temperature < 2).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>No temperature alerts</p>
                <p className="text-sm">All shipments within optimal temperature range</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}

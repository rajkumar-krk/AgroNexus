import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { BatchFilter } from '../components/BatchFilter';
import { api } from '../lib/api';
import { 
  MapPin, Navigation, Truck, Clock, AlertTriangle, Route, Thermometer, Battery
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function ShipmentGPS() {
  const { batches, selectedBatch } = useBatch();
  const [filteredBatchId, setFilteredBatchId] = useState<string | null>(selectedBatch?.id || null);
  const [shipment, setShipment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeBatch = batches.find(b => b.id === filteredBatchId) || selectedBatch || batches[0];

  useEffect(() => {
    if (!activeBatch?.id) return;
    
    let isMounted = true;
    const fetchShipment = async () => {
      setIsLoading(true);
      try {
        const response = await api.getBatchShipment(activeBatch.id);
        if (isMounted && response.success) {
          setShipment(response.data);
        }
      } catch (err) {
        console.error('Failed to load shipment data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchShipment();
    
    // Simulate live truck movement
    const movementInterval = setInterval(() => {
      setShipment(prev => {
        if (!prev) return prev;
        // Jiggle the lat/lng slightly to mock live GPS tracking
        return {
          ...prev,
          currentLocation: {
            lat: prev.currentLocation.lat + (Math.random() - 0.5) * 0.005,
            lng: prev.currentLocation.lng + (Math.random() - 0.5) * 0.005
          }
        };
      });
    }, 5000);

    return () => { 
      isMounted = false; 
      clearInterval(movementInterval);
    };
  }, [activeBatch?.id]);

  if (!batches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Navigation size={48} className="text-blue-500/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No shipments active</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Live Sattelite Tracking</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Logistics & GPS</h1>
            <p className="text-blue-200 text-sm mt-1">Real-time convoy telemetry and ETA processing</p>
          </div>
          
          <div className="flex gap-2">
            <BatchFilter selectedBatch={filteredBatchId} onBatchChange={setFilteredBatchId} />
          </div>
        </div>
      </motion.div>

      {shipment && !isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map UI (Mocked) */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-2 relative overflow-hidden h-full min-h-[400px]">
              {/* Fake Map Background */}
              <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 opacity-80" 
                   style={{ backgroundImage: `radial-gradient(hsl(var(--foreground)/0.1) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
              </div>
              
              {/* Fake Road Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                 <path d="M 0,100 Q 150,300 300,150 T 800,200" stroke="hsl(var(--blue-500) / 0.3)" strokeWidth="6" strokeDasharray="10 10" fill="none" className="animate-[dash_60s_linear_infinite]" />
              </svg>

              {/* Truck Marker pinned to center structurally, but mathematically updating */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-border/50 text-xs font-bold flex items-center gap-1.5 mb-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {Math.round(shipment.currentLocation.lat * 1000) / 1000}, {Math.round(shipment.currentLocation.lng * 1000) / 1000}
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 border-4 border-white text-white">
                  <Truck size={20} fill="currentColor" />
                </div>
              </div>

              {/* Overlay HUD */}
              <div className="absolute top-4 left-4 p-4 glass-card rounded-2xl max-w-[240px] shadow-2xl">
                <h3 className="font-bold text-sm mb-1">{shipment.shipmentId}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Status: {shipment.status}</p>
                
                <div className="space-y-3">
                  <div>
                     <p className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1"><MapPin size={10}/> Origin</p>
                     <p className="text-sm font-medium">{shipment.origin}</p>
                  </div>
                  <div>
                     <p className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1 mt-1"><Route size={10}/> Destination</p>
                     <p className="text-sm font-medium text-emerald-600">{shipment.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Telemetry Panel */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="space-y-4">
            
            <div className="glass-card rounded-2xl p-5 border-t-4 border-t-blue-500">
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Clock size={16} className="text-blue-500"/> Transit Timing
               </h3>
               <div className="bg-muted/30 rounded-xl p-4 flex flex-col gap-1">
                 <p className="text-xs text-muted-foreground">Estimated Arrival (ETA)</p>
                 <p className="text-xl font-extrabold">{new Date(shipment.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 <p className="text-sm font-medium text-blue-600">{new Date(shipment.estimatedArrival).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Truck size={16}/> Vehicle Telemetry
               </h3>
               
               <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Thermometer size={14}/> Reef Temp
                   </div>
                   <span className={`font-mono font-bold ${activeBatch.temperature > 8 ? 'text-rose-500' : 'text-emerald-500'}`}>
                     {activeBatch.temperature.toFixed(1)}°C
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Battery size={14}/> Sensors
                   </div>
                   <span className="font-mono font-bold text-emerald-500">
                     94%
                   </span>
                 </div>

                 {shipment.temperatureAlerts > 0 && (
                   <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold">
                     <AlertTriangle size={14}/> {shipment.temperatureAlerts} Spoilage Warning(s) Logged!
                   </div>
                 )}
               </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Driver Info</h3>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                   {shipment.driverName.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-sm">{shipment.driverName}</p>
                   <p className="text-xs text-muted-foreground">{shipment.vehicleId}</p>
                 </div>
               </div>
            </div>

          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
           <Navigation size={32} className="text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
}

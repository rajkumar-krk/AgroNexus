import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { 
  QrCode, MapPin, CheckCircle2, Thermometer, Droplets, ArrowRight, ShieldCheck, Truck, Warehouse
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function Traceability() {
  const { batches, selectedBatch, selectBatch } = useBatch();
  const [activeBatchId, setActiveBatchId] = useState<string | null>(selectedBatch?.id || null);

  const activeBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  if (!batches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <QrCode size={48} className="text-muted-foreground/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No batches available for tracing</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span className="text-teal-100 text-xs font-bold uppercase tracking-wider">Blockchain Verified</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Supply Chain Traceability</h1>
            <p className="text-emerald-200 text-sm mt-1">End-to-end transparent journey from origin to destination</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Selector */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Select Batch</h3>
            <div className="space-y-2">
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => setActiveBatchId(batch.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    activeBatchId === batch.id 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <p className="font-bold text-sm">{batch.cropName}</p>
                  <p className="text-xs opacity-70 font-mono tracking-wide mt-0.5">{batch.batchId}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
             {activeBatch ? (
               <>
                 <div className="bg-white p-2.5 rounded-xl shadow-sm mb-3">
                   <QRCodeSVG 
                     value={`${window.location.origin}/trace/${activeBatch.id}`} 
                     size={160} 
                     level="H" 
                     className="text-emerald-900"
                   />
                 </div>
                 <p className="font-bold text-sm">Consumer QR Code</p>
                 <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
                   Print this QR for packing. Consumers scan it to view live freshness and GPS tracking.
                 </p>
                 <a 
                   href={`/trace/${activeBatch.id}`}
                   target="_blank"
                   rel="noreferrer"
                   className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                 >
                   Open Consumer Portal <ArrowRight size={14} />
                 </a>
               </>
             ) : (
               <>
                 <QrCode size={48} className="text-emerald-600 mb-3 opacity-50" />
                 <p className="font-bold text-sm">No Batch Selected</p>
               </>
             )}
          </div>
        </motion.div>

        {/* Traceability Timeline */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="lg:col-span-3">
          {activeBatch ? (
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 border-b border-border/50 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold">{activeBatch.cropName}</h2>
                  <p className="text-sm text-emerald-600 font-mono tracking-wide mt-1">{activeBatch.batchId} • {activeBatch.quantity} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-bold ${
                    activeBatch.status === 'In Transit' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {activeBatch.status === 'In Transit' ? <Truck size={12}/> : <Warehouse size={12}/>}
                    {activeBatch.status}
                  </span>
                </div>
              </div>

              {/* Enhanced Timeline */}
              <div className="relative pl-4 sm:pl-8 py-2">
                {/* Connecting Line */}
                <div className="absolute left-[27px] sm:left-[43px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-400 to-border"></div>

                {/* Node 1: Origin/Harvest */}
                <div className="relative mb-10 flex items-start group">
                  <div className="absolute -left-3 sm:-left-3 mt-1.5 w-6 h-6 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="ml-8 sm:ml-12 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">Harvest & Registration</h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-mono">
                        {new Date(activeBatch.harvestDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-muted/10 border border-border/50 rounded-xl p-4 mt-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Origin</p>
                          <p className="text-sm font-medium">{activeBatch.origin}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Initial Qty</p>
                          <p className="text-sm font-medium">{activeBatch.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Quality Check</p>
                          <p className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14}/> Passed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 2: Primary Cold Storage */}
                <div className="relative mb-10 flex items-start group">
                  <div className="absolute -left-3 sm:-left-3 mt-1.5 w-6 h-6 rounded-full bg-teal-100 border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  </div>
                  <div className="ml-8 sm:ml-12 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">Primary Cold Storage</h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-mono">
                        Logged
                      </span>
                    </div>
                    <div className="bg-muted/10 border border-border/50 rounded-xl p-4 mt-2">
                      <p className="text-sm font-medium mb-3">{activeBatch.storageUnit || 'Main Facility'}</p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Thermometer size={16} className="text-blue-500"/>
                          <span className="font-mono">{activeBatch.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Droplets size={16} className="text-teal-500"/>
                          <span className="font-mono">{Math.round(activeBatch.humidity)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 3: Current Status */}
                <div className="relative flex items-start group">
                  <div className="absolute -left-3 sm:-left-3 mt-1.5 w-6 h-6 rounded-full bg-indigo-100 border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 relative"></div>
                  </div>
                  <div className="ml-8 sm:ml-12 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">Destination Transit</h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider">
                        Active Phase
                      </span>
                    </div>
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mt-2">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Current Location</p>
                          <p className="text-sm font-medium flex items-center gap-1.5 text-indigo-900">
                            <MapPin size={14} className="text-indigo-500"/> {activeBatch.currentLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Target Destination</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <ArrowRight size={14} className="text-muted-foreground"/> {activeBatch.destination || 'Pending Market Routing'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

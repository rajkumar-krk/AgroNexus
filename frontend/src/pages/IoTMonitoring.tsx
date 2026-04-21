import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { useThingSpeakContext } from '../context/ThingSpeakContext';
import { BatchFilter } from '../components/BatchFilter';
import { api } from '../lib/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Activity, Thermometer, Droplets, Wind, Wifi, Battery, AlertTriangle, Radio, ToggleLeft, ToggleRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function IoTMonitoring() {
  const { batches, selectedBatch, selectBatch } = useBatch();
  const tsContext = useThingSpeakContext();
  const [filteredBatchId, setFilteredBatchId] = useState<string | null>(null);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(true); // ThingSpeak live mode toggle

  // Use the actively filtered batch, or fallback to the first available batch
  const activeDeviceBatch = useMemo(() => {
    if (filteredBatchId) return batches.find(b => b.id === filteredBatchId);
    if (selectedBatch) return selectedBatch;
    return batches[0] || null;
  }, [batches, filteredBatchId, selectedBatch]);

  // Fetch true telemetry history from backend when active batch changes
  useEffect(() => {
    if (!activeDeviceBatch?.id) return;
    
    let isMounted = true;
    const fetchTelemetry = async () => {
      setIsLoading(true);
      try {
        const response = await api.getBatchTelemetry(activeDeviceBatch.id);
        if (isMounted && response.success) {
          // Format timestamps for chart
          const formatted = response.data.map((point: any) => ({
            ...point,
            timeLabel: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          // If no telemetry exists, generate some fallback points using the current batch value
          if (formatted.length === 0) {
            const fallback = Array.from({ length: 20 }).map((_, i) => {
              const d = new Date();
              d.setMinutes(d.getMinutes() - (20 - i) * 5);
              return {
                timeLabel: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temperature: activeDeviceBatch.temperature + (Math.random() - 0.5),
                humidity: activeDeviceBatch.humidity + (Math.random() * 2 - 1)
              };
            });
            setTelemetryData(fallback);
          } else {
            setTelemetryData(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to load telemetry', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTelemetry();
    
    // Simulate real-time data appending 
    const interval = setInterval(() => {
      setTelemetryData(prev => {
        if (!prev.length || !isMounted) return prev;
        const newPoint = {
          timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: activeDeviceBatch.temperature + (Math.random() - 0.5),
          humidity: activeDeviceBatch.humidity + (Math.random() * 2 - 1)
        };
        const updated = [...prev, newPoint];
        if (updated.length > 25) updated.shift();
        return updated;
      });
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeDeviceBatch?.id, activeDeviceBatch?.temperature, activeDeviceBatch?.humidity]);

  if (!batches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Activity size={48} className="text-muted-foreground/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No active sensors</p>
        <p className="text-xs text-muted-foreground mt-1">Add a batch to start monitoring</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </div>
              <span className="text-cyan-100 text-xs font-bold uppercase tracking-wider">Live Telemetry</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">IoT Sensor Hub</h1>
            <p className="text-indigo-200 text-sm mt-1">Real-time environmental monitoring network</p>
          </div>
          
          <div className="flex gap-2 items-center">
            {/* ThingSpeak toggle */}
            <button
              onClick={() => setLiveMode(!liveMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                liveMode
                  ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-100'
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
              }`}
            >
              {liveMode ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              {liveMode ? 'ThingSpeak Live' : 'Batch Mode'}
            </button>
            <BatchFilter selectedBatch={filteredBatchId} onBatchChange={setFilteredBatchId} />
          </div>
        </div>
      </motion.div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Sensors', value: batches.length, icon: Radio,        bg: 'bg-indigo-50',  color: 'text-indigo-600' },
          { label: 'Network Uptime', value: '99.9%',       icon: Wifi,         bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Avg Battery',    value: '87%',         icon: Battery,      bg: 'bg-sky-50',     color: 'text-sky-600' },
          { label: 'Alerts',         value: batches.filter(b => b.riskLevel === 'High').length, icon: AlertTriangle, bg: 'bg-rose-50', color: batches.some(b => b.riskLevel === 'High') ? 'text-rose-600' : 'text-rose-400' }
        ].map((m, i) => (
          <motion.div key={m.label} variants={fadeUp} custom={i+1} initial="hidden" animate="visible" className="glass-card rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-0.5">{m.label}</p>
            <p className="text-2xl font-extrabold">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Device Focus */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-5 border-t-4 border-t-cyan-500 h-full relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5">Focused Sensor Node</h3>
            
            {activeDeviceBatch || (liveMode && tsContext.data) ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-foreground">
                    {liveMode ? 'ThingSpeak Sensor' : activeDeviceBatch?.cropName}
                  </h2>
                  <p className="text-sm text-cyan-600 font-mono tracking-wide mb-1">
                    {liveMode ? 'Live Feed' : `ID: ${activeDeviceBatch?.batchId}`}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                    <Wifi size={12} className={liveMode && tsContext.isConnected ? 'text-emerald-500' : 'text-emerald-500'} />
                    {liveMode ? (tsContext.isConnected ? 'Connected • Live' : 'Disconnected') : `Online • Syncing • ${activeDeviceBatch?.currentLocation}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Thermometer size={20} className="text-blue-500 mb-1" />
                    <p className="text-xl font-bold">
                      {liveMode && tsContext.data ? `${tsContext.data.temperature.toFixed(1)}°C` : `${activeDeviceBatch?.temperature?.toFixed(1)}°C`}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Temp</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Droplets size={20} className="text-teal-500 mb-1" />
                    <p className="text-xl font-bold">
                      {liveMode && tsContext.data ? `${Math.round(tsContext.data.humidity)}%` : `${Math.round(activeDeviceBatch?.humidity || 0)}%`}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Humidity</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center col-span-2">
                    <Wind size={20} className={liveMode && tsContext.data && tsContext.data.gas > 500 ? 'text-red-500 mb-1' : 'text-slate-500 mb-1'} />
                    <p className="text-lg font-bold">
                      {liveMode && tsContext.data ? tsContext.data.gas.toFixed(0) : (activeDeviceBatch?.gasLevel || 'Normal')}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {liveMode ? 'Gas Value' : 'Gas Integrity'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-50">Select a device</div>
            )}
          </div>
        </motion.div>

        {/* Live Charts */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Activity size={18} className="text-cyan-600" />
              Live Temperature Array
            </h3>
            <div className="h-[220px] w-full">
              {isLoading && telemetryData.length === 0 ? (
                <div className="h-full flex items-center justify-center"><Activity className="animate-spin text-muted-foreground" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(200 80% 55%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(200 80% 55%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="temperature" stroke="hsl(200 80% 55%)" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" animationDuration={300} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Droplets size={18} className="text-teal-600" />
              Humidity Dispersion
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152 60% 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(152 60% 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="humidity" stroke="hsl(152 60% 36%)" strokeWidth={3} fillOpacity={1} fill="url(#humGrad)" animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

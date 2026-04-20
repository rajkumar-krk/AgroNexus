import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { BatchFilter } from '../components/BatchFilter';
import { 
  Snowflake, Thermometer, Droplets, Zap, TrendingUp, AlertTriangle, Wind
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function ColdStorage() {
  const { batches, selectedBatch } = useBatch();
  const [filteredBatchId, setFilteredBatchId] = useState<string | null>(selectedBatch?.id || null);

  const inStorageBatches = batches.filter(batch => batch.status === 'In Storage');
  const displayBatches = filteredBatchId 
    ? inStorageBatches.filter(b => b.id === filteredBatchId) 
    : inStorageBatches;

  const metrics = useMemo(() => {
    if (!displayBatches.length) return { avgTemp: 0, avgHum: 0, optimal: 0, warning: 0 };
    
    let sumTemp = 0, sumHum = 0, opt = 0, warn = 0;
    displayBatches.forEach(b => {
      sumTemp += b.temperature;
      sumHum += b.humidity;
      if (b.riskLevel === 'High' || b.riskLevel === 'Medium') warn++;
      else opt++;
    });

    return {
      avgTemp: sumTemp / displayBatches.length,
      avgHum: sumHum / displayBatches.length,
      optimal: opt,
      warning: warn
    };
  }, [displayBatches]);

  // Generate fake historical trend for UI feel
  const trendData = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    temp: metrics.avgTemp + (Math.sin(i / 2) * 2), // Sine wave variance
    humidity: metrics.avgHum + (Math.cos(i / 2) * 5)
  })), [metrics.avgTemp, metrics.avgHum]);

  if (!inStorageBatches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Snowflake size={48} className="text-cyan-500/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No active units in Cold Storage</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Snowflake size={16} className="text-cyan-400 animate-spin-slow" />
              <span className="text-cyan-100 text-xs font-bold uppercase tracking-wider">Unit Monitoring</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Cold Storage Health</h1>
            <p className="text-cyan-200 text-sm mt-1">Real-time thermal monitoring of inventory hold</p>
          </div>
          
          <div className="flex gap-2">
            <BatchFilter selectedBatch={filteredBatchId} onBatchChange={setFilteredBatchId} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Facilities', value: displayBatches.length, icon: Snowflake, bg: 'bg-cyan-50', color: 'text-cyan-600' },
          { label: 'Avg Temperature', value: `${metrics.avgTemp.toFixed(1)}°C`, icon: Thermometer, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Avg Humidity', value: `${metrics.avgHum.toFixed(0)}%`, icon: Droplets, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Warning Status', value: metrics.warning, icon: AlertTriangle, bg: 'bg-rose-50', color: metrics.warning > 0 ? 'text-rose-600' : 'text-rose-400' }
        ].map((m, i) => (
          <motion.div key={m.label} variants={fadeUp} custom={i+1} initial="hidden" animate="visible" className="glass-card rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{m.label}</p>
            <p className="text-2xl font-extrabold">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Units */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-heading font-bold px-2">Storage Node Status</h3>
          {displayBatches.map(batch => (
            <div key={batch.id} className="glass-card rounded-2xl p-4 border-l-4 border-cyan-500 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold">{batch.storageUnit || 'Main Hub'}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{batch.batchId} • {batch.cropName}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${batch.riskLevel === 'High' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="bg-muted/30 p-2 rounded-lg text-center">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Temp</p>
                   <p className={`text-sm font-bold ${batch.temperature > 8 ? 'text-rose-500' : ''}`}>{batch.temperature.toFixed(1)}°C</p>
                 </div>
                 <div className="bg-muted/30 p-2 rounded-lg text-center">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Humidity</p>
                   <p className="text-sm font-bold">{Math.round(batch.humidity)}%</p>
                 </div>
                 <div className="bg-muted/30 p-2 rounded-lg text-center">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Gas Env</p>
                   <p className={`text-sm font-bold ${batch.gasLevel === 'Elevated' ? 'text-amber-500' : ''}`}>{batch.gasLevel}</p>
                 </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Temperature History Chart */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              24H Thermal Signature (Aggregated)
            </h3>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="hsl(199 89% 48%)" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" animationDuration={500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

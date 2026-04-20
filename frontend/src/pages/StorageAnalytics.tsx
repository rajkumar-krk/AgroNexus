import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, Cell 
} from 'recharts';
import { 
  BarChart3, TrendingUp, Zap, Activity, Thermometer, Box, ArrowUpRight, ArrowDownRight, Factory
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function StorageAnalytics() {
  const { batches } = useBatch();

  const analytics = useMemo(() => {
    // Group batches by their storage unit
    const storageMap: { [key: string]: { totalQty: number, activeBatches: number, tempSum: number } } = {};
    let totalQuantity = 0;
    
    batches.forEach(b => {
      if (b.status !== 'In Storage') return;
      
      const unit = b.storageUnit || 'Main Facility';
      if (!storageMap[unit]) storageMap[unit] = { totalQty: 0, activeBatches: 0, tempSum: 0 };
      
      storageMap[unit].totalQty += b.quantity;
      storageMap[unit].activeBatches += 1;
      storageMap[unit].tempSum += b.temperature;
      totalQuantity += b.quantity;
    });

    const units = Object.keys(storageMap).map(name => ({
      name,
      value: storageMap[name].totalQty,
      avgTemp: storageMap[name].tempSum / storageMap[name].activeBatches,
      count: storageMap[name].activeBatches
    }));

    // Mock total capacity across all units combining to 10,000kg
    const SYSTEM_CAPACITY = 10000;
    const utilization = Math.min(100, Math.round((totalQuantity / SYSTEM_CAPACITY) * 100));

    // Fake Energy trend data
    const energyData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        kwh: 450 + Math.random() * 100 - (utilization > 50 ? 50 : 0) // Lower utilization = more energy wasted per kg
      };
    });

    return { units, totalQuantity, utilization, energyData };
  }, [batches]);

  const COLORS = ['hsl(215 90% 60%)', 'hsl(280 80% 60%)', 'hsl(320 80% 60%)', 'hsl(30 90% 60%)', 'hsl(150 80% 40%)'];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Factory size={16} className="text-purple-400" />
              <span className="text-purple-100 text-xs font-bold uppercase tracking-wider">Facility Level</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Storage Analytics</h1>
            <p className="text-indigo-200 text-sm mt-1">Capacity utilization and energy performance</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Network Capacity', value: `${analytics.utilization}%`, icon: Activity, bg: 'bg-emerald-50', color: 'text-emerald-600', sub: 'Optimal loading' },
          { label: 'Total Inventory', value: `${analytics.totalQuantity} kg`, icon: Box, bg: 'bg-indigo-50', color: 'text-indigo-600', sub: 'Across all units' },
          { label: 'Active Facilities', value: analytics.units.length, icon: Factory, bg: 'bg-orange-50', color: 'text-orange-600', sub: 'Online & reporting' },
          { label: 'Avg Energy/Day', value: '482 kWh', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600', sub: '-12% vs last week' }
        ].map((m, i) => (
          <motion.div key={m.label} variants={fadeUp} custom={i+1} initial="hidden" animate="visible" className="glass-card rounded-2xl p-4 relative overflow-hidden group">
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-50 ${m.bg.replace('bg-', 'bg-').replace('50', '300')}`}></div>
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3 relative z-10`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{m.label}</p>
            <p className="text-2xl font-extrabold">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Treemap */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                <Box size={18} className="text-indigo-600" />
                Facility Utilization Matrix
              </h3>
            </div>
            
            <div className="flex-1 min-h-[250px] w-full">
              {analytics.units.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={analytics.units}
                    dataKey="value"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {analytics.units.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border p-3 rounded-xl shadow-xl">
                              <p className="font-bold mb-1">{data.name}</p>
                              <p className="text-sm">Load: <span className="font-mono font-bold text-indigo-600">{data.value} kg</span></p>
                              <p className="text-sm">Avg Temp: <span className="font-mono font-bold">{data.avgTemp.toFixed(1)}°C</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No active storage data</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Energy Consumption Bar Chart */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
          <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
             <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Energy draw (kWh)
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowDownRight size={14}/> 12% Eff. Gain
              </span>
            </div>

            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="kwh" fill="hsl(38 92% 55%)" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Smart Recommendations */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-emerald-600" />
              AI System Optimization
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Box size={14} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 mb-1">Consolidate Half-Empty Units</h4>
                  <p className="text-xs text-indigo-700/70 leading-relaxed">
                    Units <span className="font-mono font-bold">CS-002</span> and <span className="font-mono font-bold">CS-003</span> are running at &lt;40% capacity. Consolidating batches could save 18% in daily energy consumption.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Thermometer size={14} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 mb-1">Pre-Cooling Shift</h4>
                  <p className="text-xs text-emerald-700/70 leading-relaxed">
                    Shift primary compressor cycles to off-peak hours (11 PM - 5 AM). The current thermal mass of your inventory will maintain optimal temps during peak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

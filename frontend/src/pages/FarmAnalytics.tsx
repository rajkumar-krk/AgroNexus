import React from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { BarChart3, LineChart, PieChart, TrendingUp, Package, Sprout, Wind, Droplets } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function FarmAnalytics() {
  const { batches, stats } = useBatch();

  const totalYield = batches?.reduce((acc: number, b: any) => acc + (Number(b.quantity) || 0), 0) || 0;
  const activeBatches = batches?.filter(b => b.status === 'In Storage' || b.status === 'In Transit').length || 0;

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
              <BarChart3 size={16} className="text-teal-400" />
              <span className="text-teal-100 text-xs font-bold uppercase tracking-wider">Farm Statistics</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Farm Analytics</h1>
            <p className="text-emerald-200 text-sm mt-1">Holistic view of your crop yield, distribution, and seasonal performance.</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-start mb-2">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Yield YTD</p>
               <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Sprout size={16}/></div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">{totalYield.toLocaleString()} kg</h3>
            <p className="text-[10px] uppercase font-bold text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +14% vs Last Year</p>
         </div>

         <div className="glass-card rounded-2xl p-5 border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-start mb-2">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Batches</p>
               <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Package size={16}/></div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">{activeBatches}</h3>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mt-2">Currently being tracked</p>
         </div>

         <div className="glass-card rounded-2xl p-5 border-l-4 border-l-teal-500">
            <div className="flex justify-between items-start mb-2">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Moisture</p>
               <div className="p-2 rounded-lg bg-teal-50 text-teal-600"><Droplets size={16}/></div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">42%</h3>
            <p className="text-[10px] uppercase font-bold text-emerald-600 mt-2">Optimal range</p>
         </div>
         
         <div className="glass-card rounded-2xl p-5 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start mb-2">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spoilage Risk</p>
               <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><Wind size={16}/></div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">Low</h3>
            <p className="text-[10px] uppercase font-bold text-emerald-600 mt-2 flex items-center gap-1">AI Verified</p>
         </div>
      </motion.div>

      {/* Visual Analytics */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Yield Visualization */}
         <div className="lg:col-span-2 glass-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-extrabold text-lg flex items-center gap-2">
                 <LineChart className="text-indigo-500" /> Yield Trends (Last 6 Months)
               </h3>
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">Volume (kg)</span>
            </div>
            
            {/* Mock Chart representation using Flex blocks for UI showcase */}
            <div className="h-64 flex items-end justify-between gap-2 border-b border-border/50 pb-2 px-2">
               {[400, 600, 450, 800, 1200, 950].map((val, i) => (
                 <div key={i} className="w-full flex justify-center group relative">
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:opacity-80" 
                      style={{ height: `${(val / 1200) * 100}%` }}
                    ></div>
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}kg
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between px-4 mt-3 text-xs font-bold text-muted-foreground uppercase">
               <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
         </div>

         {/* Crop Distribution */}
         <div className="glass-card rounded-3xl p-6">
            <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
              <PieChart className="text-emerald-500" /> Crop Split
            </h3>
            
            <div className="flex justify-center my-6">
               <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                     <circle r="25" cx="50" cy="50" fill="transparent" stroke="#f1f5f9" strokeWidth="50" />
                     {/* Tomatoes - 40% */}
                     <circle r="25" cx="50" cy="50" fill="transparent" stroke="#10b981" strokeWidth="50" strokeDasharray="157" strokeDashoffset="94" className="transition-all hover:opacity-80" />
                     {/* Potatoes - 35% */}
                     <circle r="25" cx="50" cy="50" fill="transparent" stroke="#0ea5e9" strokeWidth="50" strokeDasharray="157" strokeDashoffset="149" className="transition-all hover:opacity-80 transform rotate-[144deg] origin-center" />
                     {/* Apples - 25% */}
                     <circle r="25" cx="50" cy="50" fill="transparent" stroke="#f59e0b" strokeWidth="50" strokeDasharray="157" strokeDashoffset="165" className="transition-all hover:opacity-80 transform rotate-[270deg] origin-center" />
                  </svg>
               </div>
            </div>

            <div className="space-y-3 mt-8">
               <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span className="font-semibold">Tomatoes</span></div>
                  <span className="font-bold text-muted-foreground">40%</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-500"></div> <span className="font-semibold">Potatoes</span></div>
                  <span className="font-bold text-muted-foreground">35%</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> <span className="font-semibold">Apples</span></div>
                  <span className="font-bold text-muted-foreground">25%</span>
               </div>
            </div>
         </div>
      </motion.div>
    </div>
  );
}

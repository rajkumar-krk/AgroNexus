import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { 
  Clock, Calendar, TrendingUp, AlertTriangle, ShieldCheck, Thermometer, Box, Leaf
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function ShelfLife() {
  const { batches } = useBatch();

  const analytics = useMemo(() => {
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let avgQuality = 0;

    const enrichedBatches = batches.map(batch => {
      // Logic for demo calculation
      const predictedShelfLife = batch.expectedShelfLife || 14;
      const remainingDays = batch.currentShelfLife !== undefined ? batch.currentShelfLife : predictedShelfLife;
      
      const qualityScore = Math.max(0, Math.round((remainingDays / predictedShelfLife) * 100));
      avgQuality += qualityScore;

      let risk = 'Low';
      if (batch.riskLevel === 'High' || remainingDays < 3) {
        risk = 'High';
        highRiskCount++;
      } else if (batch.riskLevel === 'Medium' || remainingDays < 7) {
         risk = 'Medium';
         mediumRiskCount++;
      } else {
         lowRiskCount++;
      }

      return {
        ...batch,
        predictedShelfLife,
        remainingDays,
        qualityScore,
        spoilageRisk: risk
      };
    }).sort((a, b) => a.remainingDays - b.remainingDays); // Sort by most urgent

    return {
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      avgQuality: batches.length ? Math.round(avgQuality / batches.length) : 0,
      enrichedBatches
    };
  }, [batches]);

  if (!batches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Clock size={48} className="text-emerald-500/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No inventory available for Shelf Life Analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-emerald-400" />
              <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Predictive Dynamics</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Shelf Life Forecaster</h1>
            <p className="text-green-200 text-sm mt-1">AI-powered longevity predictions & depletion schedules</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Batches', value: batches.length, icon: Box, bg: 'bg-emerald-50', color: 'text-emerald-600', sub: 'Actively tracked' },
          { label: 'Avg Quality Score', value: `${analytics.avgQuality}%`, icon: ShieldCheck, bg: 'bg-indigo-50', color: 'text-indigo-600', sub: 'Market readiness' },
          { label: 'High Risk (Expiring)', value: analytics.highRiskCount, icon: AlertTriangle, bg: 'bg-rose-50', color: 'text-rose-600', sub: '< 3 days remaining' },
          { label: 'Stable Inventory', value: analytics.lowRiskCount, icon: Clock, bg: 'bg-teal-50', color: 'text-teal-600', sub: 'Optimal longevity' }
        ].map((m, i) => (
          <motion.div key={m.label} variants={fadeUp} custom={i+1} initial="hidden" animate="visible" className="glass-card rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{m.label}</p>
            <p className="text-2xl font-extrabold">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{m.sub}</p>
          </motion.div>
        ))}
      </div>

       {/* Detailed Batch Breakdown */}
      <h3 className="text-xl font-heading font-bold mt-10 mb-4 px-2">Depletion Queue</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics.enrichedBatches.map((batch, i) => {
          const isHighRisk = batch.spoilageRisk === 'High';
          const isMediumRisk = batch.spoilageRisk === 'Medium';
          
          return (
            <motion.div 
              key={batch.id} variants={fadeUp} custom={i+2} initial="hidden" animate="visible" 
              className={`glass-card p-5 rounded-2xl relative overflow-hidden border-2 transition-all hover:shadow-lg ${
                isHighRisk ? 'border-rose-500/20 shadow-rose-500/5' : 
                isMediumRisk ? 'border-amber-500/20' : 'border-transparent'
              }`}
            >
              {isHighRisk && <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full blur-xl"></div>}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg">{batch.cropName}</h4>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{batch.batchId} • {batch.quantity} kg</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isHighRisk ? 'bg-rose-100 text-rose-700' : 
                  isMediumRisk ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {batch.spoilageRisk} Risk
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-muted-foreground">Lifespan Remaining</span>
                  <span className={isHighRisk ? 'text-rose-600' : 'text-emerald-600'}>
                    {batch.remainingDays} / {batch.predictedShelfLife} Days
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(5, batch.qualityScore)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 bg-muted/20 p-3 rounded-xl border border-border/50">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Harvested</p>
                  <p className="text-xs font-mono">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Storage Env</p>
                  <p className="text-xs font-mono flex items-center gap-1"><Thermometer size={12}/> {batch.temperature.toFixed(1)}°C</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Quality</p>
                  <p className="text-xs font-mono">{batch.qualityScore}%</p>
                </div>
              </div>

              {/* Dynamic Recommendation */}
              <div className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                <TrendingUp size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 font-medium">
                  {isHighRisk 
                    ? `Critical: Liquidate immediately. Quality decaying rapidly due to ${batch.temperature > 8 ? 'high temperatures' : 'extended age'}.`
                    : isMediumRisk 
                    ? 'Schedule for market distribution within next 48 hours to preserve premium value.'
                    : 'Optimal storage conditions. Can be held for strategic pricing advantage.'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

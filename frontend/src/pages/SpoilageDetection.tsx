import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBatch } from '../context/BatchContext';
import { useThingSpeakContext } from '../context/ThingSpeakContext';
import { BatchFilter } from '../components/BatchFilter';
import { api } from '../lib/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  FlaskConical, AlertTriangle, ShieldCheck, Thermometer, Clock, ArrowRight, Biohazard, ArrowDownToLine, Wind, Radio
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function SpoilageDetection() {
  const { batches, selectedBatch, selectBatch } = useBatch();
  const { data: tsData, history: tsHistory, spoilageRisk: tsSpoilageRisk } = useThingSpeakContext();
  const [filteredBatchId, setFilteredBatchId] = useState<string | null>(selectedBatch?.id || null);
  const [riskData, setRiskData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // The active batch to display details for
  const activeBatch = batches.find(b => b.id === filteredBatchId) || selectedBatch || batches[0];

  useEffect(() => {
    if (!activeBatch?.id) return;
    
    let isMounted = true;
    const fetchRisk = async () => {
      setIsLoading(true);
      try {
        const response = await api.getSpoilageRisk(activeBatch.id);
        if (isMounted && response.success) {
          setRiskData(response.data);
        }
      } catch (err) {
        console.error('Failed to load risk data', err);
        // Fallback for demo
        if (isMounted) {
          setRiskData({
            riskScore: activeBatch.riskLevel === 'High' ? 85 : activeBatch.riskLevel === 'Medium' ? 45 : 12,
            tempVariations: activeBatch.riskLevel === 'High' ? 14 : 2,
            ethyleneSpikes: activeBatch.riskLevel === 'High' ? 3 : 0,
            recommendation: activeBatch.riskLevel === 'High' ? "CRITICAL: Immediate cooling required." : "Conditions optimal.",
            estimatedDaysLost: activeBatch.riskLevel === 'High' ? 4 : 0
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRisk();
    return () => { isMounted = false; };
  }, [activeBatch?.id, activeBatch?.riskLevel]);

  if (!batches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FlaskConical size={48} className="text-amber-500/30 mb-4 animate-pulse" />
        <p className="text-muted-foreground font-medium">No batches available for AI analysis</p>
      </div>
    );
  }

  // Derive colors based on risk — prefer live ThingSpeak risk when available
  const effectiveRiskScore = tsData ? tsSpoilageRisk.score : (riskData?.riskScore || 0);
  const isHighRisk = effectiveRiskScore > 75;
  const isMediumRisk = effectiveRiskScore > 40 && effectiveRiskScore <= 75;
  const themeColor = isHighRisk ? 'rose' : isMediumRisk ? 'amber' : 'emerald';
  const themeHex = isHighRisk ? 'hsl(0 72% 55%)' : isMediumRisk ? 'hsl(38 92% 55%)' : 'hsl(152 60% 36%)';

  // Gas trend chart data from ThingSpeak
  const gasChartData = tsHistory.map((point: any) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    gas: point.gas,
    temperature: point.temperature,
  }));

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
             <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={16} className="text-amber-400" />
              <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">AI Powered</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Spoilage AI Detection</h1>
            <p className="text-amber-200 text-sm mt-1">Predictive analysis using sensor telemetry and ethylene levels</p>
          </div>
          
          <div className="flex gap-2">
            <BatchFilter selectedBatch={filteredBatchId} onBatchChange={setFilteredBatchId} />
          </div>
        </div>
      </motion.div>

      {activeBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Risk Gauge */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className={`glass-card rounded-3xl p-6 h-full border-t-4 ${
              isHighRisk ? 'border-t-rose-500' : isMediumRisk ? 'border-t-amber-500' : 'border-t-emerald-500'
            }`}>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-8 text-center border-b border-border/50 pb-4">
                Spoilage Risk Index
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-48"><FlaskConical className="animate-pulse text-muted-foreground" size={32} /></div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 flex items-center justify-center mt-2">
                    {/* Fake SVG Gauge Background */}
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                      <circle 
                        cx="50" cy="50" r="40" stroke={themeHex} strokeWidth="8" fill="transparent" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * (effectiveRiskScore || 0)) / 100}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-extrabold tracking-tighter ${
                        isHighRisk ? 'text-rose-600' : isMediumRisk ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {Math.round(effectiveRiskScore) || 0}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">out of 100</span>
                    </div>
                  </div>
                  
                  <div className={`mt-8 px-4 py-2 rounded-xl text-center w-full font-bold ${
                    isHighRisk ? 'bg-rose-50 text-rose-700' : isMediumRisk ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {tsData ? tsSpoilageRisk.level.toUpperCase() : (isHighRisk ? 'CRITICAL RISK' : isMediumRisk ? 'ELEVATED RISK' : 'OPTIMAL')}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Analysis Details */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6">
               <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold">{activeBatch.cropName}</h2>
                  <p className="text-sm text-amber-600/80 font-mono tracking-wide mt-1">Analysis for {activeBatch.batchId}</p>
                </div>
                {isHighRisk && (
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">
                     <AlertTriangle size={12}/> Needs Intervention
                   </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Thermometer size={16} className="mx-auto mb-2 text-rose-400" />
                  <p className="text-xl font-bold">{riskData?.tempVariations || 0}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold leading-tight mt-1">Temp<br/>Deviations</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Biohazard size={16} className="mx-auto mb-2 text-amber-500" />
                  <p className="text-xl font-bold">{riskData?.ethyleneSpikes || 0}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold leading-tight mt-1">Ethylene<br/>Spikes</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Clock size={16} className="mx-auto mb-2 text-sky-500" />
                  <p className="text-xl font-bold">{activeBatch.currentShelfLife}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold leading-tight mt-1">Current<br/>Shelf Life</p>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-center">
                  <ArrowDownToLine size={16} className="mx-auto mb-2 text-rose-500" />
                  <p className="text-xl font-bold text-rose-600">{riskData?.estimatedDaysLost || 0}</p>
                  <p className="text-[10px] uppercase text-rose-500 font-bold leading-tight mt-1">Est. Days<br/>Lost</p>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className={`p-4 rounded-xl border-l-4 ${
                isHighRisk ? 'bg-rose-50 border-rose-500' : isMediumRisk ? 'bg-amber-50 border-amber-500' : 'bg-emerald-50 border-emerald-500'
              }`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                  isHighRisk ? 'text-rose-700' : isMediumRisk ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  <ShieldCheck size={14} /> AI Recommendation
                </h4>
                <p className={`text-sm font-medium ${
                  isHighRisk ? 'text-rose-900' : isMediumRisk ? 'text-amber-900' : 'text-emerald-900'
                }`}>
                  {riskData?.recommendation || "System calibrating..."}
                </p>
                
                {isHighRisk && (
                  <button className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-rose-500/20">
                     Trigger Corrective Action <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ Gas Trend Chart (ThingSpeak) ═══ */}
      {gasChartData.length > 1 && (
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Wind size={18} className="text-amber-600" />
              Live Gas Trend
              <span className="text-xs font-normal text-muted-foreground ml-1">
                <Radio size={12} className="inline mr-1" />
                ThingSpeak — {gasChartData.length} points
              </span>
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gasChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sp-gasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38 92% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38 92% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 'dataMax + 50']} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="gas" stroke="hsl(38 92% 50%)" strokeWidth={2.5} fillOpacity={1} fill="url(#sp-gasGrad)" animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

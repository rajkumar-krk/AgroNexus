import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { batchService } from '../services/batchService';
import { LiveGPSMap } from '../components/LiveGPSMap';
import { 
  ShieldCheck, MapPin, Clock, Thermometer, Droplets, Wind, 
  Map, Activity, Truck, CheckCircle2, FlaskConical, AlertTriangle, Sprout
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function ConsumerTraceView() {
  const { batchId } = useParams<{ batchId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [batchData, setBatchData] = useState<any>(null);
  const [sensorData, setSensorData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [gpsHistory, setGpsHistory] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!batchId) throw new Error("No tracking ID provided");

        // Fetch fundamental batch data
        const batch = await batchService.getBatchById(batchId);
        if (!batch) throw new Error("Batch not found in system");
        
        if (isMounted) setBatchData(batch);

        // Fetch live metrics
        const [sensor, ai, gpsData] = await Promise.all([
          api.getSensorLive(batch.batchId).catch(() => null),
          api.getLatestAIInsight(batch.batchId).catch(() => null),
          api.getGPSHistory(100, batch.batchId).catch(() => null)
        ]);

        if (isMounted) {
          if (sensor && sensor.success !== false) setSensorData(sensor.data || sensor);
          if (ai && ai.success !== false) setAiInsight(ai.data || ai);
          if (gpsData && Array.isArray(gpsData)) setGpsHistory(gpsData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load trace data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Set up rapid polling since it's a live tracker
    const interval = setInterval(() => {
      if (batchData?.batchId) fetchData();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [batchId]);

  if (loading && !batchData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 relative mb-6">
           <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
           <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Tracking Shipment...</h2>
        <p className="text-sm text-slate-500 mt-2">Connecting to blockchain & live sensors</p>
      </div>
    );
  }

  if (error || !batchData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Invalid Tracking Code</h2>
        <p className="text-sm text-slate-500 mt-2">{error || "This QR code does not match any active deliveries."}</p>
      </div>
    );
  }

  // Derive values
  const freshnessScore = aiInsight?.riskScore ? (100 - aiInsight.riskScore) : 98;
  const isHealthy = freshnessScore > 60;
  
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800 selection:bg-emerald-200">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
             <Sprout size={16} className="text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-lg">AgroNexus Trace</span>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck size={12} /> Verified
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Product Hero */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{batchData.cropName}</h1>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">{batchData.batchId}</p>
        </motion.div>

        {/* Freshness AI Card */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-slate-100">
            <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-20 ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <FlaskConical size={14} className={isHealthy ? 'text-emerald-500' : 'text-rose-500'} /> 
                AI Freshness Report
              </div>
              <Activity size={14} className="text-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-end gap-3 mb-4">
              <span className={`text-6xl font-black tracking-tighter ${isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                {freshnessScore}
              </span>
              <span className="text-sm font-bold text-slate-400 mb-2">% FRESH</span>
            </div>

            <p className="text-sm font-medium text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {aiInsight?.recommendation || "Your crop is in pristine condition and was maintained at optimal ranges during the entire supply chain journey."}
            </p>
          </div>
        </motion.div>

        {/* Live Parameters Grid */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <Thermometer size={18} className="mx-auto mb-2 text-rose-500" />
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Temp</p>
            <p className="text-lg font-black text-slate-800">{sensorData?.temperature ? `${sensorData.temperature.toFixed(1)}°` : '--'}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <Droplets size={18} className="mx-auto mb-2 text-blue-500" />
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Humidity</p>
            <p className="text-lg font-black text-slate-800">{sensorData?.humidity ? `${Math.round(sensorData.humidity)}%` : '--'}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <Wind size={18} className="mx-auto mb-2 text-teal-500" />
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Gas / Air</p>
            <p className="text-lg font-black text-slate-800">{sensorData?.gas ? `${Math.round(sensorData.gas)}` : '--'}</p>
          </div>
        </motion.div>

        {/* Live Tracking Map */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Map size={18} className="text-indigo-500" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Live Location</h3>
          </div>
          
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 overflow-hidden h-[300px]">
            <LiveGPSMap
              lat={sensorData?.latitude || 17.3850}
              lon={sensorData?.longitude || 78.4867}
              coordHistory={gpsHistory}
              height="100%"
            />
          </div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Journey Timeline</h3>
           
           <div className="relative pl-6 space-y-8">
             <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 to-indigo-500 opacity-20"></div>
             
             <div className="relative">
               <div className="absolute -left-[30px] bg-emerald-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                 {new Date(batchData.harvestDate).toLocaleDateString()}
               </p>
               <h4 className="text-sm font-extrabold text-slate-800">Harvested</h4>
               <p className="text-sm font-medium text-slate-500">{batchData.origin || 'Registered Farm'}</p>
             </div>

             <div className="relative">
               <div className="absolute -left-[30px] bg-sky-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quality Check</p>
               <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  Verified Safe <CheckCircle2 size={14} className="text-sky-500"/>
               </h4>
               <p className="text-sm font-medium text-slate-500">AgroNexus Cold Hub</p>
             </div>

             <div className="relative">
               <div className="absolute -left-[30px] w-4 h-4 rounded-full border-4 border-white shadow-sm bg-indigo-500">
                  <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400"></span>
               </div>
               <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <Truck size={12} /> In Transit
               </p>
               <h4 className="text-sm font-extrabold text-slate-800">Out for Delivery</h4>
               <p className="text-sm font-medium text-slate-500">Tracking GPS via Blockchain</p>
             </div>
           </div>
        </motion.div>

        {/* Footer info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Powered by AgroNexus IoT</p>
        </div>
      </div>
    </div>
  );
}

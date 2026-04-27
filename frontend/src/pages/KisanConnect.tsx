import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Users, AlertCircle, Bug, MapPin, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function KisanConnect() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getPestReports();
      setReports(res.data || []);
    } catch (err) {
      toast.error('Failed to load community alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSeedReports = async () => {
    try {
      await toast.promise(api.seedPestReports(), {
        loading: 'Injecting community reports...',
        success: 'Test reports deployed!',
        error: 'Failed to inject reports'
      });
      fetchReports();
    } catch(e){}
  };

  const getSeverityBadge = (sv: string) => {
    switch(sv?.toLowerCase()) {
      case 'severe': return 'bg-rose-100 text-rose-700';
      case 'moderate': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-800 via-amber-700 to-orange-800 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-amber-400" />
              <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">Community Intelligence</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Kisan Connect</h1>
            <p className="text-amber-100 text-sm mt-1">Real-time pest radar and crop disease warnings from local farmers.</p>
          </div>
          <button className="px-5 py-2.5 bg-white text-orange-900 rounded-xl font-bold text-sm shadow-lg shadow-black/20 hover:scale-105 transition-transform flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-500" /> Report Outbreak
          </button>
        </div>
      </motion.div>

      {/* Trust Score & Radar */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 glass-card rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Bug className="text-rose-500" /> Regional Pest Radar
                </h3>
                {reports.length === 0 && (
                  <button onClick={handleSeedReports} className="text-xs px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-bold flex items-center gap-1.5 hover:bg-rose-100">
                    <Sparkles size={14}/> Seed Alerts
                  </button>
                )}
             </div>

             <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Scanning region...</p>
                ) : reports.length > 0 ? (
                  reports.map(report => (
                    <div key={report._id} className="relative bg-white/50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className={`p-2 rounded-lg ${getSeverityBadge(report.severity)}`}>
                               <ShieldAlert size={16} />
                             </div>
                             <div>
                               <h4 className="font-bold text-slate-800">{report.pestType || 'Unknown Outbreak'}</h4>
                               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Targeting: {report.cropAffected}</p>
                             </div>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(report.severity)}`}>
                             {report.severity}
                          </span>
                       </div>
                       <p className="text-sm text-slate-600 mt-3">{report.description || 'A localized outbreak has been reported. Take preventative measures immediately.'}</p>
                       <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} /> {report.location?.district || 'Regional Cluster'}
                          </div>
                          <div>Posted by verified network <CheckCircle size={12} className="inline text-emerald-500"/></div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                     <ShieldAlert size={40} className="mx-auto text-emerald-200 mb-3" />
                     <h4 className="text-slate-700 font-bold">No Active Threats</h4>
                     <p className="text-xs text-slate-500 mt-1">Your region is currently clear of reported outbreaks.</p>
                  </div>
                )}
             </div>
         </div>

         {/* Trust Dashboard */}
         <div className="glass-card rounded-2xl p-6">
            <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" /> Trust Score
            </h3>
            
            <div className="flex flex-col items-center justify-center py-6 border border-slate-100 bg-slate-50/50 rounded-xl mb-6">
               <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-slate-200" strokeWidth="8" fill="none"/>
                    <circle cx="48" cy="48" r="40" className="stroke-emerald-500" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="25"/>
                  </svg>
                  <span className="text-2xl font-black text-emerald-950 absolute">92</span>
               </div>
               <p className="font-bold text-slate-800">Excellent Standing</p>
               <p className="text-xs text-slate-500 text-center mt-1 px-4">Your reports are instantly trusted by the network</p>
            </div>
         </div>
      </motion.div>
    </div>
  );
}

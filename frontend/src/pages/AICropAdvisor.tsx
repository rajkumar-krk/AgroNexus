import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Sprout, BrainCircuit, MapPin, Search, LeafyGreen, Loader2, Target, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function AICropAdvisor() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentCrop: '',
    soilType: 'Loamy',
    areaAcres: '',
    location: '',
    season: 'Rabi'
  });
  const [advice, setAdvice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentCrop || !formData.location || !formData.areaAcres) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    setAdvice(null);
    try {
      const res = await api.getCropAdvice({
        ...formData,
        areaAcres: Number(formData.areaAcres)
      });
      setAdvice(res.data?.recommendation || res.data || "No advice returned.");
      toast.success("Crop intelligence retrieved!");
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch AI advice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit size={16} className="text-green-400" />
              <span className="text-green-100 text-xs font-bold uppercase tracking-wider">Gemini Agricultural Engine</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">AI Crop Advisor</h1>
            <p className="text-emerald-200 text-sm mt-1">Generate optimal planting, harvesting, and fertilization strategies based on your land profiles.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Input Form */}
         <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-3xl p-6">
               <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6 pb-4 border-b border-border/50">Farm Profile</h3>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Target Crop</label>
                    <div className="relative">
                      <LeafyGreen className="absolute left-3 top-2.5 text-muted-foreground/50" size={16} />
                      <input 
                        type="text" required
                        placeholder="e.g. Wheat, Basmati Rice"
                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                        value={formData.currentCrop}
                        onChange={e => setFormData({...formData, currentCrop: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Soil Type</label>
                       <select 
                         className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 font-medium"
                         value={formData.soilType}
                         onChange={e => setFormData({...formData, soilType: e.target.value})}
                       >
                         <option>Loamy</option>
                         <option>Clay</option>
                         <option>Sandy</option>
                         <option>Silt</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Acres</label>
                       <div className="relative">
                         <Target className="absolute left-3 top-2.5 text-muted-foreground/50" size={16} />
                         <input 
                           type="number" required min="0.1" step="0.1"
                           placeholder="0.0"
                           className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-emerald-500 font-medium"
                           value={formData.areaAcres}
                           onChange={e => setFormData({...formData, areaAcres: e.target.value})}
                         />
                       </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Location (District)</label>
                       <div className="relative">
                         <MapPin className="absolute left-3 top-2.5 text-muted-foreground/50" size={16} />
                         <input 
                           type="text" required
                           placeholder="e.g. Pune, Maharashtra"
                           className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-emerald-500 font-medium"
                           value={formData.location}
                           onChange={e => setFormData({...formData, location: e.target.value})}
                         />
                       </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Target Season</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 text-muted-foreground/50" size={16} />
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-emerald-500 font-medium"
                        value={formData.season}
                        onChange={e => setFormData({...formData, season: e.target.value})}
                      >
                         <option>Kharif</option>
                         <option>Rabi</option>
                         <option>Zaid</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold shadow-lg shadow-emerald-500/30 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="group-hover:scale-110 transition-transform" />}
                    {loading ? 'Analyzing Data...' : 'Generate AI Advisory'}
                  </button>
               </form>
            </div>
         </motion.div>

         {/* Output Window */}
         <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="lg:col-span-8">
            <div className="glass-card rounded-3xl p-6 min-h-[500px]">
               <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6 pb-4 border-b border-border/50 flex flex-center gap-2">
                 <Sparkles className="text-amber-500" size={16} /> Strategy Report
               </h3>

               {loading ? (
                 <div className="h-[400px] flex flex-col items-center justify-center text-emerald-600">
                    <div className="w-16 h-16 relative">
                       <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                       <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 font-bold animate-pulse text-sm">Gemini is processing your request...</p>
                 </div>
               ) : advice ? (
                 <div className="prose prose-sm prose-emerald max-w-none pb-8 text-slate-700">
                    {/* Render newlines and basic markdown rules safely */}
                    {advice.split('\n').map((line, i) => {
                      if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold text-emerald-900 mt-6 mb-2">{line.replace('##', '').trim()}</h3>;
                      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 space-y-1">{line.substring(2)}</li>;
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p> /* simple bold strip */
                    })}
                 </div>
               ) : (
                 <div className="h-[400px] flex flex-col items-center justify-center opacity-30">
                    <BrainCircuit size={64} className="mb-4 text-slate-400" />
                    <p className="font-bold text-slate-500">Awaiting Profile Input</p>
                    <p className="text-xs max-w-xs text-center mt-2">Provide your farm specifications to generate a comprehensive AI strategy.</p>
                 </div>
               )}
            </div>
         </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Store, MapPin, PackageOpen, Plus, Tag, TrendingUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function Marketplace() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, priceRes] = await Promise.all([
        api.getListings(),
        api.getMarketPrices()
      ]);
      setListings(listRes.data || []);
      setPrices(priceRes.data || []);
    } catch (err: any) {
      toast.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedMarket = async () => {
    try {
      await toast.promise(api.seedListings(), {
        loading: 'Generating market data...',
        success: 'Market seeded successfully!',
        error: 'Failed to seed market.'
      });
      fetchData();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div 
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store size={16} className="text-indigo-400" />
              <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">B2B Trade Network</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">AgroNexus Marketplace</h1>
            <p className="text-indigo-200 text-sm mt-1">Connect directly with verified buyers and maximize your crop value.</p>
          </div>
          <button className="px-5 py-2.5 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-lg shadow-black/20 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={16} /> New Listing
          </button>
        </div>
      </motion.div>

      {/* Market Ticker */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {prices.length > 0 ? prices.slice(0, 5).map((price, i) => (
          <div key={i} className="flex-shrink-0 glass-card rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
               <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{price.cropName}</p>
              <p className="font-extrabold text-lg text-emerald-600">₹{price.priceINR}<span className="text-xs text-muted-foreground font-normal">/kg</span></p>
            </div>
          </div>
        )) : (
          <div className="glass-card rounded-2xl p-4 w-full flex items-center justify-between">
            <p className="text-sm font-bold text-muted-foreground">Market data not initialized.</p>
            <button onClick={handleSeedMarket} className="text-xs px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold flex items-center gap-2"><Sparkles size={14}/> Seed Test Data</button>
          </div>
        )}
      </motion.div>

      {/* Listings Grid */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><p className="text-muted-foreground">Loading market...</p></div>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing._id} className="glass-card rounded-3xl overflow-hidden hover:border-indigo-200 transition-colors group">
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-emerald-50 p-4 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                   <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                     {listing.cropType}
                   </span>
                   <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                     <Tag size={10} /> ₹{listing.askingPriceINR}/kg
                   </span>
                 </div>
                 <h3 className="font-extrabold text-xl text-slate-800 drop-shadow-sm">{listing.title}</h3>
              </div>
              <div className="p-5 space-y-4">
                 <p className="text-sm text-slate-500 line-clamp-2">{listing.description || 'Premium quality harvest ready for dispatch.'}</p>
                 
                 <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/50">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><PackageOpen size={10}/> Volume</p>
                      <p className="font-semibold text-sm">{listing.availableKg} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><MapPin size={10}/> Location</p>
                      <p className="font-semibold text-sm truncate">{listing.location?.district || 'Registered Farm'}</p>
                    </div>
                 </div>

                 <div className="pt-1 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Sold By</p>
                     <p className="text-xs font-semibold">{listing.farmer?.fullName || 'Verified Farmer'}</p>
                   </div>
                   <button className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                     Contact
                   </button>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full glass-card p-12 text-center flex flex-col items-center justify-center">
             <Store size={48} className="text-muted-foreground/30 mb-4" />
             <h3 className="text-lg font-bold">No active listings</h3>
             <p className="text-sm text-muted-foreground mt-2 max-w-sm">There are currently no crops available on the market.</p>
             <button onClick={handleSeedMarket} className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold flex items-center gap-2">
               <Sparkles size={16} /> Generate Mock Market
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

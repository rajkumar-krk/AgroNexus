import React from 'react';
import { motion } from 'framer-motion';
import { useThingSpeakContext } from '../context/ThingSpeakContext';
import { LiveGPSMap } from '../components/LiveGPSMap';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Thermometer, Droplets, Wind, MapPin, Activity, Wifi, WifiOff,
  AlertTriangle, ShieldCheck, Clock, ExternalLink, Radio, Gauge
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }
  })
};

function formatTime(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function LiveMonitor() {
  const {
    data,
    history,
    coordHistory,
    loading,
    error,
    lastUpdated,
    isConnected,
    activeAlerts,
    spoilageRisk,
    thresholds,
    dismissAlert
  } = useThingSpeakContext();

  // Format history for charts
  const chartData = history.map((point: any) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }));

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
            <Radio size={24} className="text-white" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Connecting to ThingSpeak...</p>
          <p className="text-xs text-muted-foreground">Fetching live sensor data</p>
        </div>
      </div>
    );
  }

  const tempAlert = data && data.temperature > thresholds.TEMP_HIGH;
  const humAlert = data && data.humidity > thresholds.HUMIDITY_HIGH;
  const gasAlert = data && data.gas > thresholds.GAS_SPOILAGE;

  return (
    <div className="space-y-6 pb-20">
      {/* ═══ Hero Header ═══ */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-3 w-3 relative">
                {isConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                )}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isConnected ? 'text-emerald-100' : 'text-red-200'}`}>
                {isConnected ? 'Live — ThingSpeak Connected' : 'Disconnected'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
              Live IoT Monitor
            </h1>
            <p className="text-cyan-100/70 text-sm mt-1 flex items-center gap-2">
              <Clock size={14} />
              Last updated: {formatTime(lastUpdated)}
              {activeAlerts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/80 text-white text-[10px] font-bold animate-pulse">
                  {activeAlerts.length} ALERT{activeAlerts.length > 1 ? 'S' : ''}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
                <Wifi size={14} /> Connected
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-bold">
                <WifiOff size={14} /> Disconnected
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-medium">
            ⚠️ {error} — Retrying automatically...
          </div>
        )}
      </motion.div>

      {/* ═══ Metric Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Temperature */}
        <motion.div
          variants={fadeUp} custom={1} initial="hidden" animate="visible"
          className={`bg-white rounded-2xl border p-4 sm:p-5 hover-lift transition-all ${
            tempAlert ? 'border-red-300 bg-red-50/50 shadow-red-100 shadow-lg' : 'border-border/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tempAlert ? 'bg-red-100' : 'bg-sky-50'}`}>
              <Thermometer size={18} className={tempAlert ? 'text-red-600' : 'text-sky-600'} />
            </div>
            {tempAlert && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 animate-pulse">
                ⚠️ HIGH
              </span>
            )}
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold leading-none ${tempAlert ? 'text-red-600' : 'text-foreground'}`}>
            {data ? `${data.temperature.toFixed(1)}°C` : '—'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Temperature</p>
        </motion.div>

        {/* Humidity */}
        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate="visible"
          className={`bg-white rounded-2xl border p-4 sm:p-5 hover-lift transition-all ${
            humAlert ? 'border-amber-300 bg-amber-50/50 shadow-amber-100 shadow-lg' : 'border-border/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${humAlert ? 'bg-amber-100' : 'bg-violet-50'}`}>
              <Droplets size={18} className={humAlert ? 'text-amber-600' : 'text-violet-600'} />
            </div>
            {humAlert && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 animate-pulse">
                ⚠️ HIGH
              </span>
            )}
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold leading-none ${humAlert ? 'text-amber-600' : 'text-foreground'}`}>
            {data ? `${data.humidity.toFixed(1)}%` : '—'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Humidity</p>
        </motion.div>

        {/* Gas */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className={`bg-white rounded-2xl border p-4 sm:p-5 hover-lift transition-all ${
            gasAlert ? 'border-red-300 bg-red-50/50 shadow-red-100 shadow-lg' : 'border-border/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gasAlert ? 'bg-red-100' : 'bg-emerald-50'}`}>
              <Wind size={18} className={gasAlert ? 'text-red-600' : 'text-emerald-600'} />
            </div>
            {gasAlert && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 animate-pulse">
                ☠️ DANGER
              </span>
            )}
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold leading-none ${gasAlert ? 'text-red-600' : 'text-foreground'}`}>
            {data ? data.gas.toFixed(0) : '—'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Gas Value</p>
        </motion.div>

        {/* GPS */}
        <motion.div
          variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-border/60 p-4 sm:p-5 hover-lift"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin size={18} className="text-blue-600" />
            </div>
            {data && data.lat !== 0 && (
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${data.lat},${data.lon}`, '_blank')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <ExternalLink size={10} /> Maps
              </button>
            )}
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-foreground leading-none">
            {data && data.lat !== 0 ? `${data.lat.toFixed(4)}` : '—'}
          </p>
          <p className="text-sm font-bold text-muted-foreground">
            {data && data.lon !== 0 ? `${data.lon.toFixed(4)}` : '—'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Lat / Lon</p>
        </motion.div>
      </div>

      {/* ═══ Main Grid: Map + Spoilage AI ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live GPS Map */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-2 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                Live GPS Tracking
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                {coordHistory.length} positions recorded
              </span>
            </div>
            <LiveGPSMap
              lat={data?.lat || 0}
              lon={data?.lon || 0}
              coordHistory={coordHistory}
              height="380px"
            />
          </div>
        </motion.div>

        {/* Spoilage AI Panel */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="lg:col-span-1">
          <div className={`glass-card rounded-3xl p-6 h-full border-t-4 ${
            spoilageRisk.color === 'rose' ? 'border-t-rose-500' :
            spoilageRisk.color === 'amber' ? 'border-t-amber-500' : 'border-t-emerald-500'
          }`}>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6 text-center flex items-center justify-center gap-2">
              <Gauge size={16} />
              Spoilage AI Index
            </h3>

            {/* Risk Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke={spoilageRisk.color === 'rose' ? 'hsl(0 72% 55%)' : spoilageRisk.color === 'amber' ? 'hsl(38 92% 55%)' : 'hsl(152 60% 36%)'}
                    strokeWidth="8" fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * Math.min(spoilageRisk.score, 100)) / 100}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-extrabold tracking-tighter ${
                    spoilageRisk.color === 'rose' ? 'text-rose-600' :
                    spoilageRisk.color === 'amber' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {Math.round(spoilageRisk.score)}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">out of 100</span>
                </div>
              </div>

              <div className={`mt-6 px-4 py-2 rounded-xl text-center w-full font-bold text-sm ${
                spoilageRisk.color === 'rose' ? 'bg-rose-50 text-rose-700' :
                spoilageRisk.color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {spoilageRisk.level === 'Critical' ? '☠️ CRITICAL RISK' :
                 spoilageRisk.level === 'Moderate' ? '⚠️ ELEVATED RISK' : '✅ OPTIMAL'}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Thermometer size={14} className="mx-auto mb-1 text-sky-500" />
                  <p className="text-lg font-bold">{data?.temperature.toFixed(1) || '—'}°</p>
                  <p className="text-[9px] uppercase text-muted-foreground font-bold">Temp</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Wind size={14} className="mx-auto mb-1 text-emerald-500" />
                  <p className="text-lg font-bold">{data?.gas.toFixed(0) || '—'}</p>
                  <p className="text-[9px] uppercase text-muted-foreground font-bold">Gas</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Active Alerts ═══ */}
      {activeAlerts.length > 0 && (
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-heading font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle size={18} />
              Active Alerts
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                {activeAlerts.length}
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {activeAlerts.map((alert: any) => (
              <div
                key={alert.id}
                className={`rounded-2xl p-4 flex items-center gap-4 transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border border-red-200 shadow-md shadow-red-100'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertTriangle size={22} className={alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
                    {alert.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${alert.severity === 'critical' ? 'text-red-600/70' : 'text-amber-600/70'}`}>
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-border/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Trend Charts ═══ */}
      <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible">
        <h2 className="text-lg font-heading font-bold flex items-center gap-2 mb-4">
          <Activity size={18} className="text-cyan-600" />
          Sensor Trends
          <span className="text-xs font-normal text-muted-foreground ml-1">
            {chartData.length} data points
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Temperature Trend */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
              <Thermometer size={16} className="text-sky-600" />
              Temperature
            </h3>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lm-tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(200 80% 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(200 80% 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="temperature" stroke="hsl(200 80% 55%)" strokeWidth={2.5} fillOpacity={1} fill="url(#lm-tempGrad)" animationDuration={300} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Waiting for data...</div>
              )}
            </div>
          </div>

          {/* Humidity Trend */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
              <Droplets size={16} className="text-teal-600" />
              Humidity
            </h3>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lm-humGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152 60% 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(152 60% 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="humidity" stroke="hsl(152 60% 36%)" strokeWidth={2.5} fillOpacity={1} fill="url(#lm-humGrad)" animationDuration={300} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Waiting for data...</div>
              )}
            </div>
          </div>

          {/* Gas Trend */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
              <Wind size={16} className="text-amber-600" />
              Gas Value
            </h3>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lm-gasGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38 92% 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(38 92% 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 'dataMax + 50']} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="gas" stroke="hsl(38 92% 50%)" strokeWidth={2.5} fillOpacity={1} fill="url(#lm-gasGrad)" animationDuration={300} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Waiting for data...</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ System Status Footer ═══ */}
      <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible">
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              ThingSpeak Channel: {import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3342325'}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Activity size={14} className="text-cyan-500" />
              Polling: Every 5s
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock size={14} />
            {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : 'Waiting for first reading...'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

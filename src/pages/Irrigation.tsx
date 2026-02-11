import { useState, useEffect } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  Droplets, 
  Power, 
  Clock, 
  CloudRain, 
  Zap, 
  Thermometer, 
  FlaskConical,
  BarChart3,
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import { blink } from '../lib/blink'

export function Irrigation() {
  const [pumpStatus, setPumpStatus] = useState<'off' | 'on'>('off')
  const [moisture, setMoisture] = useState(45)
  const [lastWatered, setLastWatered] = useState('2 days ago')
  const [usageData, setUsageData] = useState<any[]>([])

  useEffect(() => {
    // Simulate real-time moisture reading fluctuations
    const interval = setInterval(() => {
      setMoisture(prev => {
        const delta = Math.random() * 2 - 1
        return Math.min(Math.max(prev + delta, 0), 100)
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const togglePump = () => {
    const newStatus = pumpStatus === 'off' ? 'on' : 'off'
    setPumpStatus(newStatus)
    if (newStatus === 'on') {
      // Simulate water consumption increase
      const utterance = new SpeechSynthesisUtterance("Namaste, Pump Chalu kar diya gaya hai.")
      utterance.lang = 'hi-IN'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Droplets className="text-sky" /> Water Management
        </h2>
        <Badge variant="outline" className="bg-sky/5 border-sky/20 text-sky font-bold">
          <div className="w-2 h-2 bg-sky rounded-full animate-pulse mr-2" />
          IoT Active
        </Badge>
      </div>

      {/* Main Control Card */}
      <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-white to-sky/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6 w-full">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Soil Moisture</span>
                <span className="text-4xl font-black text-primary">{Math.round(moisture)}%</span>
              </div>
              <div className="relative h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${moisture}%` }}
                  className={`h-full transition-all duration-1000 rounded-full ${moisture < 40 ? 'bg-destructive' : moisture > 80 ? 'bg-sky' : 'bg-sprout'}`}
                />
                {/* Target Range Markers */}
                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/40 border-l border-dashed border-black/20" />
                <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/40 border-l border-dashed border-black/20" />
                <div className="absolute top-0 bottom-0 left-[60%] right-[25%] bg-primary/5 pointer-events-none" />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-muted-foreground">Dry</span>
                <span className="text-[10px] font-bold text-primary italic">Target Range: 60-75%</span>
                <span className="text-[10px] font-bold text-muted-foreground">Saturated</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase">Next Scheduled</span>
                </div>
                <p className="text-sm font-bold">Tomorrow, 6:00 AM</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CloudRain size={14} />
                  <span className="text-[10px] font-bold uppercase">Suggestion</span>
                </div>
                <p className="text-xs font-bold text-sky">Delay 1 day: Rain expected</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 border-border shadow-xl relative group w-full md:w-auto min-w-[200px]">
            <div className={`absolute inset-0 bg-sky/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl ${pumpStatus === 'on' ? 'animate-pulse opacity-100' : ''}`} />
            <button 
              onClick={togglePump}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                pumpStatus === 'on' 
                  ? 'bg-destructive text-white scale-110' 
                  : 'bg-primary text-white hover:scale-105'
              }`}
            >
              <Power size={40} />
            </button>
            <div className="mt-4 text-center relative z-10">
              <span className={`text-sm font-black uppercase tracking-widest ${pumpStatus === 'on' ? 'text-destructive' : 'text-primary'}`}>
                Pump {pumpStatus === 'on' ? 'Running' : 'Ready'}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Manual Control</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard icon={<Thermometer className="text-orange-500" />} label="Soil Temp" value="24°C" status="Normal" />
        <SensorCard icon={<FlaskConical className="text-purple-500" />} label="Soil pH" value="6.8" status="Optimal" />
        <SensorCard icon={<Zap className="text-yellow-500" />} label="Nutrients" value="Medium" status="Add Urea" />
        <SensorCard icon={<Droplets className="text-sky" />} label="Humidity" value="62%" status="Normal" />
      </div>

      {/* Usage Analytics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" /> Water Usage This Month
          </h3>
          <Button variant="ghost" size="sm" className="text-sky font-bold">Details</Button>
        </div>
        
        <div className="h-40 flex items-end justify-between gap-2 px-2">
          {[45, 60, 30, 80, 50, 40, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
              <div className="w-full relative">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-sky/20 group-hover:bg-sky/40 rounded-t-lg transition-colors border-t border-sky/30"
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground mt-2">D{i+1}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-sprout/10 border border-sprout/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-sprout" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Smart Efficiency Bonus</p>
              <p className="text-[10px] text-muted-foreground">You saved 1,240 liters vs manual watering</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-primary">₹1,240 Saved</p>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-dashed hover:border-primary/50 cursor-pointer transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Info size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Irrigation Guide</p>
              <p className="text-xs text-muted-foreground">Best practices for Wheat flowering stage</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 border-dashed hover:border-primary/50 cursor-pointer transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Schedule Maintenance</p>
              <p className="text-xs text-muted-foreground">Pump service due in 15 days</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function SensorCard({ icon, label, value, status }: { icon: any, label: string, value: string, status: string }) {
  return (
    <Card className="p-4 flex flex-col items-center text-center space-y-1 hover:border-primary/30 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
      <p className="text-xl font-black text-primary leading-none">{value}</p>
      <Badge variant="ghost" className="text-[10px] font-bold text-muted-foreground p-0 h-auto">
        {status}
      </Badge>
    </Card>
  )
}

function TrendingUp({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

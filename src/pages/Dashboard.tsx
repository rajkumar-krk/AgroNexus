import { useState, useEffect } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  CloudSun, 
  ArrowUpRight, 
  Droplets, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { blink } from '../lib/blink'
import { VoiceFAB } from '../components/VoiceFAB'

export function Dashboard() {
  const [crops, setCrops] = useState<any[]>([])
  const [marketPrices, setMarketPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cropsData = await blink.db.crops.list()
        const pricesData = await blink.db.market_prices.list()
        
        setCrops(cropsData)
        setMarketPrices(pricesData)

        // Seed if empty (first time)
        if (cropsData.length === 0) {
          const seedCrops = [
            { name: 'Wheat', type: 'Grain', healthScore: 92, moistureLevel: 65, status: 'Healthy', expectedYield: '45 q/acre' },
            { name: 'Soybean', type: 'Oilseed', healthScore: 78, moistureLevel: 45, status: 'Alert: Pest', expectedYield: '12 q/acre' },
            { name: 'Cotton', type: 'Fiber', healthScore: 95, moistureLevel: 70, status: 'Excellent', expectedYield: '8 q/acre' },
          ]
          await blink.db.crops.createMany(seedCrops.map(c => ({ ...c, userId: 'demo-user' })))
          setCrops(await blink.db.crops.list())
        }

        if (pricesData.length === 0) {
          const seedPrices = [
            { cropName: 'Wheat', currentPrice: 2450, priceChange: 50 },
            { cropName: 'Soybean', currentPrice: 5200, priceChange: -120 },
            { cropName: 'Cotton', currentPrice: 7800, priceChange: 200 },
          ]
          await blink.db.market_prices.createMany(seedPrices.map(p => ({ ...p })))
          setMarketPrices(await blink.db.market_prices.list())
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return null

  return (
    <div className="space-y-6 pb-12">
      {/* Weather & Location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin size={18} className="text-sky" />
          <span className="font-medium">Bhilwara, Rajasthan</span>
        </div>
        <div className="flex items-center space-x-4 bg-white/50 px-4 py-2 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center space-x-2">
            <CloudSun size={24} className="text-accent" />
            <span className="text-2xl font-bold">29°C</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <span className="text-sm font-medium">Partly Cloudy</span>
        </div>
      </div>

      {/* Active Crops Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            <span className="text-2xl">🌱</span> Active Crops
          </h2>
          <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x">
          {crops.map((crop, i) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="snap-center min-w-[280px]"
            >
              <Card className="p-5 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Droplets size={80} />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{crop.name}</h3>
                    <p className="text-xs text-muted-foreground">{crop.type}</p>
                  </div>
                  <Badge className={
                    crop.status.includes('Alert') 
                      ? "bg-destructive/10 text-destructive border-destructive/20" 
                      : "bg-sprout/10 text-primary border-sprout/20"
                  }>
                    {crop.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Health</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sprout transition-all duration-1000" 
                          style={{ width: `${crop.healthScore}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold">{crop.healthScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Moisture</span>
                    <div className="flex items-center space-x-2">
                      <Droplets size={12} className="text-sky" />
                      <span className="text-xs font-bold">{crop.moistureLevel}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Yield Est.</span>
                  <span className="text-sm font-bold text-secondary">{crop.expectedYield}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Soil Health Digital Twin Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            <span className="text-2xl">🧬</span> Soil Health Digital Twin
          </h2>
          <Badge className="bg-sky/10 text-sky border-sky/20 font-bold uppercase text-[10px]">Real-time Model</Badge>
        </div>
        
        <Card className="p-6 bg-gradient-to-br from-white to-[#6B4423]/5 border-2 border-secondary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 bg-secondary/5 rounded-3xl overflow-hidden border border-secondary/20 group">
              {/* 3D Visualization Mockup */}
              <div className="absolute inset-0 flex flex-col">
                <div className="h-1/3 bg-secondary/20 border-b border-secondary/30 flex items-center justify-center relative overflow-hidden">
                  <span className="text-[10px] font-black text-secondary/60 uppercase tracking-widest absolute top-2 left-3">Topsoil (0-15cm)</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-sprout/40" />
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs font-black text-primary leading-none">6.8</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">pH</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-primary leading-none">Low</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">Nitrogen</p>
                    </div>
                  </div>
                </div>
                <div className="h-2/3 bg-secondary/10 flex items-center justify-center relative">
                  <span className="text-[10px] font-black text-secondary/60 uppercase tracking-widest absolute top-2 left-3">Subsoil (15-45cm)</span>
                  <div className="flex flex-col items-center">
                    <Droplets className="text-sky/40 mb-2 animate-bounce" size={32} />
                    <p className="text-lg font-black text-primary leading-none">52%</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Moisture Depth</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4">
                <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur-sm rounded-full font-bold text-[10px] border-2">
                  <Layers size={12} className="mr-1" /> Rotate 3D
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-secondary mb-2 flex items-center gap-2">
                   <CheckCircle2 size={18} className="text-sprout" /> Recommendations
                </h3>
                <div className="space-y-3">
                  <RecItem icon="🧪" text="Add Urea: 80 kg/acre to boost Nitrogen." />
                  <RecItem icon="🍂" text="Apply Compost: Improves pH and texture." />
                  <RecItem icon="🔄" text="Crop Rotation: Plant Legumes next season." />
                </div>
              </div>

              <div className="pt-4 border-t border-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-sprout" />
                  <span className="text-sm font-bold">Health Trend: +12%</span>
                </div>
                <Button size="sm" className="rounded-full font-bold bg-secondary hover:bg-secondary/90">Book Soil Test</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Priorities & Market */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Priorities */}
        <Card className="p-6">
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-primary" /> Today's Priorities
          </h2>
          <div className="space-y-4">
            <PriorityItem 
              type="danger" 
              title="Spray Pesticide" 
              desc="Soybean Field - North Sector" 
              icon={<AlertCircle size={18} />} 
            />
            <PriorityItem 
              type="warning" 
              title="Irrigation Due" 
              desc="Wheat Field - Block B" 
              icon={<Droplets size={18} />} 
            />
            <PriorityItem 
              type="success" 
              title="Harvest Ready" 
              desc="Cotton in 7 days" 
              icon={<CheckCircle2 size={18} />} 
            />
          </div>
          <Button className="w-full mt-6 rounded-xl font-bold py-6">
            View All Tasks
          </Button>
        </Card>

        {/* Live Market Prices */}
        <Card className="p-6">
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-secondary" /> Live Market Prices
          </h2>
          <div className="space-y-3">
            {marketPrices.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                    {item.cropName[0]}
                  </div>
                  <div>
                    <p className="font-bold">{item.cropName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Standard Grade</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.currentPrice}/q</p>
                  <div className={`flex items-center justify-end text-[10px] font-bold ${item.priceChange >= 0 ? 'text-sprout' : 'text-destructive'}`}>
                    {item.priceChange >= 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : null}
                    {item.priceChange >= 0 ? `+₹${item.priceChange}` : `-₹${Math.abs(item.priceChange)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-xl font-bold py-6 border-2">
            Find Buyers Nearby
          </Button>
        </Card>
      </div>

      <VoiceFAB />
    </div>
  )
}

function PriorityItem({ type, title, desc, icon }: { type: 'danger' | 'warning' | 'success', title: string, desc: string, icon: any }) {
  const styles = {
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-accent/10 text-accent border-accent/20",
    success: "bg-sprout/10 text-primary border-sprout/20"
  }

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-xl border ${styles[type]} group cursor-pointer hover:scale-[1.01] transition-transform`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <h4 className="font-bold text-sm leading-tight">{title}</h4>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-black/5">
        <ArrowUpRight size={14} />
      </Button>
    </div>
  )
}

function RecItem({ icon, text }: { icon: string, text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border hover:border-secondary/30 transition-colors cursor-help">
      <span className="text-lg">{icon}</span>
      <p className="text-xs font-medium leading-tight text-muted-foreground">{text}</p>
    </div>
  )
}
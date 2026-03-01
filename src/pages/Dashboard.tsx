import { useState } from 'react'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
    Sun,
    Droplets,
    TrendingUp,
    Leaf,
    IndianRupee,
    AlertTriangle,
    CheckCircle2,
    Sprout,
    Timer,
    Wind,
    Radar,
    CalendarDays,
    Shield,
    Beaker,
} from 'lucide-react'
import { motion } from 'framer-motion'

// Import existing unique feature components
import { PestRadar } from '../components/PestRadar'
import { SprayWindow } from '../components/SprayWindow'
import { TrustScore } from '../components/TrustScore'
import { SoilRestCalendar } from '../components/SoilRestCalendar'
import { CropCalendar } from '../components/CropCalendar'

const weatherData = {
    temp: 32,
    condition: 'Partly Cloudy',
    humidity: 68,
    windSpeed: 12,
    forecast: [
        { day: 'Today', icon: '☀️', high: 32, low: 22 },
        { day: 'Tue', icon: '⛅', high: 30, low: 21 },
        { day: 'Wed', icon: '🌧️', high: 28, low: 20 },
        { day: 'Thu', icon: '☀️', high: 33, low: 22 },
        { day: 'Fri', icon: '⛅', high: 31, low: 21 },
    ],
}

const activeCrops = [
    { name: 'Wheat (Sharbati)', stage: 'Tillering', health: 92, daysLeft: 75, emoji: '🌾' },
    { name: 'Cotton (BT)', stage: 'Flowering', health: 85, daysLeft: 45, emoji: '🧶' },
    { name: 'Soybean', stage: 'Pod Filling', health: 78, daysLeft: 30, emoji: '🫘' },
]

const alerts = [
    { type: 'warning', message: 'Yellow Rust risk HIGH — spray Propiconazole within 48h', time: '2h ago' },
    { type: 'info', message: 'Best time to sell wheat: prices up ₹120/qtl this week', time: '5h ago' },
    { type: 'success', message: 'Drip irrigation cycle completed — saved 2,400L water', time: '1d ago' },
]

type FeatureView = 'dashboard' | 'pest-radar' | 'spray-window' | 'trust-score' | 'soil-rest' | 'crop-calendar'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export function Dashboard() {
    const [featureView, setFeatureView] = useState<FeatureView>('dashboard')

    // Render sub-feature views
    if (featureView !== 'dashboard') {
        return (
            <div className="space-y-4 pb-12">
                <Button variant="ghost" onClick={() => setFeatureView('dashboard')} className="rounded-xl font-bold">
                    ← Back to Dashboard
                </Button>
                {featureView === 'pest-radar' && <PestRadar />}
                {featureView === 'spray-window' && <SprayWindow />}
                {featureView === 'trust-score' && <TrustScore />}
                {featureView === 'soil-rest' && <SoilRestCalendar />}
                {featureView === 'crop-calendar' && <CropCalendar />}
            </div>
        )
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-12">
            {/* Greeting & Weather */}
            <motion.div variants={item}>
                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Good Morning</p>
                            <h1 className="text-2xl font-heading font-black">Namaste, Farmer Ji! 🙏</h1>
                            <p className="text-sm text-muted-foreground mt-1">Your farm is looking healthy today</p>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-muted/50 border border-border">
                            <div className="text-center">
                                <p className="text-3xl font-black text-primary">{weatherData.temp}°</p>
                                <p className="text-[10px] font-bold text-muted-foreground">{weatherData.condition}</p>
                            </div>
                            <div className="text-xs space-y-1 text-muted-foreground">
                                <div className="flex items-center gap-1"><Droplets size={12} /> {weatherData.humidity}%</div>
                                <div className="flex items-center gap-1"><Wind size={12} /> {weatherData.windSpeed} km/h</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                        {weatherData.forecast.map((d, i) => (
                            <div key={d.day} className={`flex-shrink-0 text-center px-3 py-2 rounded-xl border ${i === 0 ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                                <p className="text-[10px] font-bold text-muted-foreground">{d.day}</p>
                                <p className="text-lg">{d.icon}</p>
                                <p className="text-xs font-bold">{d.high}°</p>
                                <p className="text-[10px] text-muted-foreground">{d.low}°</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Active Crops', value: '3', icon: Sprout, color: 'text-primary' },
                    { label: 'Farm Area', value: '5.2 Ha', icon: Leaf, color: 'text-secondary' },
                    { label: 'This Season', value: '₹1.15L', icon: IndianRupee, color: 'text-accent' },
                    { label: 'Next Harvest', value: '30 days', icon: Timer, color: 'text-amber-500' },
                ].map((stat) => (
                    <motion.div key={stat.label} variants={item}>
                        <Card className="p-4 hover:border-primary/30 transition-colors group">
                            <div className="flex items-center gap-2 mb-1">
                                <stat.icon size={16} className={stat.color} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ═══ UNIQUE FEATURES QUICK ACCESS ═══ */}
            <motion.div variants={item}>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                    🧬 Unique Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { id: 'pest-radar' as FeatureView, icon: '🦟', label: 'Pest Radar', desc: '50km early warning' },
                        { id: 'spray-window' as FeatureView, icon: '🧪', label: 'Spray Window', desc: '7-day optimal timing' },
                        { id: 'trust-score' as FeatureView, icon: '⭐', label: 'Trust Score', desc: 'Your farmer rating' },
                        { id: 'soil-rest' as FeatureView, icon: '📅', label: 'Soil Rest', desc: 'Rotation planner' },
                        { id: 'crop-calendar' as FeatureView, icon: '🌱', label: 'Crop Calendar', desc: 'Season timeline' },
                    ].map((f) => (
                        <motion.div key={f.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Card
                                className="p-4 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                onClick={() => setFeatureView(f.id)}
                            >
                                <span className="text-2xl">{f.icon}</span>
                                <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors">{f.label}</p>
                                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Active Crops */}
            <motion.div variants={item}>
                <Card className="p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <Sprout size={20} className="text-primary" /> Active Crops
                    </h3>
                    <div className="space-y-3">
                        {activeCrops.map((crop) => (
                            <div key={crop.name} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors">
                                <span className="text-2xl">{crop.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{crop.name}</span>
                                        <Badge variant="outline" className="text-[9px] font-bold">{crop.stage}</Badge>
                                    </div>
                                    <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${crop.health}%`,
                                                backgroundColor: crop.health > 85 ? 'hsl(89, 72%, 48%)' : crop.health > 70 ? 'hsl(38, 92%, 55%)' : 'hsl(6, 78%, 57%)',
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Health: {crop.health}% • Harvest in {crop.daysLeft} days</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Alerts */}
            <motion.div variants={item}>
                <Card className="p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <AlertTriangle size={20} className="text-amber-500" /> Alerts & Recommendations
                    </h3>
                    <div className="space-y-2">
                        {alerts.map((alert, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-xl border flex items-start gap-3 ${alert.type === 'warning' ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800'
                                        : alert.type === 'success' ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800'
                                            : 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800'
                                    }`}
                            >
                                {alert.type === 'warning' && <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />}
                                {alert.type === 'success' && <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />}
                                {alert.type === 'info' && <TrendingUp size={16} className="text-blue-500 mt-0.5 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">{alert.message}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

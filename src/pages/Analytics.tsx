import { useState } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
    Droplets,
    TrendingUp,
    TrendingDown,
    Package,
    IndianRupee,
    BarChart3,
    PlusCircle,
    Trash2,
    Leaf,
    FlaskConical,
    CloudRain,
    Bug,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from 'recharts'

// Sample yield trend data
const yieldTrendData = [
    { week: 'W1', yield: 1.8, target: 2.2 },
    { week: 'W2', yield: 2.0, target: 2.2 },
    { week: 'W3', yield: 1.9, target: 2.2 },
    { week: 'W4', yield: 2.3, target: 2.2 },
    { week: 'W5', yield: 2.1, target: 2.2 },
    { week: 'W6', yield: 2.4, target: 2.2 },
    { week: 'W7', yield: 2.5, target: 2.2 },
    { week: 'W8', yield: 2.6, target: 2.2 },
]

// Profitability data
const profitData = [
    { category: 'Seeds', cost: 8000, revenue: 0 },
    { category: 'Fertilizer', cost: 12000, revenue: 0 },
    { category: 'Labour', cost: 15000, revenue: 0 },
    { category: 'Wheat', cost: 0, revenue: 62000 },
    { category: 'Cotton', cost: 0, revenue: 35000 },
    { category: 'Soybean', cost: 0, revenue: 18000 },
]

type InputEntry = {
    id: string
    date: string
    type: 'fertilizer' | 'water' | 'pesticide'
    crop: string
    quantity: string
    unit: string
    notes: string
}

const initialInputs: InputEntry[] = [
    { id: '1', date: '2026-02-20', type: 'fertilizer', crop: 'Wheat', quantity: '80', unit: 'kg/acre', notes: 'Urea top dressing' },
    { id: '2', date: '2026-02-18', type: 'water', crop: 'Cotton', quantity: '2400', unit: 'litres', notes: 'Drip irrigation cycle' },
    { id: '3', date: '2026-02-15', type: 'pesticide', crop: 'Soybean', quantity: '200', unit: 'ml', notes: 'Mancozeb spray for leaf blight' },
]

const inputTypeConfig = {
    fertilizer: { icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-50' },
    water: { icon: CloudRain, color: 'text-sky', bg: 'bg-sky/10' },
    pesticide: { icon: Bug, color: 'text-amber-600', bg: 'bg-amber-50' },
}

export function Analytics() {
    const [inputs, setInputs] = useState<InputEntry[]>(initialInputs)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newInput, setNewInput] = useState({
        type: 'fertilizer' as InputEntry['type'],
        crop: '',
        quantity: '',
        unit: 'kg/acre',
        notes: '',
    })

    const addInput = () => {
        if (!newInput.crop || !newInput.quantity) return
        setInputs(prev => [
            {
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                ...newInput,
            },
            ...prev,
        ])
        setNewInput({ type: 'fertilizer', crop: '', quantity: '', unit: 'kg/acre', notes: '' })
        setShowAddForm(false)
    }

    const deleteInput = (id: string) => {
        setInputs(prev => prev.filter(i => i.id !== id))
    }

    // Calculate KPIs
    const totalCost = profitData.reduce((sum, d) => sum + d.cost, 0)
    const totalRevenue = profitData.reduce((sum, d) => sum + d.revenue, 0)
    const profit = totalRevenue - totalCost

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                <BarChart3 className="text-primary" /> Farm Analytics
            </h2>

            {/* KPI Cards Row — matching guide wireframe */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Droplets size={80} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">🌡️ Soil Moisture</p>
                        <p className="text-4xl font-black text-primary leading-none">68<span className="text-lg text-muted-foreground">%</span></p>
                        <div className="flex items-center gap-1 mt-2 text-sprout">
                            <TrendingUp size={14} />
                            <span className="text-xs font-bold">+5% from last week</span>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="p-5 relative overflow-hidden group hover:border-secondary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Package size={80} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">📦 Yield Estimate</p>
                        <p className="text-4xl font-black text-secondary leading-none">2.4<span className="text-lg text-muted-foreground">t/ha</span></p>
                        <div className="flex items-center gap-1 mt-2 text-sprout">
                            <TrendingUp size={14} />
                            <span className="text-xs font-bold">+12% vs last season</span>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="p-5 relative overflow-hidden group hover:border-accent/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <IndianRupee size={80} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">💰 Profit Forecast</p>
                        <p className="text-4xl font-black text-accent leading-none">₹{(profit / 1000).toFixed(0)}k</p>
                        <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs font-bold text-muted-foreground">
                                Revenue ₹{(totalRevenue / 1000).toFixed(0)}k — Cost ₹{(totalCost / 1000).toFixed(0)}k
                            </span>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Yield Trend Chart */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" /> Weekly Yield Trend
                    </h3>
                    <Badge className="bg-sprout/10 text-primary border-sprout/20 font-bold text-[10px]">t/ha</Badge>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={yieldTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(96, 56%, 20%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(96, 56%, 20%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: 600 }} />
                            <YAxis tick={{ fontSize: 11, fontWeight: 600 }} domain={[1.5, 3]} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '2px solid hsl(28, 20%, 85%)',
                                    fontWeight: 600,
                                    fontSize: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="target"
                                stroke="hsl(38, 92%, 55%)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={0}
                                name="Target"
                            />
                            <Area
                                type="monotone"
                                dataKey="yield"
                                stroke="hsl(96, 56%, 20%)"
                                strokeWidth={3}
                                fill="url(#yieldGradient)"
                                name="Actual Yield"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Profitability Snapshot */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <IndianRupee size={20} className="text-secondary" /> Profitability Snapshot
                    </h3>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-bold text-[10px]">This Season</Badge>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 600 }} />
                            <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '2px solid hsl(28, 20%, 85%)',
                                    fontWeight: 600,
                                    fontSize: '12px'
                                }}
                                formatter={(value: number) => `₹${value.toLocaleString()}`}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                            <Bar dataKey="cost" fill="hsl(6, 78%, 57%)" name="Cost (₹)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="revenue" fill="hsl(89, 72%, 48%)" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Profit Summary */}
                <div className="mt-4 p-4 rounded-xl bg-sprout/10 border border-sprout/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm">
                            <Leaf size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">Net Profit This Season</p>
                            <p className="text-[10px] text-muted-foreground">Based on current yield estimates and market prices</p>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-primary">₹{profit.toLocaleString()}</p>
                </div>
            </Card>

            {/* Input Tracker */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FlaskConical size={20} className="text-purple-500" /> Input Tracker
                    </h3>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        size="sm"
                        className="rounded-xl font-bold"
                    >
                        <PlusCircle size={16} className="mr-1" /> Log Input
                    </Button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                                <select
                                    value={newInput.type}
                                    onChange={e => setNewInput(prev => ({ ...prev, type: e.target.value as any }))}
                                    className="w-full h-10 rounded-xl border border-border px-3 text-sm font-bold bg-card"
                                >
                                    <option value="fertilizer">Fertilizer</option>
                                    <option value="water">Water</option>
                                    <option value="pesticide">Pesticide</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crop</label>
                                <Input
                                    value={newInput.crop}
                                    onChange={e => setNewInput(prev => ({ ...prev, crop: e.target.value }))}
                                    placeholder="e.g. Wheat"
                                    className="rounded-xl h-10 font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</label>
                                <Input
                                    value={newInput.quantity}
                                    onChange={e => setNewInput(prev => ({ ...prev, quantity: e.target.value }))}
                                    placeholder="e.g. 80"
                                    className="rounded-xl h-10 font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notes</label>
                                <Input
                                    value={newInput.notes}
                                    onChange={e => setNewInput(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Optional"
                                    className="rounded-xl h-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={addInput} className="rounded-xl font-bold" disabled={!newInput.crop || !newInput.quantity}>
                                Save Entry
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl font-bold border-2">
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Input Log Table */}
                <div className="space-y-2">
                    {inputs.map((entry, i) => {
                        const config = inputTypeConfig[entry.type]
                        const Icon = config.icon
                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors group"
                            >
                                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{entry.crop}</span>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase">{entry.type}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {entry.quantity} {entry.unit} — {entry.notes}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{entry.date}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                    onClick={() => deleteInput(entry.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </motion.div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}

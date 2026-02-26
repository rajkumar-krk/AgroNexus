import { useState } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
    Sprout,
    TrendingUp,
    Calendar,
    MapPin,
    AlertTriangle,
    Lightbulb,
    BarChart3,
    Loader2,
    ChevronRight,
    Leaf,
    Target,
    IndianRupee,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export function CropAdvisor() {
    const [form, setForm] = useState({
        currentCrop: '',
        soilType: 'Alluvial',
        areaAcres: 2,
        location: 'Telangana, India',
        season: 'Rabi',
    })
    const [advice, setAdvice] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit() {
        if (!form.currentCrop) {
            setError('Please enter your current crop')
            return
        }
        setError('')
        setLoading(true)
        try {
            const result = await api.getCropAdvice(form)
            setAdvice(result)
        } catch (err: any) {
            setError(err.message || 'Failed to get advice')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                    <span className="text-3xl">🧠</span> AI Crop Advisor
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Gemini-powered seasonal planning intelligence — personalized for your farm
                </p>
            </div>

            {/* Input Form */}
            <Card className="p-6">
                <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Sprout size={16} className="text-primary" /> Tell us about your farm
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">Current / Last Crop</label>
                        <Input
                            placeholder="e.g. Wheat, Rice, Cotton"
                            value={form.currentCrop}
                            onChange={e => setForm({ ...form, currentCrop: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">Soil Type</label>
                        <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={form.soilType}
                            onChange={e => setForm({ ...form, soilType: e.target.value })}
                        >
                            <option value="Alluvial">Alluvial (Indo-Gangetic)</option>
                            <option value="Black Cotton">Black Cotton (Regur)</option>
                            <option value="Red">Red Soil</option>
                            <option value="Laterite">Laterite</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Clay">Clay</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">Farm Area (acres)</label>
                        <Input
                            type="number"
                            value={form.areaAcres}
                            onChange={e => setForm({ ...form, areaAcres: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">Location</label>
                        <Input
                            placeholder="e.g. Warangal, Telangana"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1 block">Upcoming Season</label>
                        <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={form.season}
                            onChange={e => setForm({ ...form, season: e.target.value })}
                        >
                            <option value="Kharif">Kharif (Jun–Oct)</option>
                            <option value="Rabi">Rabi (Nov–Mar)</option>
                            <option value="Zaid">Zaid (Mar–Jun)</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertTriangle size={12} /> {error}
                    </p>
                )}

                <Button onClick={handleSubmit} disabled={loading} className="mt-4 w-full sm:w-auto gap-2">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                    Get AI Recommendation
                </Button>
            </Card>

            {/* Loading State */}
            {loading && (
                <Card className="p-12 text-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                        <p className="text-sm font-bold text-primary">Gemini AI Analyzing...</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Evaluating soil compatibility, market trends, and seasonal patterns
                        </p>
                    </motion.div>
                </Card>
            )}

            {/* Results */}
            {advice && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Main Recommendation */}
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                <Sprout size={20} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg">
                                    Plant: {advice.recommendedCrop}
                                </h3>
                                <p className="text-xs text-muted-foreground">AI-recommended for your farm</p>
                            </div>
                        </div>

                        {/* KPI Row */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="text-center p-3 bg-card rounded-lg border">
                                <Calendar size={14} className="mx-auto text-primary mb-1" />
                                <div className="text-xs font-bold">{advice.plantingDate}</div>
                                <div className="text-[10px] text-muted-foreground">Plant By</div>
                            </div>
                            <div className="text-center p-3 bg-card rounded-lg border">
                                <BarChart3 size={14} className="mx-auto text-primary mb-1" />
                                <div className="text-xs font-bold">{advice.expectedYield}</div>
                                <div className="text-[10px] text-muted-foreground">Expected Yield</div>
                            </div>
                            <div className="text-center p-3 bg-card rounded-lg border">
                                <IndianRupee size={14} className="mx-auto text-primary mb-1" />
                                <div className="text-xs font-bold">{advice.profitEstimate}</div>
                                <div className="text-[10px] text-muted-foreground">Est. Profit</div>
                            </div>
                        </div>
                    </Card>

                    {/* Viability + Demand Scores */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="p-4 text-center">
                            <div className="text-3xl font-heading font-bold text-primary">{advice.viabilityScore}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Season Viability Score</p>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${advice.viabilityScore}%` }}
                                />
                            </div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-3xl font-heading font-bold text-amber-600">{advice.marketDemand}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Market Demand Match</p>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-amber-500 h-2 rounded-full transition-all"
                                    style={{ width: `${advice.marketDemand}%` }}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Rotation Advice */}
                    {advice.rotationAdvice && (
                        <Card className="p-4 bg-green-50 border-green-200">
                            <h3 className="text-xs font-bold text-green-800 flex items-center gap-1 mb-1">
                                <Leaf size={12} /> Rotation Logic
                            </h3>
                            <p className="text-xs text-green-700">{advice.rotationAdvice}</p>
                        </Card>
                    )}

                    {/* Risks */}
                    {advice.risks?.length > 0 && (
                        <Card className="p-4">
                            <h3 className="text-xs font-bold text-red-600 flex items-center gap-1 mb-2">
                                <AlertTriangle size={12} /> Risks to Watch
                            </h3>
                            <ul className="space-y-1">
                                {advice.risks.map((risk: string, i: number) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">•</span> {risk}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {/* Tips */}
                    {advice.tips?.length > 0 && (
                        <Card className="p-4">
                            <h3 className="text-xs font-bold text-primary flex items-center gap-1 mb-2">
                                <Lightbulb size={12} /> Expert Tips
                            </h3>
                            <ul className="space-y-1">
                                {advice.tips.map((tip: string, i: number) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-0.5">✦</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {/* Alternative Crops */}
                    {advice.alternativeCrops?.length > 0 && (
                        <Card className="p-4">
                            <h3 className="text-xs font-bold mb-3 flex items-center gap-1">
                                <TrendingUp size={12} /> Alternative Crops
                            </h3>
                            <div className="space-y-2">
                                {advice.alternativeCrops.map((alt: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm font-bold w-24">{alt.name}</span>
                                        <div className="flex-1 bg-muted rounded-full h-2">
                                            <div
                                                className="bg-amber-500 h-2 rounded-full"
                                                style={{ width: `${alt.demandScore}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-12 text-right">{alt.demandScore}%</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </motion.div>
            )}
        </div>
    )
}

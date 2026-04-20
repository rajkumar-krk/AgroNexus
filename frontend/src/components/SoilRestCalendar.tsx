import { useState } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Leaf, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { api } from '../lib/api'

export function SoilRestCalendar() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    async function fetchSoilAdvice() {
        setLoading(true)
        try {
            const result = await api.getSoilRestAdvice({
                cropHistory: [
                    { crop: 'Rice', seasons: 3 },
                    { crop: 'Wheat', seasons: 2 },
                    { crop: 'Rice', seasons: 1 },
                ],
                soilType: 'Black Cotton',
                location: 'Telangana, India',
            })
            setData(result)
        } catch (err) {
            console.error('Soil rest error:', err)
        } finally {
            setLoading(false)
        }
    }

    function getRiskColor(risk: string) {
        if (risk === 'high') return 'text-red-600 bg-red-50 border-red-200'
        if (risk === 'medium') return 'text-amber-600 bg-amber-50 border-amber-200'
        return 'text-green-600 bg-green-50 border-green-200'
    }

    function getNutrientColor(level: string) {
        if (level === 'low') return 'bg-red-500'
        if (level === 'medium') return 'bg-amber-500'
        return 'bg-green-500'
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                    <span className="text-2xl">📅</span> Soil Rest Calendar
                </h2>
                <Button size="sm" onClick={fetchSoilAdvice} disabled={loading} className="gap-1">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Leaf size={14} />}
                    Analyze Soil
                </Button>
            </div>

            {loading ? (
                <Card className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <p className="text-sm text-muted-foreground">Gemini AI analyzing your soil history...</p>
                </Card>
            ) : data ? (
                <div className="space-y-3">
                    {/* Health Score + Risk */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="p-4 text-center">
                            <div className="text-3xl font-heading font-bold text-primary">{data.soilHealthScore}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Soil Health Score</p>
                        </Card>
                        <Card className={`p-4 text-center border ${getRiskColor(data.overCroppingRisk)}`}>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                {data.overCroppingRisk === 'high' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                            </div>
                            <div className="text-sm font-bold capitalize">{data.overCroppingRisk} Risk</div>
                            <p className="text-[10px] mt-1">Over-Cropping</p>
                        </Card>
                    </div>

                    {/* Nutrient Status */}
                    {data.currentNutrientStatus && (
                        <Card className="p-4">
                            <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-wider">Nutrient Status</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(data.currentNutrientStatus).map(([nutrient, level]) => (
                                    <div key={nutrient} className="text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${getNutrientColor(level as string)}`} />
                                        <div className="text-xs font-bold capitalize">{nutrient}</div>
                                        <div className="text-[10px] text-muted-foreground capitalize">{level as string}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Rotation Plan */}
                    {data.rotationPlan && (
                        <Card className="p-4">
                            <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-wider">Recommended Rotation Plan</h3>
                            <div className="space-y-2">
                                {data.rotationPlan.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                        <Badge className="bg-primary/10 text-primary text-[10px] shrink-0">{item.season}</Badge>
                                        <ArrowRight size={12} className="text-muted-foreground shrink-0" />
                                        <div>
                                            <span className="text-sm font-bold">{item.recommendedCrop}</span>
                                            <p className="text-[10px] text-muted-foreground">{item.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Green Manure Suggestion */}
                    {data.greenManureSuggestion && (
                        <Card className="p-3 bg-green-50 border-green-200">
                            <p className="text-xs text-green-800">🌿 <strong>Green Manure:</strong> {data.greenManureSuggestion}</p>
                        </Card>
                    )}

                    {/* Rest Recommendation */}
                    {data.restRecommendation && (
                        <Card className="p-3 bg-sky-50 border-sky-200">
                            <p className="text-xs text-sky-800">💡 <strong>Advice:</strong> {data.restRecommendation}</p>
                        </Card>
                    )}
                </div>
            ) : (
                <Card className="p-6 text-center">
                    <Leaf className="mx-auto mb-2 text-muted-foreground" size={24} />
                    <p className="text-sm text-muted-foreground">Click "Analyze Soil" to get AI-powered rotation recommendations</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Based on your crop history: Rice (3 seasons) → Wheat (2) → Rice (1)</p>
                </Card>
            )}
        </section>
    )
}

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Droplets, Wind, CloudRain, Sun, CloudSun, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

export function SprayWindow() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [cropName, setCropName] = useState('Cotton')

    useEffect(() => {
        fetchSprayWindows()
    }, [])

    async function fetchSprayWindows() {
        setLoading(true)
        try {
            // Build mock weather data for prompt context
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            const weatherData = days.map((day, i) => ({
                day,
                date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN'),
                tempMax: 28 + Math.floor(Math.random() * 8),
                tempMin: 16 + Math.floor(Math.random() * 6),
                humidity: 40 + Math.floor(Math.random() * 40),
                windSpeed: 5 + Math.floor(Math.random() * 15),
                rainChance: Math.floor(Math.random() * 60),
            }))

            const result = await api.getSprayWindows({ weatherData, cropName, pesticideType: 'General purpose' })
            setData(result)
        } catch (err) {
            console.error('Spray window error:', err)
        } finally {
            setLoading(false)
        }
    }

    function getRatingColor(rating: string) {
        if (rating === 'excellent') return 'bg-green-100 text-green-700 border-green-300'
        if (rating === 'good') return 'bg-amber-100 text-amber-700 border-amber-300'
        return 'bg-red-100 text-red-700 border-red-300'
    }

    function getRatingIcon(rating: string) {
        if (rating === 'excellent') return <Sun size={14} className="text-green-600" />
        if (rating === 'good') return <CloudSun size={14} className="text-amber-600" />
        return <CloudRain size={14} className="text-red-600" />
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                    <span className="text-2xl">🧪</span> Spray Window Predictor
                </h2>
                <div className="flex items-center gap-2">
                    <select
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                        value={cropName}
                        onChange={e => { setCropName(e.target.value) }}
                    >
                        <option value="Cotton">Cotton</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Soybean">Soybean</option>
                    </select>
                    <Button size="sm" onClick={fetchSprayWindows} disabled={loading} className="gap-1 text-xs">
                        {loading ? <Loader2 size={12} className="animate-spin" /> : <Droplets size={12} />}
                        Analyze
                    </Button>
                </div>
            </div>

            {loading ? (
                <Card className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <p className="text-sm text-muted-foreground">Gemini AI analyzing spray conditions...</p>
                </Card>
            ) : data ? (
                <div className="space-y-3">
                    {/* Best Window Highlight */}
                    {data.bestWindow && (
                        <Card className="p-3 bg-green-50 border-green-200">
                            <div className="flex items-center gap-2">
                                <Sun size={16} className="text-green-600" />
                                <div>
                                    <span className="text-xs font-bold text-green-800">🎯 Best Spray Window This Week</span>
                                    <p className="text-xs text-green-700">{data.bestWindow}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* 7-Day Grid */}
                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {(data.windows || []).slice(0, 7).map((day: any, i: number) => (
                            <Card key={i} className={`p-3 ${day.overallRating === 'avoid' ? 'opacity-60' : ''}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-xs">{day.day}</span>
                                    <Badge className={`text-[9px] ${getRatingColor(day.overallRating)}`}>
                                        {day.overallRating?.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-[10px] text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Wind size={10} /> {day.windSpeed || '—'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Droplets size={10} /> {day.humidity || '—'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CloudRain size={10} /> Rain: {day.rainChance || '—'}
                                    </div>
                                </div>
                                {/* Time slots */}
                                {(day.slots || []).slice(0, 2).map((slot: any, j: number) => (
                                    <div key={j} className={`mt-2 px-2 py-1 rounded text-[10px] border ${getRatingColor(slot.rating)}`}>
                                        {getRatingIcon(slot.rating)} {slot.time}
                                    </div>
                                ))}
                            </Card>
                        ))}
                    </div>

                    {/* Chemical Tip */}
                    {data.chemicalTip && (
                        <Card className="p-3 bg-sky-50 border-sky-200">
                            <p className="text-xs text-sky-800">💡 <strong>Pro Tip:</strong> {data.chemicalTip}</p>
                        </Card>
                    )}
                </div>
            ) : (
                <Card className="p-6 text-center text-muted-foreground text-sm">
                    Click "Analyze" to get AI-powered spray window predictions
                </Card>
            )}
        </section>
    )
}

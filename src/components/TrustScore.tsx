import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Star, Shield, Clock, CheckCircle2, Award, TrendingUp } from 'lucide-react'
import { api } from '../lib/api'

interface TrustScoreData {
    overallScore: number
    ordersCompleted: number
    disputeRate: number
    responseTime: string
    consistency: number
    platformAge: string
    badges: string[]
}

export function TrustScore({ userId = 'demo-user' }: { userId?: string }) {
    const [data, setData] = useState<TrustScoreData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getTrustScore(userId)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [userId])

    function getScoreColor(score: number) {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-amber-600'
        return 'text-red-600'
    }

    function getScoreLabel(score: number) {
        if (score >= 90) return 'Excellent'
        if (score >= 80) return 'Very Good'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Needs Improvement'
    }

    function getStars(score: number) {
        const stars = Math.round(score / 20)
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
            />
        ))
    }

    if (loading) return <Card className="p-4 text-center text-sm text-muted-foreground">Loading trust score...</Card>
    if (!data) return null

    return (
        <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-primary" />
                <h3 className="font-heading font-bold text-sm">Farmer Trust Score</h3>
            </div>

            {/* Score Circle */}
            <div className="text-center mb-4">
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${data.overallScore}, 100`}
                            className={getScoreColor(data.overallScore)}
                        />
                    </svg>
                    <span className={`absolute text-lg font-heading font-bold ${getScoreColor(data.overallScore)}`}>
                        {data.overallScore}
                    </span>
                </div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                    {getStars(data.overallScore)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(data.overallScore)}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-center mb-4">
                <div className="p-2 bg-muted/30 rounded-lg">
                    <CheckCircle2 size={12} className="mx-auto text-green-600 mb-0.5" />
                    <div className="text-sm font-bold">{data.ordersCompleted}</div>
                    <div className="text-[9px] text-muted-foreground">Orders Done</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                    <TrendingUp size={12} className="mx-auto text-primary mb-0.5" />
                    <div className="text-sm font-bold">{data.consistency}%</div>
                    <div className="text-[9px] text-muted-foreground">Consistency</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                    <Clock size={12} className="mx-auto text-amber-600 mb-0.5" />
                    <div className="text-sm font-bold">{data.responseTime}</div>
                    <div className="text-[9px] text-muted-foreground">Response</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                    <Award size={12} className="mx-auto text-purple-600 mb-0.5" />
                    <div className="text-sm font-bold">{data.platformAge}</div>
                    <div className="text-[9px] text-muted-foreground">On Platform</div>
                </div>
            </div>

            {/* Badges */}
            {data.badges?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {data.badges.map((badge, i) => (
                        <Badge key={i} className="text-[9px] bg-primary/10 text-primary border-primary/20">
                            ✦ {badge}
                        </Badge>
                    ))}
                </div>
            )}
        </Card>
    )
}

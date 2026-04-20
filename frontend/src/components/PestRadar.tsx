import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { AlertTriangle, Bug, MapPin, Clock, Radio, Plus, X, Shield } from 'lucide-react'
import { api } from '../lib/api'

interface PestReport {
    _id?: string
    pestName: string
    severity: string
    cropAffected: string
    location: string
    distance: number
    reportedAt: string
    reporter: string
    verified: boolean
}

export function PestRadar() {
    const [reports, setReports] = useState<PestReport[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ pestName: '', severity: 'medium', cropAffected: '', location: '' })

    useEffect(() => {
        loadReports()
    }, [])

    async function loadReports() {
        try {
            // Seed on first load, then get all
            await api.seedPestReports()
            const data = await api.getPestReports()
            setReports(data)
        } catch (err) {
            console.error('Pest reports error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit() {
        if (!form.pestName || !form.cropAffected) return
        try {
            const newReport = await api.submitPestReport({
                ...form,
                lat: 17.38 + Math.random() * 2,
                lng: 78.48 + Math.random() * 2,
                distance: Math.floor(Math.random() * 50),
                reporter: 'You',
            })
            setReports(prev => [newReport, ...prev])
            setShowForm(false)
            setForm({ pestName: '', severity: 'medium', cropAffected: '', location: '' })
        } catch (err) {
            console.error('Submit pest report error:', err)
        }
    }

    function getTimeSince(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime()
        const hours = Math.floor(diff / 3600000)
        if (hours < 1) return 'Just now'
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    function getSeverityColor(severity: string) {
        if (severity === 'high') return 'bg-red-100 text-red-700 border-red-200'
        if (severity === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200'
        return 'bg-green-100 text-green-700 border-green-200'
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                    <span className="text-2xl">🦟</span> Pest Migration Radar
                </h2>
                <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
                    {showForm ? <X size={14} /> : <Plus size={14} />}
                    {showForm ? 'Cancel' : 'Report Pest'}
                </Button>
            </div>

            {/* Report Form */}
            {showForm && (
                <Card className="p-4 mb-4 border-amber-200 bg-amber-50/50">
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-600" /> Report a Pest Sighting
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            placeholder="Pest name (e.g. Fall Armyworm)"
                            value={form.pestName}
                            onChange={e => setForm({ ...form, pestName: e.target.value })}
                        />
                        <Input
                            placeholder="Crop affected"
                            value={form.cropAffected}
                            onChange={e => setForm({ ...form, cropAffected: e.target.value })}
                        />
                        <Input
                            placeholder="Your location"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                        />
                        <select
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={form.severity}
                            onChange={e => setForm({ ...form, severity: e.target.value })}
                        >
                            <option value="low">Low Severity</option>
                            <option value="medium">Medium Severity</option>
                            <option value="high">High Severity</option>
                        </select>
                    </div>
                    <Button onClick={handleSubmit} className="mt-3 w-full" size="sm">
                        📡 Broadcast to Nearby Farmers
                    </Button>
                </Card>
            )}

            {/* Radar Display */}
            {loading ? (
                <Card className="p-6 text-center text-muted-foreground">Loading pest data...</Card>
            ) : (
                <div className="space-y-3">
                    {/* Alert Banner */}
                    {reports.some(r => r.severity === 'high') && (
                        <Card className="p-3 bg-red-50 border-red-200">
                            <div className="flex items-center gap-2 text-red-700">
                                <Radio size={14} className="animate-pulse" />
                                <span className="text-xs font-bold">⚠️ HIGH SEVERITY PEST ALERT — {reports.filter(r => r.severity === 'high').length} critical reports within 50km</span>
                            </div>
                        </Card>
                    )}

                    {/* Reports Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {reports.map((report, i) => (
                            <Card key={report._id || i} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Bug size={16} className="text-amber-600" />
                                        <span className="font-bold text-sm">{report.pestName}</span>
                                    </div>
                                    <Badge className={`text-[10px] ${getSeverityColor(report.severity)}`}>
                                        {report.severity.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <span>🌾</span> {report.cropAffected}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} /> {report.location} · <strong>{report.distance}km away</strong>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} /> {getTimeSince(report.reportedAt)}
                                        </span>
                                        {report.verified && (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <Shield size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar, Sprout, Sun, Timer } from 'lucide-react'

interface CropTimeline {
    id: string
    name: string
    variety: string
    plantedDate: string
    expectedHarvest: string
    daysRemaining: number
    progressPercent: number
    status: 'growing' | 'near-harvest' | 'overdue' | 'harvested'
    area: string
}

const cropTimelines: CropTimeline[] = [
    {
        id: '1',
        name: 'Wheat',
        variety: 'HD-2967',
        plantedDate: '2025-11-15',
        expectedHarvest: '2026-03-20',
        daysRemaining: 25,
        progressPercent: 78,
        status: 'growing',
        area: '2.5 acres',
    },
    {
        id: '2',
        name: 'Cotton',
        variety: 'Bt Cotton',
        plantedDate: '2025-10-01',
        expectedHarvest: '2026-02-28',
        daysRemaining: 5,
        progressPercent: 96,
        status: 'near-harvest',
        area: '3 acres',
    },
    {
        id: '3',
        name: 'Soybean',
        variety: 'JS-9560',
        plantedDate: '2025-12-10',
        expectedHarvest: '2026-04-15',
        daysRemaining: 51,
        progressPercent: 55,
        status: 'growing',
        area: '1.5 acres',
    },
]

const statusConfig = {
    growing: { color: 'bg-sprout', badge: 'bg-sprout/10 text-primary border-sprout/20', label: 'Growing' },
    'near-harvest': { color: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Near Harvest' },
    overdue: { color: 'bg-destructive', badge: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Overdue' },
    harvested: { color: 'bg-sky', badge: 'bg-sky/10 text-sky border-sky/20', label: 'Harvested' },
}

export function CropCalendar() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Calendar size={20} className="text-primary" /> Crop Calendar
                </h3>
                <Badge variant="outline" className="text-[10px] font-bold">
                    {cropTimelines.length} Active Crops
                </Badge>
            </div>

            <div className="space-y-2">
                {cropTimelines.map((crop) => {
                    const config = statusConfig[crop.status]
                    return (
                        <Card
                            key={crop.id}
                            className="p-4 hover:border-primary/20 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                                        {crop.name === 'Wheat' ? '🌾' : crop.name === 'Cotton' ? '☁️' : '🫘'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm">{crop.name}</h4>
                                            <span className="text-[10px] text-muted-foreground font-medium">{crop.variety}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            {crop.area} • Planted {new Date(crop.plantedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`${config.badge} text-[10px] font-bold`}>
                                    {config.label}
                                </Badge>
                            </div>

                            {/* Timeline Bar */}
                            <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${config.color} rounded-full transition-all duration-700`}
                                    style={{ width: `${crop.progressPercent}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Sprout size={12} />
                                    <span className="text-[10px] font-bold">
                                        {new Date(crop.plantedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Timer size={12} />
                                    <span className="text-[10px] font-bold">
                                        {crop.daysRemaining > 0 ? `${crop.daysRemaining}d remaining` : 'Ready!'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Sun size={12} />
                                    <span className="text-[10px] font-bold">
                                        {new Date(crop.expectedHarvest).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

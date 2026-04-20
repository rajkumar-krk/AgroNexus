import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { StatusBadge } from './StatusBadge'
import { Progress } from '../ui/progress'
import { 
  Thermometer, 
  Droplets, 
  Battery, 
  Wifi,
  Activity,
  Clock
} from 'lucide-react'

export function DeviceStatusCard({ 
  device,
  className = '',
  onClick
}) {
  const batteryColor = device.battery > 60 ? 'text-green-600' : 
                     device.battery > 30 ? 'text-yellow-600' : 'text-red-600'

  return (
    <Card 
      className={`p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity size={20} className="text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm">{device.name}</span>
            <Badge variant="outline" className="text-[9px] font-bold">
              {device.id}
            </Badge>
            <StatusBadge status={device.status} />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            {device.temperature !== undefined && (
              <div className="flex items-center gap-1">
                <Thermometer size={12} className="text-muted-foreground" />
                <span>{device.temperature}°C</span>
              </div>
            )}
            
            {device.humidity !== undefined && (
              <div className="flex items-center gap-1">
                <Droplets size={12} className="text-muted-foreground" />
                <span>{device.humidity}%</span>
              </div>
            )}
            
            {device.battery !== undefined && (
              <div className="flex items-center gap-1">
                <Battery size={12} className={batteryColor} />
                <span className={batteryColor}>{device.battery}%</span>
              </div>
            )}
            
            {device.lastUpdate && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-muted-foreground" />
                <span>{device.lastUpdate}</span>
              </div>
            )}
          </div>
          
          {device.capacity !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{device.capacity}%</span>
              </div>
              <Progress 
                value={device.capacity} 
                className="h-1.5"
              />
            </div>
          )}
          
          {device.compressorHealth && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Compressor:</span>
              <StatusBadge 
                status={device.compressorHealth === 'Excellent' ? 'optimal' : 'good'}
                showIcon={false}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

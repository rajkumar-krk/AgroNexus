import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Clock,
  Check,
  X
} from 'lucide-react'

const alertConfig = {
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800',
    iconColor: 'text-red-500',
    badgeVariant: 'destructive'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800',
    iconColor: 'text-amber-500',
    badgeVariant: 'secondary'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800',
    iconColor: 'text-blue-500',
    badgeVariant: 'outline'
  },
  success: {
    icon: CheckCircle2,
    className: 'border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800',
    iconColor: 'text-green-500',
    badgeVariant: 'default'
  }
}

export function AlertItem({ 
  alert, 
  onAcknowledge, 
  onResolve,
  showActions = true 
}) {
  const config = alertConfig[alert.type] || alertConfig.info
  const Icon = config.icon

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Card className={`p-4 transition-all duration-200 hover:shadow-md ${config.className}`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`${config.iconColor} mt-0.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">{alert.title}</span>
            <Badge variant={config.badgeVariant} className="text-[9px] font-bold">
              {alert.severity || 'medium'}
            </Badge>
            {alert.acknowledged && (
              <Badge variant="outline" className="text-[9px] font-bold">
                <Check size={10} className="mr-1" />
                Acknowledged
              </Badge>
            )}
            {alert.resolved && (
              <Badge variant="default" className="text-[9px] font-bold">
                <Check size={10} className="mr-1" />
                Resolved
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{formatTime(alert.timestamp)}</span>
              {alert.deviceId && alert.deviceId !== 'SYSTEM' && (
                <span>• {alert.deviceId}</span>
              )}
            </div>
            
            {showActions && !alert.resolved && (
              <div className="flex items-center gap-2">
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAcknowledge?.(alert.id)}
                    className="text-xs h-7 px-2"
                  >
                    Acknowledge
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => onResolve?.(alert.id)}
                  className="text-xs h-7 px-2"
                >
                  Resolve
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

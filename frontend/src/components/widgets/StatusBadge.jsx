import React from 'react'
import { Badge } from '../ui/badge'
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'

const statusConfig = {
  online: {
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  },
  offline: {
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  warning: {
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle
  },
  optimal: {
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  },
  good: {
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle2
  },
  loading: {
    variant: 'outline',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock
  }
}

export function StatusBadge({ status, children, showIcon = true, className = '' }) {
  const config = statusConfig[status] || statusConfig.loading
  const Icon = config.icon

  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center gap-1 font-medium ${config.className} ${className}`}
    >
      {showIcon && <Icon size={12} />}
      {children || status}
    </Badge>
  )
}

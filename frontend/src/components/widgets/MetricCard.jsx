import React from 'react'
import { Card } from '../ui/card'

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'text-primary', 
  trend,
  subtitle,
  className = '' 
}) {
  return (
    <Card className={`p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon size={20} className={color} />}
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {title}
            </span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${
                trend.type === 'up' ? 'text-green-600' : 
                trend.type === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend.type === 'up' ? '↑' : trend.type === 'down' ? '↓' : '→'} {trend.value}
              </span>
              <span className="text-xs text-muted-foreground">{trend.period}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

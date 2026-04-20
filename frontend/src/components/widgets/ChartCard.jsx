import React from 'react'
import { Card } from '../ui/card'

export function ChartCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  className = '',
  actions
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  )
}

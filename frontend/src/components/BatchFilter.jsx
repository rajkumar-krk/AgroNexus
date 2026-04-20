import React from 'react'
import { Filter, Package } from 'lucide-react'
import { useBatch } from '../context/BatchContext'

export function BatchFilter({ selectedBatch, onBatchChange, className = '' }) {
  const { batches, loading } = useBatch()

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Filter size={16} className="text-muted-foreground" />
        <div className="w-32 h-8 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Filter size={16} className="text-muted-foreground" />
      <select
        value={selectedBatch || 'all'}
        onChange={(e) => onBatchChange(e.target.value === 'all' ? null : e.target.value)}
        className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm focus:border-primary focus:outline-none"
      >
        <option value="all">All Batches ({batches.length})</option>
        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.cropName} - {batch.batchId}
          </option>
        ))}
      </select>
    </div>
  )
}

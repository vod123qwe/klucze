import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string
  sublabel?: string
  trend?: 'up' | 'down' | 'neutral'
  alert?: 'warning' | 'critical'
  className?: string
  accent?: boolean
  valueClassName?: string
}

export function KpiCard({
  label,
  value,
  sublabel,
  trend,
  alert,
  className,
  accent = false,
  valueClassName,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-border bg-card p-4 shadow-sm',
        alert === 'critical' && 'border-red-200 bg-red-50/50',
        alert === 'warning' && 'border-amber-200 bg-amber-50/50',
        className,
      )}
    >
      {accent && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-primary/50" />
      )}

      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {alert && (
          <AlertTriangle
            className={cn(
              'h-3.5 w-3.5 shrink-0',
              alert === 'critical' ? 'text-red-500' : 'text-amber-500',
            )}
          />
        )}
        {!alert && trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
        {!alert && trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
      </div>

      <p
        className={cn(
          'mt-1.5 text-2xl font-semibold tracking-tight',
          alert === 'critical' && 'text-red-600',
          alert === 'warning' && 'text-amber-700',
          valueClassName,
        )}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {value}
      </p>

      {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}

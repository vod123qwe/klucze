import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertBannerProps {
  variant?: 'warning' | 'critical' | 'info'
  children: React.ReactNode
  className?: string
}

export function AlertBanner({ variant = 'warning', children, className }: AlertBannerProps) {
  const config = {
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertTriangle,
      iconClass: 'text-amber-500',
    },
    critical: {
      bg: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle,
      iconClass: 'text-red-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconClass: 'text-blue-500',
    },
  }[variant]

  const Icon = config.icon

  return (
    <div className={cn('flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm', config.bg, className)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.iconClass)} />
      <div>{children}</div>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
import type { CostStatus, TrancheStatus, FitoutStatus } from '@/types'
import { cn } from '@/lib/utils'

type AnyStatus = CostStatus | TrancheStatus | FitoutStatus | 'todo' | 'in_progress' | 'done' | 'skipped' | 'planned'

const CONFIG: Record<string, { label: string; className: string }> = {
  planned: { label: 'Planowany', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  confirmed: { label: 'Potwierdzony', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid: { label: 'Zapłacony', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  applied: { label: 'Złożony wniosek', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  disbursed: { label: 'Wypłacona', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  idea: { label: 'Pomysł', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  decided: { label: 'Zdecydowane', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  ordered: { label: 'Zamówione', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  done: { label: 'Gotowe', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  todo: { label: 'Do zrobienia', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  in_progress: { label: 'W toku', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  skipped: { label: 'Pominięte', className: 'bg-slate-100 text-slate-400 border-slate-200' },
}

export function StatusBadge({ status }: { status: AnyStatus }) {
  const cfg = CONFIG[status] ?? { label: status, className: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <Badge
      variant="outline"
      className={cn('text-[11px] font-medium px-1.5 py-0', cfg.className)}
    >
      {cfg.label}
    </Badge>
  )
}

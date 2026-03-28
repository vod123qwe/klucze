'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2 } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatPLN, formatDate } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { KpiCard } from '@/components/shared/KpiCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { PurchaseCost, PurchaseCostCategory, CostStatus } from '@/types'
import { PURCHASE_COST_CATEGORY_LABELS, COST_STATUS_LABELS } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const STATUS_FILTER_OPTIONS: { value: CostStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'planned', label: 'Planowane' },
  { value: 'confirmed', label: 'Potwierdzone' },
  { value: 'paid', label: 'Zapłacone' },
]

function CostDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: PurchaseCost
}) {
  const [form, setForm] = useState<Omit<PurchaseCost, 'id'>>({
    name: existing?.name ?? '',
    category: existing?.category ?? 'property',
    amount: existing?.amount ?? 0,
    status: existing?.status ?? 'planned',
    dueDate: existing?.dueDate ?? null,
    note: existing?.note ?? '',
    linkedDocumentIds: existing?.linkedDocumentIds ?? [],
  })

  function set(field: keyof typeof form, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name || !form.amount) {
      toast.error('Podaj nazwę i kwotę')
      return
    }
    if (existing) {
      await db.purchaseCosts.update(existing.id, form)
      toast.success('Koszt zaktualizowany')
    } else {
      await db.purchaseCosts.add({ id: generateId(), ...form })
      toast.success('Koszt dodany')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edytuj koszt' : 'Dodaj koszt zakupu'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Nazwa</Label>
              <Input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="np. Cena mieszkania"
              />
            </div>
            <div>
              <Label className="text-xs">Kategoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set('category', v as PurchaseCostCategory)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PURCHASE_COST_CATEGORY_LABELS) as PurchaseCostCategory[]).map((c) => (
                    <SelectItem key={c} value={c}>{PURCHASE_COST_CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Kwota (zł)</Label>
              <Input
                type="number"
                value={form.amount || ''}
                onChange={(e) => set('amount', Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set('status', v as CostStatus)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(COST_STATUS_LABELS) as CostStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{COST_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Termin płatności</Label>
              <Input
                type="date"
                value={form.dueDate ?? ''}
                onChange={(e) => set('dueDate', e.target.value || null)}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Notatka</Label>
              <Textarea rows={2} value={form.note} onChange={(e) => set('note', e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function KosztyPage() {
  const costs = useLiveQuery(() => db.purchaseCosts.toArray(), [])
  const [dialog, setDialog] = useState<{ open: boolean; existing?: PurchaseCost }>({ open: false })
  const [statusFilter, setStatusFilter] = useState<CostStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<PurchaseCostCategory | 'all'>('all')

  const filtered = costs?.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false
    return true
  }) ?? []

  const totalAll = costs?.reduce((s, c) => s + c.amount, 0) ?? 0
  const totalConfirmed = costs?.filter(c => c.status === 'confirmed').reduce((s, c) => s + c.amount, 0) ?? 0
  const totalPaid = costs?.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0) ?? 0
  const totalPending = costs?.filter(c => c.status === 'planned').reduce((s, c) => s + c.amount, 0) ?? 0

  // Group by category
  const byCategory = filtered.reduce<Record<string, PurchaseCost[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})

  async function deleteCost(id: string) {
    await db.purchaseCosts.delete(id)
    toast.success('Usunięto')
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-4xl">
      <PageHeader
        title="Koszty zakupu"
        description="Wszystkie koszty związane z zakupem nieruchomości"
        actions={
          <Button size="sm" onClick={() => setDialog({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" />
            Dodaj koszt
          </Button>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
        <KpiCard label="Łączna kwota" value={formatPLN(totalAll)} accent />
        <KpiCard label="Planowane" value={formatPLN(totalPending)} />
        <KpiCard label="Potwierdzone" value={formatPLN(totalConfirmed)} />
        <KpiCard label="Zapłacone" value={formatPLN(totalPaid)} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <Badge
            key={opt.value}
            variant={statusFilter === opt.value ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </Badge>
        ))}
        <span className="mx-1 text-muted-foreground/40">|</span>
        <Badge
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer text-xs"
          onClick={() => setCategoryFilter('all')}
        >
          Wszystkie kategorie
        </Badge>
        {(Object.keys(PURCHASE_COST_CATEGORY_LABELS) as PurchaseCostCategory[]).map((c) => (
          <Badge
            key={c}
            variant={categoryFilter === c ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setCategoryFilter(c)}
          >
            {PURCHASE_COST_CATEGORY_LABELS[c]}
          </Badge>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <SectionEmptyState
          title="Brak kosztów"
          description="Dodaj pierwsze koszty zakupu — mieszkanie, garaż, notariusz, prowizje..."
          action={
            <Button size="sm" onClick={() => setDialog({ open: true })}>
              <Plus className="h-4 w-4 mr-1.5" />
              Dodaj koszt
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {(Object.keys(byCategory) as PurchaseCostCategory[]).map((cat) => (
            <div key={cat}>
              <div className="bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>{PURCHASE_COST_CATEGORY_LABELS[cat] ?? cat}</span>
                <span className="text-foreground font-semibold">
                  {formatPLN(byCategory[cat].reduce((s, c) => s + c.amount, 0))}
                </span>
              </div>
              {byCategory[cat].map((cost) => (
                <div
                  key={cost.id}
                  className="flex items-center gap-3 px-4 py-3 border-t border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{cost.name}</span>
                      <StatusBadge status={cost.status} />
                    </div>
                    {cost.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{cost.note}</p>
                    )}
                    {cost.dueDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">Termin: {formatDate(cost.dueDate)}</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-semibold shrink-0',
                      cost.status === 'paid' ? 'text-muted-foreground line-through' : '',
                    )}
                  >
                    {formatPLN(cost.amount)}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setDialog({ open: true, existing: cost })}
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteCost(cost.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Total footer */}
          <div className="flex items-center justify-between bg-muted/60 px-4 py-3 border-t font-semibold text-sm">
            <span>Łącznie (widoczne)</span>
            <span>{formatPLN(filtered.reduce((s, c) => s + c.amount, 0))}</span>
          </div>
        </div>
      )}

      <CostDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false })}
        existing={dialog.existing}
      />
    </div>
  )
}

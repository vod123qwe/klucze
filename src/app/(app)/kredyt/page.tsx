'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Calculator } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatPLN, formatDate } from '@/lib/utils/format'
import { calcEqualInstallment, calcDecreasingInstallment } from '@/lib/calculations/mortgage'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { KpiCard } from '@/components/shared/KpiCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { Mortgage, MortgageTranche, TrancheStatus } from '@/types'
import { TRANCHE_STATUS_LABELS } from '@/types'
import { toast } from 'sonner'

function MortgageForm({ mortgage, onSave }: { mortgage: Mortgage | null; onSave: (m: Mortgage) => void }) {
  const [form, setForm] = useState<Mortgage>(
    mortgage ?? {
      id: 'main',
      bankName: '',
      amount: 0,
      interestRate: 5.85,
      margin: 2.3,
      rateType: 'variable',
      periodMonths: 360,
      installmentType: 'equal',
      startDate: null,
      notes: '',
      linkedDocumentIds: [],
    },
  )

  const totalRate = form.interestRate + form.margin
  const installment = form.installmentType === 'equal'
    ? calcEqualInstallment(form.amount, totalRate, form.periodMonths)
    : calcDecreasingInstallment(form.amount, totalRate, form.periodMonths, 1)

  function set(field: keyof Mortgage, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label className="text-xs">Bank</Label>
          <Input
            value={form.bankName}
            onChange={(e) => set('bankName', e.target.value)}
            placeholder="np. PKO BP"
          />
        </div>
        <div>
          <Label className="text-xs">Kwota kredytu (zł)</Label>
          <Input
            type="number"
            value={form.amount || ''}
            onChange={(e) => set('amount', Number(e.target.value))}
            placeholder="500 000"
          />
        </div>
        <div>
          <Label className="text-xs">Okres (miesięcy)</Label>
          <Input
            type="number"
            value={form.periodMonths || ''}
            onChange={(e) => set('periodMonths', Number(e.target.value))}
            placeholder="360"
          />
        </div>
        <div>
          <Label className="text-xs">Stopa bazowa (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.interestRate || ''}
            onChange={(e) => set('interestRate', Number(e.target.value))}
            placeholder="5.85"
          />
        </div>
        <div>
          <Label className="text-xs">Marża banku (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.margin || ''}
            onChange={(e) => set('margin', Number(e.target.value))}
            placeholder="2.30"
          />
        </div>
        <div>
          <Label className="text-xs">Rodzaj stopy</Label>
          <Select
            value={form.rateType}
            onValueChange={(v) => set('rateType', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="variable">Zmienna (WIBOR)</SelectItem>
              <SelectItem value="fixed">Stała</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Rodzaj rat</Label>
          <Select
            value={form.installmentType}
            onValueChange={(v) => set('installmentType', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Równe (annuitetowe)</SelectItem>
              <SelectItem value="decreasing">Malejące</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Notatki</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={2}
            placeholder="Warunki, dodatkowe informacje..."
          />
        </div>
      </div>

      {/* Live calc preview */}
      {form.amount > 0 && (
        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Calculator className="h-3.5 w-3.5" /> Podgląd kalkulatora
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-muted-foreground">Łączna stopa:</span>
            <span className="font-medium">{totalRate.toFixed(2)}%</span>
            <span className="text-muted-foreground">
              {form.installmentType === 'equal' ? 'Rata równa:' : 'Rata pierwsza:'}
            </span>
            <span className="font-semibold text-primary">{formatPLN(installment)}</span>
            <span className="text-muted-foreground">Całość do spłaty:</span>
            <span className="font-medium">{formatPLN(installment * form.periodMonths)}</span>
          </div>
        </div>
      )}

      <Button className="w-full" onClick={() => onSave(form)}>
        Zapisz dane kredytu
      </Button>
    </div>
  )
}

function TrancheDialog({
  open,
  onClose,
  mortgageId,
  existing,
  nextIndex,
}: {
  open: boolean
  onClose: () => void
  mortgageId: string
  existing?: MortgageTranche
  nextIndex: number
}) {
  const [form, setForm] = useState<Omit<MortgageTranche, 'id'>>({
    mortgageId,
    index: existing?.index ?? nextIndex,
    plannedDate: existing?.plannedDate ?? '',
    amount: existing?.amount ?? 0,
    condition: existing?.condition ?? '',
    status: existing?.status ?? 'planned',
    actualDate: existing?.actualDate ?? null,
    notes: existing?.notes ?? '',
  })

  function set(field: keyof typeof form, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.plannedDate || !form.amount) {
      toast.error('Podaj datę i kwotę transzy')
      return
    }
    if (existing) {
      await db.mortgageTranches.update(existing.id, form)
    } else {
      await db.mortgageTranches.add({ id: generateId(), ...form })
    }
    toast.success('Transza zapisana')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edytuj transzę' : 'Dodaj transzę'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Planowana data</Label>
              <Input
                type="date"
                value={form.plannedDate}
                onChange={(e) => set('plannedDate', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Kwota (zł)</Label>
              <Input
                type="number"
                value={form.amount || ''}
                onChange={(e) => set('amount', Number(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Warunek uruchomienia</Label>
              <Input
                value={form.condition}
                onChange={(e) => set('condition', e.target.value)}
                placeholder="np. Zakończenie stanu surowego"
              />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as TrancheStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(TRANCHE_STATUS_LABELS) as TrancheStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{TRANCHE_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data faktyczna</Label>
              <Input
                type="date"
                value={form.actualDate ?? ''}
                onChange={(e) => set('actualDate', e.target.value || null)}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Notatki</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function KredytPage() {
  const mortgage = useLiveQuery(() => db.mortgage.get('main'))
  const tranches = useLiveQuery(() => db.mortgageTranches.orderBy('index').toArray(), [])
  const [trancheDialog, setTrancheDialog] = useState<{ open: boolean; existing?: MortgageTranche }>({ open: false })

  const totalRate = mortgage ? mortgage.interestRate + mortgage.margin : 0
  const installment = mortgage && mortgage.amount > 0
    ? mortgage.installmentType === 'equal'
      ? calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths)
      : calcDecreasingInstallment(mortgage.amount, totalRate, mortgage.periodMonths, 1)
    : 0
  const trancheTotal = tranches?.reduce((s, t) => s + t.amount, 0) ?? 0

  async function saveMortgage(m: Mortgage) {
    const existing = await db.mortgage.get('main')
    await db.mortgage.put(m)
    toast.success('Kredyt zapisany')
  }

  async function deleteTranche(id: string) {
    await db.mortgageTranches.delete(id)
    toast.success('Transza usunięta')
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-4xl">
      <PageHeader
        title="Kredyt"
        description="Parametry kredytu hipotecznego i harmonogram transz"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTrancheDialog({ open: true })}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Dodaj transzę
          </Button>
        }
      />

      {/* KPI strip */}
      {mortgage && mortgage.amount > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 px-0">
          <KpiCard
            label="Kwota kredytu"
            value={formatPLN(mortgage.amount)}
            accent
          />
          <KpiCard
            label="Łączna stopa"
            value={`${totalRate.toFixed(2)}%`}
            sublabel={`${mortgage.rateType === 'variable' ? 'Zmienna' : 'Stała'}`}
          />
          <KpiCard
            label={mortgage.installmentType === 'equal' ? 'Rata równa' : 'Rata 1.'}
            value={formatPLN(installment)}
            sublabel="po uruchomieniu pełnego kredytu"
          />
          <KpiCard
            label="Suma transz"
            value={formatPLN(trancheTotal)}
            alert={trancheTotal > 0 && trancheTotal !== mortgage.amount ? 'warning' : undefined}
            sublabel={trancheTotal !== mortgage.amount ? `różnica: ${formatPLN(mortgage.amount - trancheTotal)}` : 'zgodne z kwotą'}
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Mortgage form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Parametry kredytu</CardTitle>
          </CardHeader>
          <CardContent>
            {mortgage !== undefined && (
              <MortgageForm mortgage={mortgage ?? null} onSave={saveMortgage} />
            )}
          </CardContent>
        </Card>

        {/* Tranches */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Transze</CardTitle>
            <span className="text-xs text-muted-foreground">
              {tranches?.length ?? 0} transz(y)
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {!tranches || tranches.length === 0 ? (
              <div className="p-4">
                <SectionEmptyState
                  title="Brak transz"
                  description="Dodaj harmonogram transz kredytu"
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tranches.map((t, idx) => (
                  <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{formatPLN(t.amount)}</span>
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Planowana: {formatDate(t.plannedDate)}
                        {t.actualDate && t.actualDate !== t.plannedDate && (
                          <> · Faktyczna: {formatDate(t.actualDate)}</>
                        )}
                      </p>
                      {t.condition && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{t.condition}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setTrancheDialog({ open: true, existing: t })}
                      >
                        <span className="sr-only">Edytuj</span>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTranche(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">Suma transz</span>
                  <span className="font-semibold">{formatPLN(trancheTotal)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TrancheDialog
        open={trancheDialog.open}
        onClose={() => setTrancheDialog({ open: false })}
        mortgageId="main"
        existing={trancheDialog.existing}
        nextIndex={(tranches?.length ?? 0) + 1}
      />
    </div>
  )
}

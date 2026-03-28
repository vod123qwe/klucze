'use client'

import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatPLN, currentMonth, addMonths } from '@/lib/utils/format'
import { buildCashflowProjection } from '@/lib/calculations/cashflow'
import { PageHeader } from '@/components/shared/PageHeader'
import { KpiCard } from '@/components/shared/KpiCard'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import type { HouseholdIncome, HouseholdExpense } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const EXPENSE_CATEGORIES = [
  'Mieszkanie (wynajem/czynsz)',
  'Żywność',
  'Transport',
  'Rachunki',
  'Subskrypcje',
  'Ubrania',
  'Zdrowie',
  'Rozrywka',
  'Kredyty/raty',
  'Oszczędności',
  'Inne',
]

function IncomeDialog({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: HouseholdIncome }) {
  const [form, setForm] = useState<Omit<HouseholdIncome, 'id'>>({
    label: existing?.label ?? '',
    person: existing?.person ?? 'me',
    amountNet: existing?.amountNet ?? 0,
    frequency: existing?.frequency ?? 'monthly',
    activeFrom: existing?.activeFrom ?? currentMonth(),
    activeTo: existing?.activeTo ?? null,
  })

  function set(k: keyof typeof form, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!form.label || !form.amountNet) { toast.error('Podaj nazwę i kwotę'); return }
    if (existing) { await db.householdIncomes.update(existing.id, form) }
    else { await db.householdIncomes.add({ id: generateId(), ...form }) }
    toast.success('Zapisano'); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{existing ? 'Edytuj przychód' : 'Dodaj przychód'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Nazwa</Label>
              <Input value={form.label} onChange={e => set('label', e.target.value)} placeholder="np. Wynagrodzenie netto" />
            </div>
            <div>
              <Label className="text-xs">Osoba</Label>
              <Select value={form.person} onValueChange={v => set('person', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="me">Ja</SelectItem>
                  <SelectItem value="partner">Partner/ka</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Kwota netto (zł)</Label>
              <Input type="number" value={form.amountNet || ''} onChange={e => set('amountNet', Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs">Częstotliwość</Label>
              <Select value={form.frequency} onValueChange={v => set('frequency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Miesięcznie</SelectItem>
                  <SelectItem value="quarterly">Kwartalnie</SelectItem>
                  <SelectItem value="annual">Rocznie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Od (YYYY-MM)</Label>
              <Input value={form.activeFrom} onChange={e => set('activeFrom', e.target.value)} placeholder="2025-01" />
            </div>
          </div>
          <Button className="w-full" onClick={save}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ExpenseDialog({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: HouseholdExpense }) {
  const [form, setForm] = useState<Omit<HouseholdExpense, 'id'>>({
    label: existing?.label ?? '',
    category: existing?.category ?? 'Inne',
    amount: existing?.amount ?? 0,
    frequency: existing?.frequency ?? 'monthly',
    month: existing?.month ?? null,
    isLiability: existing?.isLiability ?? false,
  })

  function set(k: keyof typeof form, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!form.label || !form.amount) { toast.error('Podaj nazwę i kwotę'); return }
    if (existing) { await db.householdExpenses.update(existing.id, form) }
    else { await db.householdExpenses.add({ id: generateId(), ...form }) }
    toast.success('Zapisano'); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{existing ? 'Edytuj wydatek' : 'Dodaj wydatek'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Nazwa</Label>
              <Input value={form.label} onChange={e => set('label', e.target.value)} placeholder="np. Czynsz" />
            </div>
            <div>
              <Label className="text-xs">Kategoria</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Kwota (zł)</Label>
              <Input type="number" value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs">Częstotliwość</Label>
              <Select value={form.frequency} onValueChange={v => set('frequency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Miesięcznie</SelectItem>
                  <SelectItem value="quarterly">Kwartalnie</SelectItem>
                  <SelectItem value="annual">Rocznie</SelectItem>
                  <SelectItem value="oneTime">Jednorazowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.frequency === 'oneTime' && (
              <div>
                <Label className="text-xs">Miesiąc (YYYY-MM)</Label>
                <Input value={form.month ?? ''} onChange={e => set('month', e.target.value)} placeholder="2025-06" />
              </div>
            )}
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="liability"
                checked={form.isLiability}
                onCheckedChange={v => set('isLiability', !!v)}
              />
              <Label htmlFor="liability" className="text-xs cursor-pointer">Zobowiązanie kredytowe</Label>
            </div>
          </div>
          <Button className="w-full" onClick={save}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SavingsForm() {
  const plan = useLiveQuery(() => db.savingsPlan.get('main'))
  const [form, setForm] = useState({ initialSavings: 0, currentSavings: 0, safetyBuffer: 20000 })
  const [loaded, setLoaded] = useState(false)

  if (plan && !loaded) {
    setForm({ initialSavings: plan.initialSavings, currentSavings: plan.currentSavings, safetyBuffer: plan.safetyBuffer })
    setLoaded(true)
  }

  async function save() {
    await db.savingsPlan.update('main', { ...form, lastUpdated: new Date().toISOString() })
    toast.success('Zapisano')
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label className="text-xs">Obecne oszczędności (zł)</Label>
          <Input type="number" value={form.currentSavings || ''} onChange={e => setForm(p => ({ ...p, currentSavings: Number(e.target.value) }))} />
        </div>
        <div>
          <Label className="text-xs">Startowe oszczędności (na początek projekcji)</Label>
          <Input type="number" value={form.initialSavings || ''} onChange={e => setForm(p => ({ ...p, initialSavings: Number(e.target.value) }))} />
        </div>
        <div>
          <Label className="text-xs">Minimalna poduszka bezpieczeństwa (zł)</Label>
          <Input type="number" value={form.safetyBuffer || ''} onChange={e => setForm(p => ({ ...p, safetyBuffer: Number(e.target.value) }))} />
        </div>
      </div>
      <Button className="w-full" onClick={save}>Zapisz</Button>
    </div>
  )
}

export default function BudzetPage() {
  const incomes = useLiveQuery(() => db.householdIncomes.toArray(), [])
  const expenses = useLiveQuery(() => db.householdExpenses.toArray(), [])
  const savingsPlan = useLiveQuery(() => db.savingsPlan.get('main'), [])
  const mortgage = useLiveQuery(() => db.mortgage.get('main'), [])
  const tranches = useLiveQuery(() => db.mortgageTranches.toArray(), [])
  const [incDialog, setIncDialog] = useState<{ open: boolean; existing?: HouseholdIncome }>({ open: false })
  const [expDialog, setExpDialog] = useState<{ open: boolean; existing?: HouseholdExpense }>({ open: false })

  const totalMonthlyIncome = useMemo(() => {
    return incomes?.reduce((s, inc) => {
      if (inc.frequency === 'monthly') return s + inc.amountNet
      if (inc.frequency === 'quarterly') return s + inc.amountNet / 3
      if (inc.frequency === 'annual') return s + inc.amountNet / 12
      return s
    }, 0) ?? 0
  }, [incomes])

  const totalMonthlyExpenses = useMemo(() => {
    return expenses?.reduce((s, exp) => {
      if (exp.frequency === 'oneTime') return s
      if (exp.frequency === 'monthly') return s + exp.amount
      if (exp.frequency === 'quarterly') return s + exp.amount / 3
      if (exp.frequency === 'annual') return s + exp.amount / 12
      return s
    }, 0) ?? 0
  }, [expenses])

  const projection = useMemo(() => {
    if (!incomes || !expenses) return []
    return buildCashflowProjection(
      currentMonth(),
      36,
      incomes,
      expenses,
      mortgage ?? null,
      tranches ?? [],
      savingsPlan?.initialSavings ?? 0,
    )
  }, [incomes, expenses, mortgage, tranches, savingsPlan])

  async function deleteIncome(id: string) {
    await db.householdIncomes.delete(id)
    toast.success('Usunięto')
  }
  async function deleteExpense(id: string) {
    await db.householdExpenses.delete(id)
    toast.success('Usunięto')
  }

  return (
    <div className="px-6 py-5 max-w-5xl">
      <PageHeader
        title="Budżet domowy"
        description="Przychody, wydatki i projekcja oszczędności miesiąc po miesiącu"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIncDialog({ open: true })}>
              <Plus className="h-4 w-4 mr-1" />
              Przychód
            </Button>
            <Button size="sm" variant="outline" onClick={() => setExpDialog({ open: true })}>
              <Plus className="h-4 w-4 mr-1" />
              Wydatek
            </Button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
        <KpiCard
          label="Dochód miesięczny"
          value={formatPLN(totalMonthlyIncome)}
          accent
          trend="up"
        />
        <KpiCard
          label="Stałe wydatki"
          value={formatPLN(totalMonthlyExpenses)}
          trend="down"
        />
        <KpiCard
          label="Miesięczna nadwyżka"
          value={formatPLN(totalMonthlyIncome - totalMonthlyExpenses)}
          alert={(totalMonthlyIncome - totalMonthlyExpenses) < 0 ? 'critical' : undefined}
        />
        <KpiCard
          label="Oszczędności dziś"
          value={formatPLN(savingsPlan?.currentSavings ?? 0)}
        />
      </div>

      <Tabs defaultValue="cashflow">
        <TabsList className="mb-4">
          <TabsTrigger value="cashflow">Projekcja miesiąc/miesiąc</TabsTrigger>
          <TabsTrigger value="income">Przychody</TabsTrigger>
          <TabsTrigger value="expenses">Wydatki</TabsTrigger>
          <TabsTrigger value="savings">Oszczędności</TabsTrigger>
        </TabsList>

        {/* ── CASHFLOW TABLE ── */}
        <TabsContent value="cashflow">
          {projection.length === 0 ? (
            <SectionEmptyState
              title="Brak danych do projekcji"
              description="Dodaj przychody i wydatki, aby zobaczyć projekcję miesięczną"
            />
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground">
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider">Miesiąc</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Przychód</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Wydatki</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Kredyt</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Jednorazowe</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Odkładane</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider">Oszczędności</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projection.map((row) => (
                    <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2 font-medium">{row.month}</td>
                      <td className="px-3 py-2 text-right text-emerald-600">{formatPLN(row.totalIncome)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatPLN(row.fixedExpenses)}</td>
                      <td className={cn('px-3 py-2 text-right', row.mortgageLoad > 0 ? 'text-amber-600' : 'text-muted-foreground')}>
                        {row.mortgageLoad > 0 ? formatPLN(row.mortgageLoad) : '—'}
                      </td>
                      <td className={cn('px-3 py-2 text-right', row.oneTimeExpenses > 0 ? 'text-foreground' : 'text-muted-foreground')}>
                        {row.oneTimeExpenses > 0 ? formatPLN(row.oneTimeExpenses) : '—'}
                      </td>
                      <td className={cn('px-3 py-2 text-right font-semibold', row.savable >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                        {formatPLN(row.savable)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">{formatPLN(row.savingsEnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ── INCOMES ── */}
        <TabsContent value="income">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-sm">Przychody</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIncDialog({ open: true })}>
                <Plus className="h-4 w-4 mr-1" />Dodaj
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {!incomes || incomes.length === 0 ? (
                <div className="p-4">
                  <SectionEmptyState title="Brak przychodów" description="Dodaj wynagrodzenia i inne przychody" />
                </div>
              ) : (
                <div className="divide-y">
                  {incomes.map((inc) => (
                    <div key={inc.id} className="flex items-center gap-3 px-4 py-3">
                      <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{inc.label}</span>
                          <span className="text-[11px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                            {inc.person === 'me' ? 'Ja' : inc.person === 'partner' ? 'Partner/ka' : 'Inne'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {inc.frequency === 'monthly' ? 'miesięcznie' : inc.frequency === 'quarterly' ? 'kwartalnie' : 'rocznie'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{formatPLN(inc.amountNet)}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIncDialog({ open: true, existing: inc })}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => deleteIncome(inc.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                    <span>Łączny dochód miesięczny</span>
                    <span className="text-emerald-600">{formatPLN(totalMonthlyIncome)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── EXPENSES ── */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-sm">Wydatki</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setExpDialog({ open: true })}>
                <Plus className="h-4 w-4 mr-1" />Dodaj
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {!expenses || expenses.length === 0 ? (
                <div className="p-4">
                  <SectionEmptyState title="Brak wydatków" description="Dodaj stałe miesięczne wydatki" />
                </div>
              ) : (
                <div className="divide-y">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center gap-3 px-4 py-3">
                      <TrendingDown className="h-4 w-4 text-red-400 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{exp.label}</span>
                          <span className="text-[11px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{exp.category}</span>
                          {exp.isLiability && <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">zobowiązanie</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exp.frequency === 'monthly' ? 'miesięcznie' : exp.frequency === 'quarterly' ? 'kwartalnie' : exp.frequency === 'annual' ? 'rocznie' : `jednorazowo ${exp.month ?? ''}`}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{formatPLN(exp.amount)}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpDialog({ open: true, existing: exp })}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => deleteExpense(exp.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                    <span>Łączne wydatki miesięczne</span>
                    <span>{formatPLN(totalMonthlyExpenses)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SAVINGS ── */}
        <TabsContent value="savings">
          <Card className="max-w-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Oszczędności i poduszka</CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <IncomeDialog
        open={incDialog.open}
        onClose={() => setIncDialog({ open: false })}
        existing={incDialog.existing}
      />
      <ExpenseDialog
        open={expDialog.open}
        onClose={() => setExpDialog({ open: false })}
        existing={expDialog.existing}
      />
    </div>
  )
}

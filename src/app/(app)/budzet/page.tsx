'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, GripVertical, Settings2, Check, X } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatPLN, currentMonth, addMonths, formatDate } from '@/lib/utils/format'
import { buildCashflowProjection } from '@/lib/calculations/cashflow'
import { calcMortgageLoadForMonth } from '@/lib/calculations/mortgage'
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
import type { HouseholdIncome, HouseholdExpense, Mortgage, MortgageTranche, ExpenseCategory } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Category manager dialog ───────────────────────────────────────────────────

function CategoryManagerDialog({ open, onClose, categories }: {
  open: boolean
  onClose: () => void
  categories: ExpenseCategory[]
}) {
  const [newName, setNewName] = useState('')
  const [catDrag, setCatDrag] = useState<{ dragId: string; overId: string | null } | null>(null)

  async function addCategory() {
    const name = newName.trim()
    if (!name) return
    if (categories.some(c => c.id === name)) { toast.error('Kategoria już istnieje'); return }
    const maxIdx = Math.max(...categories.map(c => c.sortIndex), -1)
    await db.expenseCategories.add({ id: name, name, sortIndex: maxIdx + 1 })
    setNewName('')
    toast.success('Dodano kategorię')
  }

  async function deleteCategory(cat: ExpenseCategory) {
    const used = await db.householdExpenses.where('category').equals(cat.name).count()
    if (used > 0) { toast.error(`Kategoria ma ${used} wydatków — najpierw je przenieś`); return }
    await db.expenseCategories.delete(cat.id)
    toast.success('Usunięto')
  }

  async function dropCategory(dragId: string, overId: string) {
    if (dragId === overId) return
    const sorted = [...categories]
    const fi = sorted.findIndex(c => c.id === dragId)
    const ti = sorted.findIndex(c => c.id === overId)
    if (fi === -1 || ti === -1) return
    const [moved] = sorted.splice(fi, 1)
    sorted.splice(ti, 0, moved)
    await Promise.all(sorted.map((c, i) => db.expenseCategories.update(c.id, { sortIndex: i })))
    setCatDrag(null)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Kategorie wydatków</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nazwa nowej kategorii..."
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
            <Button size="sm" variant="outline" onClick={addCategory}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="divide-y rounded-lg border overflow-hidden text-sm">
            {categories.map(cat => {
              const isOver = catDrag?.overId === cat.id && catDrag.dragId !== cat.id
              return (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setCatDrag({ dragId: cat.id, overId: null }) }}
                  onDragOver={e => { e.preventDefault(); setCatDrag(d => d ? { ...d, overId: cat.id } : d) }}
                  onDrop={e => { e.preventDefault(); catDrag && dropCategory(catDrag.dragId, cat.id) }}
                  onDragEnd={() => setCatDrag(null)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 hover:bg-muted/30 transition-colors',
                    catDrag?.dragId === cat.id ? 'opacity-40' : '',
                    isOver ? 'border-t-2 border-primary' : '',
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab shrink-0" />
                  <span className="flex-1">{cat.name}</span>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => deleteCategory(cat)}
                    title="Usuń"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Inline editors ───────────────────────────────────────────────────────────

function InlineAmount({ value, onSave, className }: { value: number; onSave: (v: number) => Promise<void>; className?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  async function commit() {
    const num = parseFloat(draft.replace(',', '.'))
    if (!isNaN(num) && num !== value) await onSave(num)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        className={cn('w-24 text-right tabular-nums border-b-2 border-primary bg-transparent outline-none text-sm font-medium', className)}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit() } if (e.key === 'Escape') setEditing(false) }}
      />
    )
  }
  return (
    <button
      className={cn('tabular-nums font-medium rounded px-1 -mr-1 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer', className)}
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      title="Kliknij aby zmienić kwotę"
    >
      {formatPLN(value)}
    </button>
  )
}

function InlineLabel({ value, onSave }: { value: string; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  async function commit() {
    if (draft.trim() && draft.trim() !== value) await onSave(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        className="w-full border-b-2 border-primary bg-transparent outline-none text-sm"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit() } if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
      />
    )
  }
  return (
    <button
      className="text-left w-full hover:text-primary hover:underline cursor-pointer transition-colors"
      onClick={() => { setDraft(value); setEditing(true) }}
      title="Kliknij aby zmienić nazwę"
    >
      {value}
    </button>
  )
}

// ─── AddRow (module-level to prevent remount on parent state change) ──────────

function AddRow({
  addForm,
  setAddForm,
  onSave,
  onCancel,
}: {
  addForm: { label: string; amount: string }
  setAddForm: React.Dispatch<React.SetStateAction<{ label: string; amount: string }>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <tr className="bg-primary/5 border-t border-primary/20">
      <td className="px-2 w-5" />
      <td className="py-1.5 pr-1">
        <input
          autoFocus
          className="w-full border-b border-primary bg-transparent outline-none text-sm px-1"
          placeholder="Nazwa..."
          value={addForm.label}
          onChange={e => setAddForm(p => ({ ...p, label: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
        />
      </td>
      <td className="py-1.5 px-1 w-28">
        <input
          className="w-full border-b border-primary bg-transparent outline-none text-sm text-right px-1 tabular-nums"
          placeholder="0 zł"
          value={addForm.amount}
          onChange={e => setAddForm(p => ({ ...p, amount: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
        />
      </td>
      <td className="px-1 w-7">
        <div className="flex items-center gap-0.5">
          <button className="text-emerald-600 hover:text-emerald-700" onClick={onSave} title="Zatwierdź">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button className="text-muted-foreground hover:text-destructive" onClick={onCancel} title="Anuluj">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Undo/redo types ──────────────────────────────────────────────────────────

type UndoEntry =
  | { type: 'addExp';    record: HouseholdExpense }
  | { type: 'delExp';    record: HouseholdExpense }
  | { type: 'updateExp'; id: string; prev: Partial<HouseholdExpense>; next: Partial<HouseholdExpense> }
  | { type: 'addInc';    record: HouseholdIncome }
  | { type: 'delInc';    record: HouseholdIncome }
  | { type: 'updateInc'; id: string; prev: Partial<HouseholdIncome>; next: Partial<HouseholdIncome> }

// ─── Quick Add Dialog (oneTime, for current month) ────────────────────────────

function QuickAddDialog({
  open, onClose, mode, defaultCategory, categories, month,
  onAddedExp, onAddedInc,
}: {
  open: boolean
  onClose: () => void
  mode: 'income' | 'expense'
  defaultCategory?: string
  categories: string[]
  month: string
  onAddedExp: (r: HouseholdExpense) => void
  onAddedInc: (r: HouseholdIncome) => void
}) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(defaultCategory ?? categories[0] ?? 'Inne')
  const [person, setPerson] = useState<'me' | 'partner' | 'other'>('me')

  useEffect(() => {
    if (open) { setLabel(''); setAmount(''); setCategory(defaultCategory ?? categories[0] ?? 'Inne'); setPerson('me') }
  }, [open, defaultCategory, categories])

  async function save() {
    const amt = parseFloat(amount.replace(',', '.'))
    if (!label.trim() || isNaN(amt) || amt <= 0) return
    if (mode === 'expense') {
      const all = await db.householdExpenses.toArray()
      const maxIdx = Math.max(...all.map(e => e.sortIndex ?? 0), -1)
      const record: HouseholdExpense = {
        id: generateId(), label: label.trim(), category,
        amount: amt, frequency: 'oneTime', month, isLiability: false, sortIndex: maxIdx + 1,
      }
      await db.householdExpenses.add(record)
      onAddedExp(record)
      toast.success('Dodano wydatek')
    } else {
      const all = await db.householdIncomes.toArray()
      const maxIdx = Math.max(...all.map(e => e.sortIndex ?? 0), -1)
      const record: HouseholdIncome = {
        id: generateId(), label: label.trim(), person,
        amountNet: amt, frequency: 'oneTime', month, activeFrom: month, activeTo: null, sortIndex: maxIdx + 1,
      }
      await db.householdIncomes.add(record)
      onAddedInc(record)
      toast.success('Dodano przychód')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{mode === 'expense' ? 'Dodaj wydatek' : 'Dodaj przychód'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {mode === 'expense' && (
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Kategoria</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                      category === cat
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 border-border hover:bg-muted',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mode === 'income' && (
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Osoba</p>
              <div className="flex gap-2">
                {(['me', 'partner', 'other'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPerson(p)}
                    className={cn(
                      'flex-1 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      person === p
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 border-border hover:bg-muted',
                    )}
                  >
                    {p === 'me' ? 'Ja' : p === 'partner' ? 'Partner/ka' : 'Inne'}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nazwa</Label>
              <Input
                autoFocus
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder={mode === 'expense' ? 'np. Czynsz' : 'np. Wynagrodzenie'}
                onKeyDown={e => e.key === 'Enter' && save()}
              />
            </div>
            <div>
              <Label className="text-xs">Kwota (zł)</Label>
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                onKeyDown={e => e.key === 'Enter' && save()}
              />
            </div>
          </div>
          <Button className="w-full" onClick={save}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Monthly Overview ─────────────────────────────────────────────────────────

function MonthlyOverview({
  incomes,
  expenses,
  mortgage,
  tranches,
  categoryOrder,
  currentSavings,
}: {
  incomes: HouseholdIncome[]
  expenses: HouseholdExpense[]
  mortgage: Mortgage | null
  tranches: MortgageTranche[]
  categoryOrder: string[]
  currentSavings: number
}) {
  const [month, setMonth] = useState(currentMonth())
  const [drag, setDrag] = useState<{ dragId: string; overId: string | null } | null>(null)
  const [quickDialog, setQuickDialog] = useState<{ mode: 'income' | 'expense'; defaultCategory?: string } | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dupFrom, setDupFrom] = useState<string | null>(null)

  const undoStack = useRef<UndoEntry[]>([])
  const redoStack = useRef<UndoEntry[]>([])

  function pushUndo(entry: UndoEntry) {
    undoStack.current.push(entry)
    redoStack.current = []           // new action clears redo
  }

  const undo = useCallback(async () => {
    const entry = undoStack.current.pop()
    if (!entry) { toast('Brak akcji do cofnięcia'); return }
    if (entry.type === 'addExp') {
      redoStack.current.push({ type: 'delExp', record: entry.record })
      await db.householdExpenses.delete(entry.record.id)
    } else if (entry.type === 'delExp') {
      redoStack.current.push({ type: 'addExp', record: entry.record })
      await db.householdExpenses.put(entry.record)
    } else if (entry.type === 'updateExp') {
      redoStack.current.push({ type: 'updateExp', id: entry.id, prev: entry.next, next: entry.prev })
      await db.householdExpenses.update(entry.id, entry.prev)
    } else if (entry.type === 'addInc') {
      redoStack.current.push({ type: 'delInc', record: entry.record })
      await db.householdIncomes.delete(entry.record.id)
    } else if (entry.type === 'delInc') {
      redoStack.current.push({ type: 'addInc', record: entry.record })
      await db.householdIncomes.put(entry.record)
    } else if (entry.type === 'updateInc') {
      redoStack.current.push({ type: 'updateInc', id: entry.id, prev: entry.next, next: entry.prev })
      await db.householdIncomes.update(entry.id, entry.prev)
    }
    toast('Cofnięto')
  }, [])

  const redo = useCallback(async () => {
    const entry = redoStack.current.pop()
    if (!entry) { toast('Brak akcji do ponowienia'); return }
    if (entry.type === 'addExp') {
      undoStack.current.push({ type: 'delExp', record: entry.record })
      await db.householdExpenses.put(entry.record)
    } else if (entry.type === 'delExp') {
      undoStack.current.push({ type: 'addExp', record: entry.record })
      await db.householdExpenses.delete(entry.record.id)
    } else if (entry.type === 'updateExp') {
      undoStack.current.push({ type: 'updateExp', id: entry.id, prev: entry.next, next: entry.prev })
      await db.householdExpenses.update(entry.id, entry.prev)
    } else if (entry.type === 'addInc') {
      undoStack.current.push({ type: 'delInc', record: entry.record })
      await db.householdIncomes.put(entry.record)
    } else if (entry.type === 'delInc') {
      undoStack.current.push({ type: 'addInc', record: entry.record })
      await db.householdIncomes.delete(entry.record.id)
    } else if (entry.type === 'updateInc') {
      undoStack.current.push({ type: 'updateInc', id: entry.id, prev: entry.next, next: entry.prev })
      await db.householdIncomes.update(entry.id, entry.prev)
    }
    toast('Ponowiono')
  }, [])

  // Close quick dialog on month change
  useEffect(() => { setQuickDialog(null) }, [month])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'z' && e.shiftKey)  { e.preventDefault(); redo() }
      if (e.key === 'y')                { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const openedMonths = useLiveQuery(() => db.budgetMonths.toArray(), [])
  const base = currentMonth()
  const isLocked = month > base && !(openedMonths?.some(m => m.id === month))

  // Last 3 opened months before the current viewed month (for duplicate picker)
  const recentOpenedMonths = useMemo(() => {
    if (!openedMonths) return []
    return [...openedMonths]
      .filter(m => m.id < month)
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 3)
  }, [openedMonths, month])

  const canDelete = useMemo(() => {
    // Block deletion of months older than 3 months from today
    const cutoff = addMonths(base, -3)
    return month >= cutoff
  }, [month, base])

  const [deleteConfirm, setDeleteConfirm] = useState(false)

  async function deleteMonth() {
    // Remove all oneTime expenses and incomes for this month
    const expToDelete = await db.householdExpenses
      .filter(e => e.frequency === 'oneTime' && e.month === month)
      .toArray()
    await Promise.all(expToDelete.map(e => db.householdExpenses.delete(e.id)))
    const incToDelete = await db.householdIncomes
      .filter(i => i.frequency === 'oneTime' && i.month === month)
      .toArray()
    await Promise.all(incToDelete.map(i => db.householdIncomes.delete(i.id)))
    // Remove from budgetMonths (except base month — keep it open)
    if (month !== base) {
      await db.budgetMonths.delete(month)
    }
    setDeleteConfirm(false)
    toast.success('Rozliczenie zostało usunięte')
  }

  async function openFresh() {
    await db.budgetMonths.put({ id: month, openedAt: new Date().toISOString(), savedAmount: 0 })
    setOpenDialog(false)
    toast.success('Otwarto nowe rozliczenie')
  }

  async function openWithCopy(fromMonth: string) {
    const srcExp = await db.householdExpenses
      .filter(e => e.frequency === 'oneTime' && e.month === fromMonth)
      .toArray()
    for (const e of srcExp) {
      await db.householdExpenses.add({ ...e, id: generateId(), month })
    }
    const srcInc = await db.householdIncomes
      .filter(i => i.frequency === 'oneTime' && i.month === fromMonth)
      .toArray()
    for (const i of srcInc) {
      await db.householdIncomes.add({ ...i, id: generateId(), month })
    }
    const srcMonth = await db.budgetMonths.get(fromMonth)
    await db.budgetMonths.put({ id: month, openedAt: new Date().toISOString(), savedAmount: srcMonth?.savedAmount ?? 0 })
    setOpenDialog(false)
    setDupFrom(null)
    toast.success('Skopiowano wydatki i przychody')
  }

  // ── computed ──────────────────────────────────────────────────────────────────

  const monthlyIncomes = useMemo(() =>
    incomes.filter(inc => inc.frequency === 'oneTime' && inc.month === month)
  , [incomes, month])

  const totalIncome = useMemo(() =>
    monthlyIncomes.reduce((s, inc) => s + inc.amountNet, 0)
  , [monthlyIncomes])

  const monthlyExpenses = useMemo(() =>
    expenses.filter(e => e.frequency === 'oneTime' && e.month === month)
  , [expenses, month])

  const mortgageLoad = useMemo(() => {
    if (!mortgage || tranches.length === 0) return 0
    return calcMortgageLoadForMonth(mortgage, tranches, month)
  }, [mortgage, tranches, month])

  const grouped = useMemo(() => {
    const map = new Map<string, HouseholdExpense[]>()
    for (const exp of monthlyExpenses) {
      const cat = exp.category || 'Inne'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(exp)
    }
    for (const items of map.values()) items.sort((a, b) => (a.sortIndex ?? 999) - (b.sortIndex ?? 999))
    return [
      ...categoryOrder.filter(c => map.has(c)).map(c => ({ category: c, items: map.get(c)! })),
      ...[...map.entries()].filter(([c]) => !categoryOrder.includes(c)).map(([c, items]) => ({ category: c, items })),
    ]
  }, [monthlyExpenses, categoryOrder])

  const totalExpenses = useMemo(() =>
    monthlyExpenses.reduce((s, e) => s + e.amount, 0) + mortgageLoad
  , [monthlyExpenses, mortgageLoad])

  const savedAmount = useMemo(() =>
    openedMonths?.find(m => m.id === month)?.savedAmount ?? 0
  , [openedMonths, month])

  async function setSavedAmount(value: number) {
    await db.budgetMonths.update(month, { savedAmount: value })
  }

  const remainder = totalIncome - savedAmount - totalExpenses

  const monthLabel = useMemo(() => {
    try { return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long' }).format(new Date(month + '-01')).replace(/^\w/, c => c.toUpperCase()) }
    catch { return month }
  }, [month])

  // ── drag handlers (cross-category) ────────────────────────────────────────────

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.effectAllowed = 'move'
    setDrag({ dragId: id, overId: null })
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault()
    setDrag(d => d ? { ...d, overId } : d)
  }

  async function onDrop(e: React.DragEvent, overId: string, overCategory: string) {
    e.preventDefault()
    if (!drag || !drag.dragId || drag.dragId === overId) { setDrag(null); return }
    const { dragId } = drag

    // get all expenses globally sorted
    const all = await db.householdExpenses.toArray()
    all.sort((a, b) => (a.sortIndex ?? 999) - (b.sortIndex ?? 999))
    const fromIdx = all.findIndex(i => i.id === dragId)
    const toIdx   = all.findIndex(i => i.id === overId)
    if (fromIdx === -1 || toIdx === -1) { setDrag(null); return }

    const moved = all.splice(fromIdx, 1)[0]
    all.splice(toIdx, 0, moved)

    await Promise.all(all.map((item, idx) => {
      const updates: Partial<HouseholdExpense> = { sortIndex: idx }
      if (item.id === dragId) updates.category = overCategory
      return db.householdExpenses.update(item.id, updates)
    }))
    setDrag(null)
  }

  // ── add handlers ──────────────────────────────────────────────────────────────


  if (incomes.length === 0 && expenses.length === 0) {
    return <SectionEmptyState title="Brak danych budżetowych" description="Dodaj przychody i wydatki w zakładkach poniżej" />
  }

  const sortedIncomes = [...monthlyIncomes].sort((a, b) => (a.sortIndex ?? 99) - (b.sortIndex ?? 99))

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center gap-2">
        <Button
          size="sm" variant="outline" className="h-8 w-8 p-0"
          disabled={month <= base}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-base font-semibold min-w-[160px] text-center">{monthLabel}</span>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {!isLocked && (
          <Button
            size="sm" variant="ghost"
            className="h-8 w-8 p-0 ml-2 text-muted-foreground hover:text-destructive"
            disabled={!canDelete}
            title={canDelete ? 'Usuń rozliczenie tego miesiąca' : 'Nie można usunąć miesięcy starszych niż 3 miesiące'}
            onClick={() => setDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Usuń rozliczenie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Usunięcie rozliczenia <strong>{monthLabel}</strong> skasuje wszystkie jednorazowe wpisy wydatków z tego miesiąca
            {month !== base ? ' i wróci do ekranu blokady.' : '.'}
          </p>
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Anuluj</Button>
            <Button variant="destructive" onClick={deleteMonth}>Usuń</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Locked month screen ── */}
      {isLocked && (
        <>
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground text-sm">To rozliczenie nie zostało jeszcze otwarte.</p>
            <Button onClick={() => { setDupFrom(null); setOpenDialog(true) }}>
              Otwórz rozliczenie
            </Button>
          </div>

          <Dialog open={openDialog} onOpenChange={v => { setOpenDialog(v); if (!v) setDupFrom(null) }}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Otwórz {monthLabel}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 pt-1">

                {/* Fresh */}
                <Button variant="outline" className="justify-start h-auto py-3 px-4" onClick={openFresh}>
                  <div className="text-left">
                    <div className="font-medium">Zacznij od nowa</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Pusta lista — żadnych wpisów z poprzednich miesięcy</div>
                  </div>
                </Button>

                {/* Duplicate from month */}
                {recentOpenedMonths.length > 0 && (
                  <div className="rounded-lg border overflow-hidden">
                    <div className="px-3 py-2 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Zduplikuj jednorazowe wydatki z:
                    </div>
                    {recentOpenedMonths.map(m => {
                      const label = (() => {
                        try { return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long' }).format(new Date(m.id + '-01')).replace(/^\w/, c => c.toUpperCase()) }
                        catch { return m.id }
                      })()
                      return (
                        <button
                          key={m.id}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 text-sm border-t border-border/50 hover:bg-muted/30 transition-colors text-left',
                            dupFrom === m.id ? 'bg-primary/10 font-medium' : ''
                          )}
                          onClick={() => setDupFrom(m.id)}
                        >
                          <span>{label}</span>
                          {dupFrom === m.id && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      )
                    })}
                    <div className="px-3 py-2 border-t border-border/50">
                      <Button
                        size="sm" className="w-full"
                        disabled={!dupFrom}
                        onClick={() => dupFrom && openWithCopy(dupFrom)}
                      >
                        Zduplikuj
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {!isLocked && <>

      {/* ── Savings + remainder ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Odkładam w tym miesiącu</p>
          <InlineAmount
            value={savedAmount}
            onSave={setSavedAmount}
            className="text-2xl font-semibold tracking-tight text-violet-600"
          />
          <p className="mt-1 text-xs text-muted-foreground">Kliknij aby zmienić kwotę</p>
        </div>
        <KpiCard
          label="Zostaje na życie"
          value={formatPLN(remainder)}
          alert={remainder < 0 ? 'critical' : undefined}
          valueClassName={remainder >= 0 ? 'text-emerald-600' : undefined}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">

        {/* ── Przychody ── */}
        <div className="rounded-lg border overflow-hidden">
          <div className="px-4 py-2.5 font-semibold text-sm bg-emerald-600 text-white flex items-center justify-between">
            <span>Przychody</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums font-medium opacity-80">{formatPLN(totalIncome)}</span>
              <button
                className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
                onClick={() => setQuickDialog({ mode: 'income' })}
                title="Dodaj przychód"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {sortedIncomes.map(inc => (
                <tr key={inc.id} className="group border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-2 py-2 w-5" />
                  <td className="py-2.5 pr-2">
                    <InlineLabel
                      value={inc.label}
                      onSave={async v => {
                        pushUndo({ type: 'updateInc', id: inc.id, prev: { label: inc.label }, next: { label: v } })
                        await db.householdIncomes.update(inc.id, { label: v })
                      }}
                    />
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <InlineAmount
                      value={inc.amountNet}
                      onSave={async v => {
                        pushUndo({ type: 'updateInc', id: inc.id, prev: { amountNet: inc.amountNet }, next: { amountNet: v } })
                        await db.householdIncomes.update(inc.id, { amountNet: v })
                      }}
                    />
                  </td>
                  <td className="px-2 py-2 w-7">
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      title="Usuń"
                      onClick={async () => {
                        pushUndo({ type: 'delInc', record: inc })
                        await db.householdIncomes.delete(inc.id)
                        toast.success('Usunięto')
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 border-t-2 border-border">
                <td colSpan={2} className="px-4 py-2.5 font-bold text-sm">SUMA</td>
                <td colSpan={2} className="px-4 py-2.5 text-right font-bold text-emerald-600 tabular-nums">{formatPLN(totalIncome)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── Wydatki ── */}
        <div className="rounded-lg border overflow-hidden">
          <div className="px-4 py-2.5 font-semibold text-sm bg-rose-600 text-white flex items-center justify-between">
            <span>Wydatki</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums font-medium opacity-80">{formatPLN(totalExpenses)}</span>
              <button
                className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
                onClick={() => setQuickDialog({ mode: 'expense' })}
                title="Dodaj wydatek"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {grouped.map(({ category, items }) => (
                <React.Fragment key={category}>
                  <tr
                    key={`cat-${category}`}
                    className="group/cat bg-muted/60 cursor-pointer"
                    onClick={() => setQuickDialog({ mode: 'expense', defaultCategory: category })}
                  >
                    <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
                      {category}
                    </td>
                    <td className="px-2 py-1.5 w-7 text-right">
                      <Plus className="h-3 w-3 text-muted-foreground/0 group-hover/cat:text-muted-foreground/60 transition-colors ml-auto" />
                    </td>
                  </tr>
                  {items.map(exp => {
                    const isDragging = drag?.dragId === exp.id
                    const isOver    = drag?.overId === exp.id && !isDragging
                    return (
                      <tr
                        key={exp.id}
                        draggable
                        onDragStart={e => onDragStart(e, exp.id)}
                        onDragOver={e => onDragOver(e, exp.id)}
                        onDrop={e => onDrop(e, exp.id, category)}
                        onDragEnd={() => setDrag(null)}
                        className={cn(
                          'group border-t border-border/50 transition-colors',
                          isDragging ? 'opacity-40 bg-muted/40' : 'hover:bg-muted/30',
                          isOver ? 'border-t-2 border-t-primary' : '',
                        )}
                      >
                        <td className="px-2 py-2 w-5 text-muted-foreground/20 group-hover:text-muted-foreground/50">
                          <GripVertical className="h-3.5 w-3.5 cursor-grab active:cursor-grabbing" />
                        </td>
                        <td className="py-2.5 pr-2">
                          <InlineLabel
                            value={exp.label}
                            onSave={async v => {
                              pushUndo({ type: 'updateExp', id: exp.id, prev: { label: exp.label }, next: { label: v } })
                              await db.householdExpenses.update(exp.id, { label: v })
                            }}
                          />
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <InlineAmount
                            value={exp.amount}
                            onSave={async v => {
                              pushUndo({ type: 'updateExp', id: exp.id, prev: { amount: exp.amount }, next: { amount: v } })
                              await db.householdExpenses.update(exp.id, { amount: v })
                            }}
                          />
                        </td>
                        <td className="px-2 py-2 w-7">
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            title="Usuń"
                            onClick={async () => {
                              pushUndo({ type: 'delExp', record: exp })
                              await db.householdExpenses.delete(exp.id)
                              toast.success('Usunięto')
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
              {mortgageLoad > 0 && (
                <>
                  <tr className="bg-muted/60">
                    <td colSpan={4} className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">Kredyt hipoteczny</td>
                  </tr>
                  <tr className="border-t border-border/50 bg-amber-50/60 dark:bg-amber-950/20">
                    <td className="w-5 px-2" />
                    <td className="py-2.5 pr-2 text-amber-800 font-medium">Rata kredytu</td>
                    <td colSpan={2} className="px-2 py-2.5 text-right font-medium text-amber-800 tabular-nums">{formatPLN(mortgageLoad)}</td>
                  </tr>
                </>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 border-t-2 border-border">
                <td colSpan={2} className="px-4 py-2.5 font-bold text-sm">SUMA</td>
                <td colSpan={2} className="px-4 py-2.5 text-right font-bold tabular-nums">{formatPLN(totalExpenses)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <QuickAddDialog
        open={quickDialog !== null}
        onClose={() => setQuickDialog(null)}
        mode={quickDialog?.mode ?? 'expense'}
        defaultCategory={quickDialog?.defaultCategory}
        categories={categoryOrder}
        month={month}
        onAddedExp={r => pushUndo({ type: 'addExp', record: r })}
        onAddedInc={r => pushUndo({ type: 'addInc', record: r })}
      />
      </>}
    </div>
  )
}

// ─── Income / Expense dialogs ─────────────────────────────────────────────────

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

function ExpenseDialog({ open, onClose, existing, categories }: { open: boolean; onClose: () => void; existing?: HouseholdExpense; categories: string[] }) {
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
                  {categories.map(c => (
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
  const [form, setForm] = useState({ currentSavings: 0, safetyBuffer: 20000 })
  const [loaded, setLoaded] = useState(false)

  if (plan && !loaded) {
    setForm({ currentSavings: plan.currentSavings, safetyBuffer: plan.safetyBuffer })
    setLoaded(true)
  }

  async function save() {
    await db.savingsPlan.update('main', {
      ...form,
      initialSavings: form.currentSavings,
      lastUpdated: new Date().toISOString(),
    })
    toast.success('Zapisano')
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label className="text-xs">Obecne oszczędności (zł)</Label>
          <Input
            type="number"
            value={form.currentSavings || ''}
            onChange={e => setForm(p => ({ ...p, currentSavings: Number(e.target.value) }))}
          />
          <p className="text-[11px] text-muted-foreground mt-1">Punkt startowy projekcji</p>
        </div>
        <div>
          <Label className="text-xs">Minimalna poduszka bezpieczeństwa (zł)</Label>
          <Input
            type="number"
            value={form.safetyBuffer || ''}
            onChange={e => setForm(p => ({ ...p, safetyBuffer: Number(e.target.value) }))}
          />
        </div>
      </div>
      <Button className="w-full" onClick={save}>Zapisz</Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BudzetPage() {
  const incomes = useLiveQuery(() => db.householdIncomes.toArray(), [])
  const expenses = useLiveQuery(() => db.householdExpenses.toArray(), [])
  const savingsPlan = useLiveQuery(() => db.savingsPlan.get('main'), [])
  const mortgage = useLiveQuery(() => db.mortgage.get('main'), [])
  const tranches = useLiveQuery(() => db.mortgageTranches.toArray(), [])
  const budgetMonths = useLiveQuery(() => db.budgetMonths.toArray(), [])
  const dbCategories = useLiveQuery(() => db.expenseCategories.orderBy('sortIndex').toArray(), [])
  const categoryNames = useMemo(() => dbCategories?.map(c => c.name) ?? [], [dbCategories])
  const [incDialog, setIncDialog] = useState<{ open: boolean; existing?: HouseholdIncome }>({ open: false })
  const [expDialog, setExpDialog] = useState<{ open: boolean; existing?: HouseholdExpense }>({ open: false })
  const [catManagerOpen, setCatManagerOpen] = useState(false)

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
    const startSavings = savingsPlan?.currentSavings ?? 0
    const base = buildCashflowProjection(
      currentMonth(),
      36,
      incomes,
      expenses,
      mortgage ?? null,
      tranches ?? [],
      startSavings,
    )
    // For opened months replace savable/savingsEnd with actual savedAmount
    const bmMap = new Map(budgetMonths?.map(m => [m.id, m.savedAmount]) ?? [])
    let prev = startSavings
    return base.map(row => {
      const saved = bmMap.has(row.month) ? (bmMap.get(row.month) ?? 0) : row.savable
      const savingsEnd = prev + saved
      prev = savingsEnd
      return { ...row, savable: saved, savingsEnd }
    })
  }, [incomes, expenses, mortgage, tranches, savingsPlan, budgetMonths])

  async function deleteIncome(id: string) {
    await db.householdIncomes.delete(id)
    toast.success('Usunięto')
  }
  async function deleteExpense(id: string) {
    await db.householdExpenses.delete(id)
    toast.success('Usunięto')
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-5xl">
      <PageHeader
        title="Budżet domowy"
        description="Przychody, wydatki i projekcja oszczędności miesiąc po miesiącu"
        actions={
          <Button size="sm" variant="outline" onClick={() => setCatManagerOpen(true)}>
            <Settings2 className="h-4 w-4 mr-1" />
            Kategorie
          </Button>
        }
      />


      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Przegląd miesiąca</TabsTrigger>
          <TabsTrigger value="cashflow">Projekcja 36 mies.</TabsTrigger>
          <TabsTrigger value="income">Przychody</TabsTrigger>
          <TabsTrigger value="expenses">Wydatki</TabsTrigger>
          <TabsTrigger value="savings">Oszczędności</TabsTrigger>
        </TabsList>

        {/* ── MONTHLY OVERVIEW ── */}
        <TabsContent value="overview">
          <MonthlyOverview
            incomes={incomes ?? []}
            expenses={expenses ?? []}
            mortgage={mortgage ?? null}
            tranches={tranches ?? []}
            categoryOrder={categoryNames}
            currentSavings={savingsPlan?.currentSavings ?? 0}
          />
        </TabsContent>

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
        categories={categoryNames}
      />
      <CategoryManagerDialog
        open={catManagerOpen}
        onClose={() => setCatManagerOpen(false)}
        categories={dbCategories ?? []}
      />
    </div>
  )
}

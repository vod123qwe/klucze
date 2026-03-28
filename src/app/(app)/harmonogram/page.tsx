'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, Check, Clock } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatDate, formatPLN } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Milestone, MilestoneCategory } from '@/types'
import { MILESTONE_CATEGORY_LABELS } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<MilestoneCategory, string> = {
  reservation: 'bg-slate-400',
  contract: 'bg-blue-500',
  downPayment: 'bg-amber-500',
  tranche: 'bg-violet-500',
  delivery: 'bg-emerald-500',
  fitout: 'bg-orange-500',
  moveIn: 'bg-pink-500',
  custom: 'bg-gray-400',
}

function MilestoneDialog({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: Milestone }) {
  const [form, setForm] = useState<Omit<Milestone, 'id'>>({
    label: existing?.label ?? '',
    date: existing?.date ?? '',
    category: existing?.category ?? 'custom',
    status: existing?.status ?? 'planned',
    notes: existing?.notes ?? '',
  })

  function set(k: keyof typeof form, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!form.label || !form.date) { toast.error('Podaj nazwę i datę'); return }
    if (existing) { await db.milestones.update(existing.id, form) }
    else { await db.milestones.add({ id: generateId(), ...form }) }
    toast.success('Zapisano'); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{existing ? 'Edytuj zdarzenie' : 'Dodaj zdarzenie'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Nazwa zdarzenia</Label>
              <Input value={form.label} onChange={e => set('label', e.target.value)} placeholder="np. Podpisanie umowy" />
            </div>
            <div>
              <Label className="text-xs">Data</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Kategoria</Label>
              <Select value={form.category} onValueChange={v => set('category', v as MilestoneCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(MILESTONE_CATEGORY_LABELS) as MilestoneCategory[]).map(c => (
                    <SelectItem key={c} value={c}>{MILESTONE_CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planowane</SelectItem>
                  <SelectItem value="done">Gotowe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Notatki</Label>
              <Textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={save}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function HarmonogramPage() {
  const milestones = useLiveQuery(() =>
    db.milestones.orderBy('date').toArray(), [])
  const tranches = useLiveQuery(() =>
    db.mortgageTranches.orderBy('index').toArray(), [])
  const [dialog, setDialog] = useState<{ open: boolean; existing?: Milestone }>({ open: false })

  const today = new Date().toISOString().slice(0, 10)
  const upcomingMilestones = milestones?.filter(m => m.date >= today && m.status === 'planned').slice(0, 5) ?? []

  async function toggleDone(m: Milestone) {
    await db.milestones.update(m.id, { status: m.status === 'done' ? 'planned' : 'done' })
  }

  async function deleteMilestone(id: string) {
    await db.milestones.delete(id)
    toast.success('Usunięto')
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-4xl">
      <PageHeader
        title="Harmonogram"
        description="Oś czasu zdarzeń i harmonogram transz kredytowych"
        actions={
          <Button size="sm" onClick={() => setDialog({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" />
            Dodaj zdarzenie
          </Button>
        }
      />

      <Tabs defaultValue="timeline">
        <TabsList className="mb-5">
          <TabsTrigger value="timeline">Oś czasu</TabsTrigger>
          <TabsTrigger value="table">Tabela zdarzeń</TabsTrigger>
          <TabsTrigger value="tranches">Transze</TabsTrigger>
        </TabsList>

        {/* ── TIMELINE ── */}
        <TabsContent value="timeline">
          {!milestones || milestones.length === 0 ? (
            <SectionEmptyState
              title="Brak zdarzeń na osi czasu"
              description="Dodaj rezerwację, podpisanie umowy, odbiór i inne ważne terminy"
              action={
                <Button size="sm" onClick={() => setDialog({ open: true })}>
                  <Plus className="h-4 w-4 mr-1" />Dodaj zdarzenie
                </Button>
              }
            />
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-1">
                {milestones.map((m) => {
                  const isPast = m.date < today
                  const isToday = m.date === today
                  const dotColor = CATEGORY_COLORS[m.category] ?? 'bg-gray-400'

                  return (
                    <div key={m.id} className="flex gap-4 group">
                      {/* Dot */}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                        <div className={cn(
                          'h-3 w-3 rounded-full border-2 border-background',
                          m.status === 'done' ? 'bg-emerald-500' : dotColor,
                          isPast && m.status !== 'done' ? 'opacity-40' : '',
                        )} />
                      </div>

                      {/* Content */}
                      <div className={cn(
                        'flex flex-1 items-start justify-between gap-3 rounded-lg border px-3 py-2.5 mb-1 transition-colors',
                        isToday ? 'border-primary/40 bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted/20',
                        m.status === 'done' ? 'opacity-60' : '',
                      )}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn('text-sm font-medium', m.status === 'done' && 'line-through')}>{m.label}</span>
                            <span className={cn(
                              'text-[11px] rounded-full px-2 py-0.5 font-medium',
                              `${dotColor.replace('bg-', 'bg-')}/10 text-${dotColor.replace('bg-', '').split('-')[0]}-600`,
                            )}>
                              {MILESTONE_CATEGORY_LABELS[m.category]}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(m.date)}</p>
                          {m.notes && <p className="text-xs text-muted-foreground/70 mt-0.5">{m.notes}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleDone(m)}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDialog({ open: true, existing: m })}>
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => deleteMilestone(m.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── TABLE ── */}
        <TabsContent value="table">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b">
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Data</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Zdarzenie</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Kategoria</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {milestones?.map((m) => (
                  <tr key={m.id} className={cn('hover:bg-muted/20 transition-colors', m.status === 'done' && 'opacity-50')}>
                    <td className="px-4 py-2.5 font-medium text-sm">{formatDate(m.date)}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn(m.status === 'done' && 'line-through')}>{m.label}</span>
                      {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs">{MILESTONE_CATEGORY_LABELS[m.category]}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {m.status === 'done'
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Gotowe</span>
                        : <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />Planowane</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDialog({ open: true, existing: m })}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => deleteMilestone(m.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!milestones || milestones.length === 0) && (
              <div className="p-8 text-center text-sm text-muted-foreground">Brak zdarzeń</div>
            )}
          </div>
        </TabsContent>

        {/* ── TRANCHES ── */}
        <TabsContent value="tranches">
          {!tranches || tranches.length === 0 ? (
            <SectionEmptyState
              title="Brak transz"
              description="Dodaj transze w sekcji Kredyt"
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {tranches.map((t, idx) => (
                    <div key={t.id} className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{formatPLN(t.amount)}</span>
                          <StatusBadge status={t.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Planowana: {formatDate(t.plannedDate)}
                          {t.actualDate && <> · Faktyczna: {formatDate(t.actualDate)}</>}
                        </p>
                        {t.condition && <p className="text-xs text-muted-foreground/70 mt-0.5">{t.condition}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <MilestoneDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false })}
        existing={dialog.existing}
      />
    </div>
  )
}

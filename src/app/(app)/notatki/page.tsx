'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2 } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId, formatDate, formatPLN } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen } from 'lucide-react'
import type { Decision } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function DecisionDialog({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: Decision }) {
  const [form, setForm] = useState<Omit<Decision, 'id'>>({
    date: existing?.date ?? new Date().toISOString().slice(0, 10),
    topic: existing?.topic ?? '',
    description: existing?.description ?? '',
    reasoning: existing?.reasoning ?? '',
    financialImpact: existing?.financialImpact ?? null,
    scheduleImpact: existing?.scheduleImpact ?? '',
    linkedDocumentIds: existing?.linkedDocumentIds ?? [],
  })

  function set(k: keyof typeof form, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!form.topic) { toast.error('Podaj temat decyzji'); return }
    if (existing) { await db.decisions.update(existing.id, form) }
    else { await db.decisions.add({ id: generateId(), ...form }) }
    toast.success('Zapisano decyzję'); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{existing ? 'Edytuj decyzję' : 'Zapisz decyzję'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Temat</Label>
              <Input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="np. Wybór banku" />
            </div>
            <div>
              <Label className="text-xs">Data</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Wpływ finansowy (zł, opcjonalnie)</Label>
              <Input
                type="number"
                value={form.financialImpact ?? ''}
                onChange={e => set('financialImpact', e.target.value ? Number(e.target.value) : null)}
                placeholder="np. -5000"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Opis decyzji</Label>
              <Textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Co zdecydowaliśmy..." />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Dlaczego tak zdecydowaliśmy</Label>
              <Textarea rows={2} value={form.reasoning} onChange={e => set('reasoning', e.target.value)} placeholder="Uzasadnienie, kontekst, alternatywy..." />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Wpływ na harmonogram</Label>
              <Input value={form.scheduleImpact} onChange={e => set('scheduleImpact', e.target.value)} placeholder="np. przesuwa odbiór o 2 tygodnie" />
            </div>
          </div>
          <Button className="w-full" onClick={save}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function NotatakiPage() {
  const decisions = useLiveQuery(() => db.decisions.orderBy('date').reverse().toArray(), [])
  const [dialog, setDialog] = useState<{ open: boolean; existing?: Decision }>({ open: false })

  async function deleteDecision(id: string) {
    await db.decisions.delete(id)
    toast.success('Usunięto')
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-3xl">
      <PageHeader
        title="Notatki i decyzje"
        description="Log ważnych decyzji z kontekstem i uzasadnieniem"
        actions={
          <Button size="sm" onClick={() => setDialog({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" />
            Dodaj decyzję
          </Button>
        }
      />

      {!decisions || decisions.length === 0 ? (
        <SectionEmptyState
          icon={BookOpen}
          title="Brak zapisanych decyzji"
          description="Zapisuj ważne decyzje z uzasadnieniem, aby móc do nich wrócić — wybór banku, standard wykończenia, zmiany w planie..."
          action={<Button size="sm" onClick={() => setDialog({ open: true })}><Plus className="h-4 w-4 mr-1" />Dodaj decyzję</Button>}
        />
      ) : (
        <div className="space-y-3">
          {decisions.map((dec) => (
            <Card key={dec.id} className="relative group hover:shadow-sm transition-shadow">
              <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-primary/40" />
              <CardContent className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold">{dec.topic}</span>
                      {dec.financialImpact !== null && (
                        <span className={cn(
                          'text-[11px] font-medium px-2 py-0.5 rounded-full',
                          dec.financialImpact < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600',
                        )}>
                          {dec.financialImpact > 0 ? '+' : ''}{formatPLN(dec.financialImpact)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{formatDate(dec.date)}</span>
                    </div>
                    {dec.description && (
                      <p className="text-sm text-foreground/80">{dec.description}</p>
                    )}
                    {dec.reasoning && (
                      <div className="mt-2 border-l-2 border-muted pl-3">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">Dlaczego</p>
                        <p className="text-xs text-muted-foreground">{dec.reasoning}</p>
                      </div>
                    )}
                    {dec.scheduleImpact && (
                      <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 inline-block">
                        Harmonogram: {dec.scheduleImpact}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDialog({ open: true, existing: dec })}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => deleteDecision(dec.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DecisionDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false })}
        existing={dialog.existing}
      />
    </div>
  )
}

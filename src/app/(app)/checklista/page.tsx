'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2 } from 'lucide-react'
import { db } from '@/lib/db/db'
import { generateId } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { ChecklistItem, ChecklistGroup } from '@/types'
import { CHECKLIST_GROUP_LABELS } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function ItemDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<Omit<ChecklistItem, 'id'>>({
    group: 'before_contract',
    title: '',
    description: '',
    dueDate: null,
    status: 'todo',
    priority: 'medium',
    linkedDocumentIds: [],
    notes: '',
  })

  function set(k: keyof typeof form, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!form.title) { toast.error('Podaj tytuł'); return }
    await db.checklistItems.add({ id: generateId(), ...form })
    toast.success('Dodano zadanie'); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Tytuł</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="np. Podpisanie umowy rezerwacyjnej" />
            </div>
            <div>
              <Label className="text-xs">Etap</Label>
              <Select value={form.group} onValueChange={v => set('group', v as ChecklistGroup)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHECKLIST_GROUP_LABELS) as ChecklistGroup[]).map(g => (
                    <SelectItem key={g} value={g}>{CHECKLIST_GROUP_LABELS[g]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priorytet</Label>
              <Select value={form.priority} onValueChange={v => set('priority', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Wysoki</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="low">Niski</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Termin</Label>
              <Input type="date" value={form.dueDate ?? ''} onChange={e => set('dueDate', e.target.value || null)} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Opis / notatka</Label>
              <Textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={save}>Dodaj</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ChecklistaPage() {
  const items = useLiveQuery(() => db.checklistItems.toArray(), [])
  const [dialog, setDialog] = useState(false)

  const byGroup = (items ?? []).reduce<Record<ChecklistGroup, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<ChecklistGroup, ChecklistItem[]>)

  const doneCount = items?.filter(i => i.status === 'done').length ?? 0
  const totalCount = items?.length ?? 0

  async function toggleDone(item: ChecklistItem) {
    await db.checklistItems.update(item.id, {
      status: item.status === 'done' ? 'todo' : 'done',
    })
  }

  async function deleteItem(id: string) {
    await db.checklistItems.delete(id)
    toast.success('Usunięto')
  }

  const PRIORITY_CONFIG = {
    high: { label: 'Wysoki', cls: 'bg-red-50 text-red-700 border-red-200' },
    medium: { label: 'Średni', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    low: { label: 'Niski', cls: 'bg-slate-50 text-slate-600 border-slate-200' },
  }

  return (
    <div className="px-6 py-5 mx-auto max-w-3xl">
      <PageHeader
        title="Checklista"
        description={totalCount > 0 ? `${doneCount} z ${totalCount} zadań ukończonych` : 'Zadania pogrupowane etapami'}
        actions={
          <Button size="sm" onClick={() => setDialog(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Dodaj zadanie
          </Button>
        }
      />

      {totalCount === 0 ? (
        <SectionEmptyState
          title="Brak zadań"
          description="Dodaj zadania do checklisty — podzielone są na etapy przed umową, w trakcie budowy, przed odbiorem itd."
          action={<Button size="sm" onClick={() => setDialog(true)}><Plus className="h-4 w-4 mr-1" />Dodaj zadanie</Button>}
        />
      ) : (
        <Accordion multiple defaultValue={Object.keys(byGroup)}>
          {(Object.keys(CHECKLIST_GROUP_LABELS) as ChecklistGroup[]).filter(g => byGroup[g]?.length > 0).map((group) => {
            const groupItems = byGroup[group] ?? []
            const groupDone = groupItems.filter(i => i.status === 'done').length
            return (
              <AccordionItem key={group} value={group}>
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    {CHECKLIST_GROUP_LABELS[group]}
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {groupDone}/{groupItems.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pb-2">
                    {groupItems.map((item) => (
                      <div key={item.id} className={cn(
                        'flex items-start gap-3 rounded-md px-2 py-2 group hover:bg-muted/20 transition-colors',
                        item.status === 'done' && 'opacity-50',
                      )}>
                        <Checkbox
                          className="mt-0.5"
                          checked={item.status === 'done'}
                          onCheckedChange={() => toggleDone(item)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn('text-sm', item.status === 'done' && 'line-through')}>{item.title}</span>
                            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', PRIORITY_CONFIG[item.priority].cls)}>
                              {PRIORITY_CONFIG[item.priority].label}
                            </Badge>
                          </div>
                          {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                          {item.dueDate && <p className="text-xs text-muted-foreground/70 mt-0.5">Termin: {item.dueDate}</p>}
                        </div>
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}

      <ItemDialog open={dialog} onClose={() => setDialog(false)} />
    </div>
  )
}

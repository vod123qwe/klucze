'use client'

import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import { db } from '@/lib/db/db'
import { formatDate } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { Property } from '@/types'
import { toast } from 'sonner'

export default function MieszkaniePage() {
  const property = useLiveQuery(() => db.property.get('main'))
  const [form, setForm] = useState<Property | null>(null)
  const [newIncluded, setNewIncluded] = useState('')
  const [newNotIncluded, setNewNotIncluded] = useState('')
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  const [newRoom, setNewRoom] = useState('')

  useEffect(() => {
    if (property && !form) setForm(property)
  }, [property, form])

  if (form === null) return null

  function set(field: keyof Property, value: unknown) {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  async function save() {
    if (!form) return
    const existing = await db.property.get('main')
    await db.property.put(form)
    toast.success('Mieszkanie zapisane')
  }

  function addIncluded() {
    if (!newIncluded.trim()) return
    set('includedInPrice', [...(form?.includedInPrice ?? []), newIncluded.trim()])
    setNewIncluded('')
  }

  function addNotIncluded() {
    if (!newNotIncluded.trim()) return
    set('notIncludedInPrice', [...(form?.notIncludedInPrice ?? []), newNotIncluded.trim()])
    setNewNotIncluded('')
  }

  function addLink() {
    if (!newLink.label || !newLink.url) return
    set('links', [...(form?.links ?? []), newLink])
    setNewLink({ label: '', url: '' })
  }

  function addRoomNote() {
    if (!newRoom.trim()) return
    const updated = { ...(form?.roomNotes ?? {}), [newRoom.trim()]: '' }
    set('roomNotes', updated)
    setNewRoom('')
  }

  return (
    <div className="px-6 py-5 max-w-4xl">
      <PageHeader
        title="Mieszkanie"
        description="Dane nieruchomości, lokalizacja i notatki"
        actions={
          <Button size="sm" onClick={save}>Zapisz</Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Basic info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Podstawowe informacje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Nazwa inwestycji</Label>
              <Input value={form.investmentName} onChange={e => set('investmentName', e.target.value)} placeholder="np. Osiedle Słoneczne" />
            </div>
            <div>
              <Label className="text-xs">Deweloper</Label>
              <Input value={form.developer} onChange={e => set('developer', e.target.value)} placeholder="np. Polnord" />
            </div>
            <div>
              <Label className="text-xs">Adres / lokalizacja</Label>
              <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="ul. Przykładowa 1, Warszawa" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Numer lokalu</Label>
                <Input value={form.unitNumber} onChange={e => set('unitNumber', e.target.value)} placeholder="42A" />
              </div>
              <div>
                <Label className="text-xs">Piętro</Label>
                <Input type="number" value={form.floor || ''} onChange={e => set('floor', Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Metraż (m²)</Label>
                <Input type="number" step="0.1" value={form.area || ''} onChange={e => set('area', Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Liczba pokoi</Label>
                <Input type="number" value={form.rooms || ''} onChange={e => set('rooms', Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Ekspozycja</Label>
                <Input value={form.exposure} onChange={e => set('exposure', e.target.value)} placeholder="S, SW..." />
              </div>
              <div>
                <Label className="text-xs">Status budowy</Label>
                <Select value={form.buildingStatus} onValueChange={v => set('buildingStatus', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planowanie</SelectItem>
                    <SelectItem value="under_construction">W budowie</SelectItem>
                    <SelectItem value="finished">Gotowe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Termin odbioru</Label>
              <Input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)} />
              {form.deliveryDate && (
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(form.deliveryDate)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extras + standard */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Dodatki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['balcony', 'garden', 'terrace'] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={form.extras[key]}
                    onCheckedChange={v => set('extras', { ...form.extras, [key]: !!v })}
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer capitalize">
                    {key === 'balcony' ? 'Balkon' : key === 'garden' ? 'Ogródek' : 'Taras'}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Standard deweloperski</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                value={form.developerStandard}
                onChange={e => set('developerStandard', e.target.value)}
                placeholder="Opis standardu wykończenia deweloperskiego..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Notatki ogólne</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Dodatkowe uwagi..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Included / not included */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Co jest w cenie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newIncluded}
                onChange={e => setNewIncluded(e.target.value)}
                placeholder="np. Miejsce parkingowe"
                onKeyDown={e => e.key === 'Enter' && addIncluded()}
              />
              <Button size="sm" variant="outline" onClick={addIncluded}><Plus className="h-4 w-4" /></Button>
            </div>
            <ul className="space-y-1">
              {form.includedInPrice.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">+</span>
                  <span className="flex-1">{item}</span>
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive"
                    onClick={() => set('includedInPrice', form.includedInPrice.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Czego nie ma w cenie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newNotIncluded}
                onChange={e => setNewNotIncluded(e.target.value)}
                placeholder="np. Garaż podziemny"
                onKeyDown={e => e.key === 'Enter' && addNotIncluded()}
              />
              <Button size="sm" variant="outline" onClick={addNotIncluded}><Plus className="h-4 w-4" /></Button>
            </div>
            <ul className="space-y-1">
              {form.notIncludedInPrice.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-red-400">−</span>
                  <span className="flex-1">{item}</span>
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive"
                    onClick={() => set('notIncludedInPrice', form.notIncludedInPrice.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Linki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Input value={newLink.label} onChange={e => setNewLink(p => ({ ...p, label: e.target.value }))} placeholder="Etykieta" />
              </div>
              <div className="col-span-2 flex gap-2">
                <Input value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                <Button size="sm" variant="outline" onClick={addLink}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <ul className="space-y-1">
              {form.links.map((link, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 flex-1 text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.label || link.url}
                  </a>
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive"
                    onClick={() => set('links', form.links.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Room notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Notatki do pomieszczeń</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newRoom}
                onChange={e => setNewRoom(e.target.value)}
                placeholder="np. Salon"
                onKeyDown={e => e.key === 'Enter' && addRoomNote()}
              />
              <Button size="sm" variant="outline" onClick={addRoomNote}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {Object.entries(form.roomNotes).map(([room, note]) => (
              <div key={room} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">{room}</Label>
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive"
                    onClick={() => {
                      const updated = { ...form.roomNotes }
                      delete updated[room]
                      set('roomNotes', updated)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  rows={2}
                  value={note}
                  onChange={e => set('roomNotes', { ...form.roomNotes, [room]: e.target.value })}
                  placeholder="Notatki, wymiary, uwagi..."
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <Button onClick={save}>Zapisz wszystkie zmiany</Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Trash2, ExternalLink, MapPin, Calendar, Building2, Home, Pencil, Check, Car, Archive, Layers, Users } from 'lucide-react'
import { db } from '@/lib/db/db'
import { formatDate, formatPLN } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function DeliveryCountdown({ date }: { date: string }) {
  const days = daysUntil(date)
  if (days === null) return null
  const months = Math.floor(days / 30)
  const label = days < 0
    ? 'Termin minął'
    : days === 0
    ? 'Dziś!'
    : months >= 2
    ? `za ${months} mies.`
    : `za ${days} dni`
  const color = days < 0 ? 'text-red-500' : days < 60 ? 'text-amber-500' : 'text-emerald-600'
  return <span className={cn('text-xs font-medium', color)}>{label}</span>
}

function StatusBadge({ status }: { status: Property['buildingStatus'] }) {
  const map = {
    planning: { label: 'Planowanie', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    under_construction: { label: 'W budowie', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    finished: { label: 'Gotowe', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  }
  const s = map[status]
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', s.class)}>
      {s.label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MieszkaniePage() {
  const property = useLiveQuery(() => db.property.get('main'))
  const purchaseCosts = useLiveQuery(() => db.purchaseCosts.toArray())
  const [form, setForm] = useState<Property | null>(null)
  const [editing, setEditing] = useState(false)
  const [newIncluded, setNewIncluded] = useState('')
  const [newNotIncluded, setNewNotIncluded] = useState('')
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  const [newRoom, setNewRoom] = useState('')

  useEffect(() => {
    if (property && !form) setForm(property)
  }, [property, form])

  const purchasePrice = useMemo(() =>
    purchaseCosts?.find(c => c.category === 'property')?.amount ?? 0,
    [purchaseCosts]
  )

  if (!form) return null

  function set(field: keyof Property, value: unknown) {
    setForm(prev => prev ? { ...prev, [field]: value } : prev)
  }

  async function save() {
    if (!form) return
    await db.property.put(form)
    setEditing(false)
    toast.success('Zapisano')
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
    set('roomNotes', { ...(form?.roomNotes ?? {}), [newRoom.trim()]: '' })
    setNewRoom('')
  }

  const pricePerM2 = form.area > 0 ? Math.round(purchasePrice / form.area) : null

  return (
    <div className="px-6 py-5 mx-auto max-w-4xl">
      <PageHeader
        title="Mieszkanie"
        description="Dane nieruchomości, standard i notatki"
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setForm(property!); setEditing(false) }}>
                Anuluj
              </Button>
              <Button size="sm" onClick={save}>
                <Check className="h-4 w-4 mr-1" />Zapisz
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4 mr-1" />Edytuj
            </Button>
          )
        }
      />

      {/* ── HERO CARD ── */}
      <Card className="mb-5 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/8 to-primary/3 px-5 py-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold tracking-tight">{form.investmentName || '—'}</h2>
                <StatusBadge status={form.buildingStatus} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {form.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {form.address}
                  </span>
                )}
                {form.developer && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {form.developer}
                  </span>
                )}
                {form.unitNumber && (
                  <span className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    {form.unitNumber}
                  </span>
                )}
              </div>
            </div>
            {form.deliveryDate && (
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end mb-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Odbiór
                </div>
                <div className="text-sm font-semibold">{formatDate(form.deliveryDate)}</div>
                <DeliveryCountdown date={form.deliveryDate} />
              </div>
            )}
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
          <div className="px-5 py-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Cena</div>
            <div className="text-base font-bold">{purchasePrice > 0 ? formatPLN(purchasePrice) : '—'}</div>
          </div>
          <div className="px-5 py-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Metraż</div>
            <div className="text-base font-bold">{form.area > 0 ? `${form.area} m²` : '—'}</div>
            {pricePerM2 && <div className="text-xs text-muted-foreground">{formatPLN(pricePerM2)}/m²</div>}
          </div>
          <div className="px-5 py-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Pokoje</div>
            <div className="text-base font-bold">{form.rooms > 0 ? form.rooms : '—'}</div>
          </div>
          <div className="px-5 py-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Piętro</div>
            <div className="text-base font-bold">{form.floor > 0 ? form.floor : '—'}</div>
            {form.exposure && <div className="text-xs text-muted-foreground">Ekspozycja: {form.exposure}</div>}
          </div>
        </div>

        {/* Extras + Garaż + Komórka */}
        <div className="px-5 py-2.5 border-t flex gap-2 flex-wrap">
          {form.extras.balcony && (
            <Badge variant="secondary" className="gap-1">
              Balkony ×3
              <span className="text-muted-foreground font-normal">33,61 m²</span>
            </Badge>
          )}
          {form.extras.garden && <Badge variant="secondary">Ogródek</Badge>}
          {form.extras.terrace && <Badge variant="secondary">Taras</Badge>}
          {purchaseCosts?.some(c => c.category === 'parking') && (
            <Badge className="gap-1 bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50" variant="outline">
              <Car className="h-3 w-3" />Garaż podziemny
            </Badge>
          )}
          {purchaseCosts?.some(c => c.category === 'storage') && (
            <Badge className="gap-1 bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50" variant="outline">
              <Archive className="h-3 w-3" />Komórka lokatorska
            </Badge>
          )}
        </div>
      </Card>

      {/* ── TABS ── */}
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Dane lokalu</TabsTrigger>
          <TabsTrigger value="standard">Standard deweloperski</TabsTrigger>
          <TabsTrigger value="rooms">Pomieszczenia</TabsTrigger>
          <TabsTrigger value="links">Linki i notatki</TabsTrigger>
        </TabsList>

        {/* ── DANE LOKALU ── */}
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs">Nazwa inwestycji</Label>
                  <Input disabled={!editing} value={form.investmentName} onChange={e => set('investmentName', e.target.value)} placeholder="np. Osiedle Słoneczne" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs">Deweloper</Label>
                  <Input disabled={!editing} value={form.developer} onChange={e => set('developer', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Adres</Label>
                  <Input disabled={!editing} value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Numer lokalu / segment</Label>
                  <Input disabled={!editing} value={form.unitNumber} onChange={e => set('unitNumber', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Status budowy</Label>
                  {editing ? (
                    <Select value={form.buildingStatus} onValueChange={v => set('buildingStatus', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planowanie</SelectItem>
                        <SelectItem value="under_construction">W budowie</SelectItem>
                        <SelectItem value="finished">Gotowe</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input disabled value={form.buildingStatus === 'under_construction' ? 'W budowie' : form.buildingStatus === 'finished' ? 'Gotowe' : 'Planowanie'} />
                  )}
                </div>
                <div>
                  <Label className="text-xs">Metraż (m²)</Label>
                  <Input disabled={!editing} type="number" step="0.1" value={form.area || ''} onChange={e => set('area', Number(e.target.value))} placeholder="np. 52.5" />
                </div>
                <div>
                  <Label className="text-xs">Liczba pokoi</Label>
                  <Input disabled={!editing} type="number" value={form.rooms || ''} onChange={e => set('rooms', Number(e.target.value))} placeholder="np. 3" />
                </div>
                <div>
                  <Label className="text-xs">Piętro</Label>
                  <Input disabled={!editing} type="number" value={form.floor || ''} onChange={e => set('floor', Number(e.target.value))} placeholder="np. 2" />
                </div>
                <div>
                  <Label className="text-xs">Ekspozycja</Label>
                  <Input disabled={!editing} value={form.exposure} onChange={e => set('exposure', e.target.value)} placeholder="np. S, SW" />
                </div>
                <div>
                  <Label className="text-xs">Termin odbioru</Label>
                  <Input disabled={!editing} type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs mb-2 block">Dodatki</Label>
                  <div className="flex gap-5">
                    {(['balcony', 'garden', 'terrace'] as const).map(key => (
                      <div key={key} className="flex items-center gap-2">
                        <Checkbox
                          id={key}
                          disabled={!editing}
                          checked={form.extras[key]}
                          onCheckedChange={v => set('extras', { ...form.extras, [key]: !!v })}
                        />
                        <Label htmlFor={key} className={cn('text-sm', editing ? 'cursor-pointer' : 'cursor-default')}>
                          {key === 'balcony' ? 'Balkon' : key === 'garden' ? 'Ogródek' : 'Taras'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* O inwestycji */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />O inwestycji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                {[
                  { label: 'Deweloper', value: 'EPOL HOLDING Sp. z o.o.' },
                  { label: 'NIP / KRS', value: '7282749467 / 0000357354' },
                  { label: 'Siedziba', value: 'ul. Targowa 9A, Łódź' },
                  { label: 'Budynek', value: 'B1, Segment B' },
                  { label: 'Kondygnacje nadziemne', value: '6' },
                  { label: 'Kondygnacje podziemne', value: '2 (garaż)' },
                  { label: 'Łącznie lokali', value: '288 mieszkań + 5 usługowych' },
                  { label: 'Miejsca naziemne', value: '24 (w tym 7 dla niepełnosprawnych)' },
                  { label: 'Start budowy', value: '03.01.2024' },
                  { label: 'Koniec robót', value: 'do 31.10.2026' },
                  { label: 'Przeniesienie własności', value: 'do 31.05.2027' },
                  { label: 'Pozwolenie na budowę', value: 'nr AB.II-S.1.133.2022 (05.04.2022)' },
                  { label: 'Starosta', value: 'Starosta Krakowski' },
                  { label: 'Działki', value: '1398/2, 1402/2, 1404/5, 1405/2' },
                  { label: 'Księga Wieczysta', value: 'KR3I/00024118/6' },
                  { label: 'Sąd', value: 'SR Wieliczka, Wydział w Skawinie' },
                  { label: 'Rachunek powierniczy', value: 'ING Bank Śląski S.A. (otwarty)' },
                  { label: 'Fundusz gwarancyjny', value: 'DFG — pobierany z każdej wpłaty' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                    <div className="font-medium text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── STANDARD DEWELOPERSKI ── */}
        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Opis standardu</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  rows={5}
                  value={form.developerStandard}
                  onChange={e => set('developerStandard', e.target.value)}
                  placeholder="Opis standardu wykończenia deweloperskiego..."
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {form.developerStandard || <span className="italic">Brak opisu. Kliknij Edytuj, aby dodać.</span>}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Co jest w cenie */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-emerald-700">Co jest w cenie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editing && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newIncluded}
                      onChange={e => setNewIncluded(e.target.value)}
                      placeholder="Dodaj pozycję..."
                      onKeyDown={e => e.key === 'Enter' && addIncluded()}
                    />
                    <Button size="sm" variant="outline" onClick={addIncluded}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {form.includedInPrice.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Brak danych</p>
                ) : (
                  <ul className="space-y-1.5">
                    {form.includedInPrice.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                        <span className="flex-1">{item}</span>
                        {editing && (
                          <Button
                            variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive shrink-0"
                            onClick={() => set('includedInPrice', form.includedInPrice.filter((_, j) => j !== i))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Czego nie ma w cenie */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-rose-700">Czego nie ma w cenie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editing && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newNotIncluded}
                      onChange={e => setNewNotIncluded(e.target.value)}
                      placeholder="Dodaj pozycję..."
                      onKeyDown={e => e.key === 'Enter' && addNotIncluded()}
                    />
                    <Button size="sm" variant="outline" onClick={addNotIncluded}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {form.notIncludedInPrice.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Brak danych</p>
                ) : (
                  <ul className="space-y-1.5">
                    {form.notIncludedInPrice.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-rose-400 shrink-0 font-bold">✗</span>
                        <span className="flex-1">{item}</span>
                        {editing && (
                          <Button
                            variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive shrink-0"
                            onClick={() => set('notIncludedInPrice', form.notIncludedInPrice.filter((_, j) => j !== i))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── POMIESZCZENIA ── */}
        <TabsContent value="rooms" className="space-y-4">
          {/* Metraż summary */}
          {form.area > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">{form.area} m²</div>
                <div className="text-xs text-muted-foreground mt-0.5">Metraż mieszkania</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">33,61 m²</div>
                <div className="text-xs text-muted-foreground mt-0.5">Łącznie balkony</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">{form.rooms || '—'}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Pokoje</div>
              </Card>
            </div>
          )}

          {/* Room list */}
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-sm">Układ pomieszczeń</CardTitle>
              {editing && (
                <div className="flex gap-2">
                  <Input
                    className="h-8 text-sm w-52"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    placeholder="Nazwa pomieszczenia"
                    onKeyDown={e => e.key === 'Enter' && addRoomNote()}
                  />
                  <Button size="sm" variant="outline" onClick={addRoomNote}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(form.roomNotes).length === 0 ? (
                <p className="text-sm text-muted-foreground italic p-4">Brak danych. Kliknij Edytuj, aby dodać.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground text-xs">
                      <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">Pomieszczenie</th>
                      <th className="px-4 py-2 text-right font-semibold uppercase tracking-wider">Metraż / opis</th>
                      {editing && <th className="w-8" />}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(form.roomNotes).map(([room, note]) => {
                      const isBalcony = room.toLowerCase().includes('balkon')
                      return (
                        <tr key={room} className={cn('hover:bg-muted/20', isBalcony && 'bg-sky-50/40 dark:bg-sky-950/10')}>
                          <td className="px-4 py-2.5 font-medium">
                            {room}
                            {isBalcony && <span className="ml-1.5 text-[10px] text-sky-600 bg-sky-100 rounded px-1 py-0.5">poza metrażem</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {editing ? (
                              <Input
                                className="h-7 text-sm text-right w-48 ml-auto"
                                value={note}
                                onChange={e => set('roomNotes', { ...form.roomNotes, [room]: e.target.value })}
                                placeholder="np. 20,50 m²"
                              />
                            ) : (
                              <span className={cn('tabular-nums', isBalcony ? 'text-sky-700' : 'text-foreground font-medium')}>
                                {note || <span className="text-muted-foreground italic text-xs">—</span>}
                              </span>
                            )}
                          </td>
                          {editing && (
                            <td className="px-2">
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
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Garaż info card */}
          {purchaseCosts?.some(c => c.category === 'parking') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Car className="h-4 w-4 text-sky-600" />Garaż podziemny
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Typ</div>
                    <div className="font-medium">Podziemny</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Kondygnacje</div>
                    <div className="font-medium">2 (poz. –1, –2)</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Miejsc ogółem</div>
                    <div className="font-medium">187</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Numer miejsca</div>
                    <div className="font-medium text-muted-foreground italic">do uzupełnienia</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  Posadzka betonowa utwardzona i impregnowana. Garaż nieogrzewany. Instalacja detekcji CO i LPG.
                  Miejsca oznakowane numerami. Wjazd rampą z ul. Feliksa Pachla.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── LINKI I NOTATKI ── */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Linki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editing && (
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={newLink.label}
                    onChange={e => setNewLink(p => ({ ...p, label: e.target.value }))}
                    placeholder="Etykieta"
                  />
                  <div className="col-span-2 flex gap-2">
                    <Input
                      value={newLink.url}
                      onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))}
                      placeholder="https://..."
                    />
                    <Button size="sm" variant="outline" onClick={addLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {form.links.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Brak linków</p>
              ) : (
                <ul className="space-y-2">
                  {form.links.map((link, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 flex-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {link.label || link.url}
                      </a>
                      {editing && (
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive"
                          onClick={() => set('links', form.links.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Notatki ogólne</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  rows={5}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Dodatkowe uwagi, obserwacje, decyzje..."
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {form.notes || <span className="italic">Brak notatek. Kliknij Edytuj, aby dodać.</span>}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

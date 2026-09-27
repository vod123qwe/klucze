'use client'

import Link from 'next/link'
import { imageFor } from '@/lib/agd/images'
import { ExternalLink, ShoppingCart, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ProductImage } from '@/components/agd/ProductImage'
import { VariantSwitcher } from '@/components/agd/VariantSwitcher'
import { APPLIANCE_SETS } from '@/lib/agd/sets'
import { offersFor } from '@/lib/agd/offers'
import { PART_LABEL, PART_ORDER } from '@/lib/agd/types'
import { useMounted } from '@/lib/agd/useMounted'
import { formatPLN } from '@/lib/utils/format'
import { useAgdCart } from '@/stores/agdCartStore'

const setLabel = (slug: string) => APPLIANCE_SETS.find(s => s.slug === slug)?.label ?? slug

export default function KoszykPage() {
  const mounted = useMounted()
  const { items, setOffer, remove, clear } = useAgdCart()
  const cart = mounted ? items : []
  const total = cart.reduce((sum, i) => sum + i.offer.price, 0)

  const byStore = new Map<string, typeof cart>()
  for (const item of cart) byStore.set(item.offer.store, [...(byStore.get(item.offer.store) ?? []), item])

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
      <PageHeader
        className="px-0 py-0"
        title="Koszyk AGD"
        description="Twój własny zestaw: po jednym urządzeniu z każdej kategorii, z dowolnego wariantu, z wybranym sklepem."
      />
      <VariantSwitcher activeSlug="koszyk" />

      {cart.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 font-medium">Koszyk jest pusty</p>
          <p className="text-sm text-muted-foreground">
            Otwórz wariant, kliknij urządzenie lub alternatywę i dodaj je do koszyka.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Pozycje w kolejności kategorii */}
          <div className="space-y-3">
            {PART_ORDER.map(part => {
              const item = cart.find(i => i.product.category === part)
              if (!item) {
                return (
                  <div
                    key={part}
                    className="flex items-center justify-between rounded-xl border border-dashed border-border px-4 py-3 text-sm"
                  >
                    <span>
                      <span className="font-medium">{PART_LABEL[part]}</span>
                      <span className="text-muted-foreground"> — jeszcze nie wybrano</span>
                    </span>
                    <Link href="/agd" className="text-xs font-medium text-primary hover:underline">
                      Wybierz z wariantów
                    </Link>
                  </div>
                )
              }
              const offers = offersFor(item.product).filter(o => o.price > 0)
              return (
                <div key={part} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <ProductImage
                    src={imageFor(item.product)}
                    alt={item.product.model}
                    category={item.product.category}
                    finish={item.product.finish}
                    style={item.product.style}
                    className="h-24 w-24 shrink-0 rounded-lg border border-border"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {PART_LABEL[part]} · z wariantu {setLabel(item.setSlug)}
                        </p>
                        <p className="truncate font-medium">
                          {item.product.brand} {item.product.model}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-semibold tabular-nums">{formatPLN(item.offer.price)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <label className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Sklep:</span>
                        <select
                          value={item.offer.store}
                          onChange={e => {
                            const o = offers.find(x => x.store === e.target.value)
                            if (o) setOffer(item.id, o)
                          }}
                          className="rounded-md border border-border bg-background px-2 py-1"
                        >
                          {offers.map(o => (
                            <option key={o.store} value={o.store}>
                              {o.store} — {formatPLN(o.price)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <a
                        href={item.offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Przejdź do sklepu <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="ml-auto inline-flex items-center gap-1 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Usuń
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Podsumowanie i rozbicie na sklepy */}
          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">
                Razem · {cart.length} z {PART_ORDER.length} urządzeń
              </p>
              <p className="text-3xl font-semibold tabular-nums">{formatPLN(total)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Ceny orientacyjne — sprawdź w sklepach.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 text-sm font-semibold">Zakupy według sklepów</h2>
              <ul className="space-y-3">
                {[...byStore.entries()].map(([store, storeItems]) => (
                  <li key={store} className="text-sm">
                    <div className="flex justify-between font-medium">
                      <span>{store}</span>
                      <span className="tabular-nums">
                        {formatPLN(storeItems.reduce((s, i) => s + i.offer.price, 0))}
                      </span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {storeItems.map(i => (
                        <li key={i.id}>
                          <a
                            href={i.offer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {PART_LABEL[i.product.category]}: {i.product.model}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> Wyczyść koszyk
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

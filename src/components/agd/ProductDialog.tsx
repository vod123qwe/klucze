'use client'

import { useState } from 'react'
import { BadgePercent, Check, ExternalLink, Images, Info, ShoppingCart } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatPLN } from '@/lib/utils/format'
import { imagesUrl } from '@/lib/agd/links'
import { offersFor, productQuery } from '@/lib/agd/offers'
import { PART_LABEL, type Appliance, type AltAppliance } from '@/lib/agd/types'
import { useAgdCart, useIsInCart } from '@/stores/agdCartStore'
import { ProductImage } from './ProductImage'

interface ProductDialogProps {
  product: Appliance | null
  setSlug: string
  /** Produkt z zestawu w tej samej kategorii — do pokazania różnicy ceny przy alternatywie */
  baseline?: Appliance
  onOpenChange: (open: boolean) => void
}

export function ProductDialog({ product, setSlug, baseline, onOpenChange }: ProductDialogProps) {
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
        {product && <DialogBody product={product} setSlug={setSlug} baseline={baseline} />}
      </DialogContent>
    </Dialog>
  )
}

function DialogBody({ product, setSlug, baseline }: { product: Appliance; setSlug: string; baseline?: Appliance }) {
  const offers = offersFor(product)
  const [offerIdx, setOfferIdx] = useState(0)
  const offer = offers[offerIdx]
  const add = useAgdCart(s => s.replaceInCategory)
  const inCart = useIsInCart(product)
  const alt = 'altKind' in product ? (product as AltAppliance) : null
  const diff = baseline && baseline.model !== product.model ? product.price - baseline.price : 0

  return (
    <div className="grid md:grid-cols-[280px_1fr]">
      <div className="flex flex-col border-b border-border bg-white md:border-r md:border-b-0">
        <ProductImage
          src={product.imageUrl}
          alt={productQuery(product)}
          category={product.category}
          finish={product.finish}
          style={product.style}
          className="aspect-[16/10] md:aspect-square"
        />
        <a
          href={imagesUrl(productQuery(product))}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 mb-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Images className="h-3.5 w-3.5" /> Zobacz prawdziwe zdjęcia
        </a>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="pr-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {PART_LABEL[product.category]}
            {alt && ` · alternatywa ${alt.altKind}`}
          </p>
          <DialogTitle className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {productQuery(product)}
          </DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </div>

        {alt && (
          <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
            {alt.altReason}
            {diff !== 0 && (
              <span className="ml-1 font-medium tabular-nums">
                ({diff > 0 ? '+' : '−'}
                {formatPLN(Math.abs(diff))} względem zestawu)
              </span>
            )}
          </p>
        )}

        {product.promo && (
          <div className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <BadgePercent className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{product.promo}</span>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold">Kluczowe funkcje</h3>
          <ul className="space-y-1.5">
            {product.features.map(f => (
              <li key={f} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-muted/60 p-3 text-xs">
          {Object.entries(product.specs).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        {product.notes && (
          <p className="flex gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {product.notes}
          </p>
        )}

        {/* Oferty: wybór sklepu do koszyka + przejście do sklepu */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">Gdzie kupić</h3>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {offers.map((o, i) => (
              <li key={o.store} className="flex items-center gap-3 px-3 py-2 text-sm">
                {o.price > 0 ? (
                  <input
                    type="radio"
                    name="offer"
                    checked={i === offerIdx}
                    onChange={() => setOfferIdx(i)}
                    className="accent-[var(--primary)]"
                    aria-label={`Wybierz ${o.store}`}
                  />
                ) : (
                  <span className="w-[13px]" />
                )}
                <span className="flex-1">
                  {o.store}
                  {!o.direct && o.price > 0 && (
                    <span className="ml-1 text-[11px] text-muted-foreground">(wyszukiwanie w sklepie)</span>
                  )}
                </span>
                {o.price > 0 && <span className="font-medium tabular-nums">{formatPLN(o.price)}</span>}
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Przejdź <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[11px] text-muted-foreground">Ceny orientacyjne — sprawdź aktualną cenę w sklepie.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => add(setSlug, product, offer)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
              inCart
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? `W koszyku — zmień sklep na ${offer.store}` : `Do koszyka · ${offer.store} ${formatPLN(offer.price)}`}
          </button>
          <span className="text-[11px] text-muted-foreground">
            Zastępuje w koszyku inny produkt z kategorii „{PART_LABEL[product.category]}”.
          </span>
        </div>
      </div>
    </div>
  )
}

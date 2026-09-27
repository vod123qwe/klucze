'use client'

import { useState } from 'react'
import { Check, ExternalLink, Info, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { offersFor } from '@/lib/agd/offers'
import type { Appliance } from '@/lib/agd/types'
import { useAgdCart, useIsInCart } from '@/stores/agdCartStore'
import { useMounted } from '@/lib/agd/useMounted'
import { ProductDialog } from './ProductDialog'

/** Przyciski pod kartą produktu: szczegóły (popup), sklep, szybkie dodanie do koszyka */
export function ProductActions({ product, setSlug, baseline }: { product: Appliance; setSlug: string; baseline?: Appliance }) {
  const [open, setOpen] = useState(false)
  const add = useAgdCart(s => s.replaceInCategory)
  const inCart = useIsInCart(product)
  const mounted = useMounted()
  const best = offersFor(product)[0]

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-medium hover:bg-muted"
      >
        <Info className="h-3.5 w-3.5" /> Szczegóły i sklepy
      </button>
      <a
        href={best.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-medium hover:bg-muted"
      >
        {best.store} <ExternalLink className="h-3 w-3" />
      </a>
      <button
        type="button"
        onClick={() => add(setSlug, product, best)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium',
          mounted && inCart
            ? 'bg-emerald-600 text-white'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        {mounted && inCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
        {mounted && inCart ? 'W koszyku' : 'Do koszyka'}
      </button>
      <ProductDialog
        product={open ? product : null}
        setSlug={setSlug}
        baseline={baseline}
        onOpenChange={setOpen}
      />
    </div>
  )
}

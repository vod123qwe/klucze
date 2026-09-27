'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { offersFor } from '@/lib/agd/offers'
import type { ApplianceSet } from '@/lib/agd/types'
import { useAgdCart } from '@/stores/agdCartStore'

/** Wrzuca do koszyka cały zestaw (najtańsze oferty), zastępując to, co było w tych kategoriach */
export function AddSetToCart({ set }: { set: ApplianceSet }) {
  const replace = useAgdCart(s => s.replaceInCategory)

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => set.products.forEach(p => replace(set.slug, p, offersFor(p)[0]))}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ShoppingCart className="h-3.5 w-3.5" /> Cały zestaw do koszyka
      </button>
      <Link href="/agd/koszyk" className="text-xs font-medium text-primary hover:underline">
        Zobacz koszyk
      </Link>
    </div>
  )
}

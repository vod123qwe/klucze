'use client'

import { useState } from 'react'
import { ArrowLeftRight, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPLN } from '@/lib/utils/format'
import { PART_LABEL, PART_ORDER, productFor, type AltAppliance, type ApplianceSet } from '@/lib/agd/types'
import { useIsInCart } from '@/stores/agdCartStore'
import { useMounted } from '@/lib/agd/useMounted'
import { ProductImage } from './ProductImage'
import { ProductDialog } from './ProductDialog'

const KIND_STYLE: Record<AltAppliance['altKind'], string> = {
  tańsza: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  lepsza: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  inna: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
}

function AltTile({ alt, basePrice, onOpen }: { alt: AltAppliance; basePrice?: number; onOpen: () => void }) {
  const inCart = useIsInCart(alt)
  const mounted = useMounted()
  const diff = basePrice ? alt.price - basePrice : 0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-3 rounded-lg border border-border bg-card p-2 text-left transition hover:border-primary/40 hover:shadow-sm"
    >
      <ProductImage
        src={alt.imageUrl}
        alt={`${alt.brand} ${alt.model}`}
        category={alt.category}
        finish={alt.finish}
        style={alt.style}
        className="h-20 w-20 shrink-0 rounded-md border border-border"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase', KIND_STYLE[alt.altKind])}>
            {alt.altKind}
          </span>
          {mounted && inCart && <ShoppingCart className="h-3.5 w-3.5 text-emerald-600" />}
        </div>
        <p className="mt-0.5 truncate text-sm font-medium">
          {alt.brand} {alt.model}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{alt.altReason}</p>
        <p className="mt-1 text-sm font-semibold tabular-nums">
          {formatPLN(alt.price)}
          {diff !== 0 && (
            <span className={cn('ml-1.5 text-xs font-medium', diff > 0 ? 'text-rose-600' : 'text-emerald-600')}>
              {diff > 0 ? '+' : '−'}
              {formatPLN(Math.abs(diff))}
            </span>
          )}
        </p>
      </div>
    </button>
  )
}

/** Alternatywy dla każdej pozycji zestawu — tańsze, lepsze albo rozwiązujące słaby punkt */
export function AlternativesSection({ set }: { set: ApplianceSet }) {
  const [open, setOpen] = useState<AltAppliance | null>(null)
  const parts = PART_ORDER.filter(part => set.alternatives[part]?.length)
  if (parts.length === 0) return null

  return (
    <section className="space-y-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          <ArrowLeftRight className="h-4 w-4" /> Alternatywy — co można podmienić
        </h2>
        <p className="text-sm text-muted-foreground">
          Kliknij alternatywę, żeby zobaczyć szczegóły i wrzucić ją do koszyka zamiast produktu z zestawu.
        </p>
      </div>
      <div className="space-y-4">
        {parts.map(part => {
          const base = productFor(set, part)
          return (
            <div key={part} className="grid gap-2 md:grid-cols-[140px_1fr_1fr] md:items-center">
              <div className="text-sm">
                <p className="font-medium">{PART_LABEL[part]}</p>
                {base && (
                  <p className="text-xs text-muted-foreground">
                    w zestawie: {base.model} · <span className="tabular-nums">{formatPLN(base.price)}</span>
                  </p>
                )}
              </div>
              {set.alternatives[part]!.map(alt => (
                <AltTile key={alt.model} alt={alt} basePrice={base?.price} onOpen={() => setOpen(alt)} />
              ))}
            </div>
          )
        })}
      </div>
      <ProductDialog
        product={open}
        setSlug={set.slug}
        baseline={open ? productFor(set, open.category) : undefined}
        onOpenChange={o => !o && setOpen(null)}
      />
    </section>
  )
}

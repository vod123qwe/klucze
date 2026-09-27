'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { formatPLN } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import { PART_LABEL, productFor, type Appliance, type AppliancePart, type ApplianceSet } from '@/lib/agd/types'
import { useIsInCart } from '@/stores/agdCartStore'
import { useMounted } from '@/lib/agd/useMounted'
import { ProductImage } from './ProductImage'
import { ProductDialog } from './ProductDialog'

function Slot({
  product,
  className,
  imageClassName,
  onOpen,
}: {
  product: Appliance | undefined
  className?: string
  imageClassName: string
  onOpen: (p: Appliance) => void
}) {
  const inCart = useIsInCart(product ?? ({ brand: '', model: '' } as Appliance))
  const mounted = useMounted()
  if (!product) return null

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        className,
      )}
    >
      {mounted && inCart && (
        <span className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
          <ShoppingCart className="h-3.5 w-3.5" />
        </span>
      )}
      <ProductImage
        src={product.imageUrl}
        alt={`${product.brand} ${product.model}`}
        category={product.category}
        finish={product.finish}
        style={product.style}
        className={imageClassName}
      />
      <div className="border-t border-border px-2.5 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {PART_LABEL[product.category]}
        </p>
        <p className="truncate text-xs font-medium text-foreground">
          {product.brand} {product.model}
        </p>
        <p className="flex items-center justify-between text-sm font-semibold tabular-nums text-foreground">
          {formatPLN(product.price)}
          <span className="text-[10px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
            szczegóły →
          </span>
        </p>
      </div>
    </button>
  )
}

/**
 * Zestaw ułożony jak ściana kuchni: słupek z lodówką, słupek z piekarnikiem
 * i mikrofalówką oraz ciąg blatu z okapem, płytą i zmywarką pod blatem.
 * Kliknięcie w urządzenie otwiera popup z funkcjami, sklepami i koszykiem.
 */
export function KitchenLayout({ set }: { set: ApplianceSet }) {
  const [open, setOpen] = useState<Appliance | null>(null)
  const p = (part: AppliancePart) => productFor(set, part)

  return (
    <div className="rounded-xl border border-border bg-gradient-to-b from-muted/40 to-muted p-3 sm:p-5">
      <div className="mx-auto grid max-w-4xl grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_1.5fr] sm:gap-4">
        {/* Słupek lodówki */}
        <Slot product={p('fridge')} imageClassName="aspect-[1/1.75]" onOpen={setOpen} />

        {/* Słupek piekarnik + mikrofalówka */}
        <div className="flex flex-col gap-3">
          <Slot product={p('microwave')} imageClassName="aspect-[1.5/1]" onOpen={setOpen} />
          <Slot product={p('oven')} imageClassName="aspect-square" onOpen={setOpen} />
        </div>

        {/* Ciąg blatu: okap nad płytą, zmywarka pod blatem */}
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <Slot
            product={p('hood')}
            imageClassName="aspect-[2.2/1]"
            className="mx-auto w-full sm:w-4/5"
            onOpen={setOpen}
          />
          <div className="rounded-lg bg-stone-300/70 p-1.5 pt-2 dark:bg-stone-700/60">
            <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Blat
            </p>
            <Slot product={p('hob')} imageClassName="aspect-[2/1]" onOpen={setOpen} />
          </div>
          <Slot product={p('dishwasher')} imageClassName="aspect-[2/1]" onOpen={setOpen} />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Kliknij urządzenie, żeby zobaczyć funkcje, sklepy i dodać je do koszyka.
      </p>

      <ProductDialog product={open} setSlug={set.slug} onOpenChange={o => !o && setOpen(null)} />
    </div>
  )
}

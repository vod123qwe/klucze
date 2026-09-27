import { formatPLN } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import { PART_LABEL, productFor, type AppliancePart, type ApplianceSet } from '@/lib/agd/types'
import { ProductImage } from './ProductImage'

function Slot({
  set,
  part,
  className,
  imageClassName,
}: {
  set: ApplianceSet
  part: AppliancePart
  className?: string
  imageClassName: string
}) {
  const product = productFor(set, part)
  if (!product) return null

  return (
    <a
      href={`#${part}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <ProductImage
        src={product.imageUrl}
        alt={`${product.brand} ${product.model}`}
        category={part}
        finish={product.finish}
        style={product.style}
        className={imageClassName}
      />
      <div className="border-t border-border px-2.5 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {PART_LABEL[part]}
        </p>
        <p className="truncate text-xs font-medium text-foreground">
          {product.brand} {product.model}
        </p>
        <p className="text-sm font-semibold tabular-nums text-foreground">{formatPLN(product.price)}</p>
      </div>
    </a>
  )
}

/**
 * Zestaw ułożony jak ściana kuchni: słupek z lodówką, słupek z piekarnikiem
 * i mikrofalówką oraz ciąg blatu z płytą i okapem nad nią.
 */
export function KitchenLayout({ set }: { set: ApplianceSet }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-b from-muted/40 to-muted p-3 sm:p-5">
      <div className="mx-auto grid max-w-4xl grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_1.5fr] sm:gap-4">
        {/* Słupek lodówki */}
        <Slot set={set} part="fridge" imageClassName="aspect-[1/1.75]" />

        {/* Słupek piekarnik + mikrofalówka */}
        <div className="flex flex-col gap-3">
          <Slot set={set} part="microwave" imageClassName="aspect-[1.5/1]" />
          <Slot set={set} part="oven" imageClassName="aspect-square" />
        </div>

        {/* Ciąg blatu: okap nad płytą */}
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <Slot set={set} part="hood" imageClassName="aspect-[2/1]" className="mx-auto w-full sm:w-4/5" />
          <div className="hidden flex-1 sm:block" />
          <div className="rounded-lg bg-stone-300/70 p-1.5 pt-2 dark:bg-stone-700/60">
            <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Blat
            </p>
            <Slot set={set} part="hob" imageClassName="aspect-[1.8/1]" />
          </div>
        </div>
      </div>
    </div>
  )
}

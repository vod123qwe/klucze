import { BadgePercent, Check, Info } from 'lucide-react'
import { formatPLN } from '@/lib/utils/format'
import { PART_LABEL, type Appliance } from '@/lib/agd/types'
import { ProductImage } from './ProductImage'
import { ProductActions } from './ProductActions'

export function ProductCard({ product, setSlug }: { product: Appliance; setSlug: string }) {
  const discount = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0

  return (
    <article
      id={product.category}
      className="scroll-mt-20 overflow-hidden rounded-xl border border-border bg-card md:grid md:grid-cols-[220px_1fr]"
    >
      <ProductImage
        src={product.imageUrl}
        alt={`${product.brand} ${product.model}`}
        category={product.category}
        finish={product.finish}
        style={product.style}
        className="aspect-[4/3] border-b border-border md:aspect-auto md:border-r md:border-b-0"
      />

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {PART_LABEL[product.category]}
            </p>
            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.brand} {product.model}
            </h3>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <div className="text-right">
            {discount > 0 && (
              <p className="text-xs text-muted-foreground line-through tabular-nums">{formatPLN(product.oldPrice!)}</p>
            )}
            <p className="text-xl font-semibold tabular-nums text-foreground">{formatPLN(product.price)}</p>
            <p className="text-[11px] text-muted-foreground">
              {product.priceConfidence === 'live' ? 'cena ze sklepu' : 'cena szacunkowa'}
            </p>
          </div>
        </header>

        {product.promo && (
          <div className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <BadgePercent className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{product.promo}</span>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="space-y-1.5">
            {product.features.map(f => (
              <li key={f} className="flex gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 self-start rounded-lg bg-muted/60 p-3 text-xs">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {product.notes && (
          <p className="flex gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{product.notes}</span>
          </p>
        )}

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
          <ProductActions product={product} setSlug={setSlug} />
          {product.otherStores.length > 0 && (
            <span className="text-muted-foreground">
              {product.otherStores.map((s, i) => (
                <span key={s.store}>
                  {i > 0 && ' · '}
                  {s.store} <span className="tabular-nums">{formatPLN(s.price)}</span>
                </span>
              ))}
            </span>
          )}
        </footer>
      </div>
    </article>
  )
}

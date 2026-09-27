import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BadgePercent, ThumbsDown, ThumbsUp } from 'lucide-react'
import { APPLIANCE_SETS, PRICES_CHECKED_AT } from '@/lib/agd/sets'
import { PART_ORDER, productFor, setOldTotal, setTotal } from '@/lib/agd/types'
import { formatPLN } from '@/lib/utils/format'
import { KitchenLayout } from '@/components/agd/KitchenLayout'
import { ProductCard } from '@/components/agd/ProductCard'
import { VariantSwitcher } from '@/components/agd/VariantSwitcher'

export function generateStaticParams() {
  return APPLIANCE_SETS.map(set => ({ wariant: set.slug }))
}

export default async function WariantPage({ params }: { params: Promise<{ wariant: string }> }) {
  const { wariant } = await params
  const index = APPLIANCE_SETS.findIndex(s => s.slug === wariant)
  if (index === -1) notFound()

  const set = APPLIANCE_SETS[index]
  const prev = APPLIANCE_SETS[index - 1]
  const next = APPLIANCE_SETS[index + 1]
  const total = setTotal(set)
  const oldTotal = setOldTotal(set)

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
      <VariantSwitcher activeSlug={set.slug} />

      {/* Nagłówek wariantu */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: set.accent }} />
            Wariant {index + 1} z {APPLIANCE_SETS.length} · {set.priceRange}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {set.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{set.tagline}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Cały zestaw (5 urządzeń)</p>
          {oldTotal > total && (
            <p className="text-sm text-muted-foreground line-through tabular-nums">{formatPLN(oldTotal)}</p>
          )}
          <p className="text-3xl font-semibold tabular-nums">{formatPLN(total)}</p>
          {oldTotal > total && (
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              oszczędzasz {formatPLN(oldTotal - total)} na promocjach
            </p>
          )}
        </div>
      </header>

      <KitchenLayout set={set} />

      {/* Zalety / wady */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
            <ThumbsUp className="h-4 w-4" /> Kluczowe zalety
          </h2>
          <ul className="space-y-2 text-sm">
            {set.pros.map(p => (
              <li key={p} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-900 dark:bg-rose-950/30">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-rose-900 dark:text-rose-200">
            <ThumbsDown className="h-4 w-4" /> Wady i na co uważać
          </h2>
          <ul className="space-y-2 text-sm">
            {set.cons.map(c => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm">
        <span className="font-medium">Dla kogo: </span>
        {set.bestFor}
      </p>

      {/* Promocje */}
      {set.setPromos.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900 dark:bg-amber-950/30">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
            <BadgePercent className="h-4 w-4" /> Promocje przy zakupie zestawu
          </h2>
          <ul className="space-y-2 text-sm">
            {set.setPromos.map(p => (
              <li key={p} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Produkty */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Urządzenia w zestawie
        </h2>
        {PART_ORDER.map(part => {
          const product = productFor(set, part)
          return product ? <ProductCard key={part} product={product} /> : null
        })}
      </section>

      <p className="text-xs text-muted-foreground">
        Ceny orientacyjne z ofert polskich sklepów, zebrane {PRICES_CHECKED_AT}. Promocje zmieniają się co kilka dni —
        przed zakupem sprawdź aktualną cenę (np. na Ceneo) i dostępność wybranej wersji montażu płyty.
      </p>

      {/* Nawigacja między wariantami */}
      <nav className="flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
        {prev ? (
          <Link href={`/agd/${prev.slug}`} className="inline-flex items-center gap-1.5 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> {prev.label}
          </Link>
        ) : (
          <Link href="/agd" className="inline-flex items-center gap-1.5 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Porównanie
          </Link>
        )}
        {next && (
          <Link href={`/agd/${next.slug}`} className="inline-flex items-center gap-1.5 hover:text-primary">
            {next.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </div>
  )
}

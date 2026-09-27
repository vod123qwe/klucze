import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import { APPLIANCE_SETS, COMPARE_ROWS, PRICES_CHECKED_AT } from '@/lib/agd/sets'
import { PART_LABEL, PART_ORDER, productFor, setOldTotal, setTotal } from '@/lib/agd/types'
import { formatPLN } from '@/lib/utils/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { ProductImage } from '@/components/agd/ProductImage'
import { VariantSwitcher } from '@/components/agd/VariantSwitcher'

export default function AgdPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
      <PageHeader
        className="px-0 py-0"
        title="AGD do kuchni — zestawy"
        description="Okap, płyta indukcyjna (montaż na blat lub na równo z blatem), piekarnik, mikrofalówka i lodówka do zabudowy — w czterech przedziałach cenowych."
      />

      <VariantSwitcher />

      <section className="grid gap-4 lg:grid-cols-2">
        {APPLIANCE_SETS.map((set, i) => {
          const total = setTotal(set)
          const oldTotal = setOldTotal(set)
          return (
            <Link
              key={set.slug}
              href={`/agd/${set.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="h-1" style={{ background: set.accent }} />
              <div className="flex items-start justify-between gap-3 p-4 pb-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Wariant {i + 1} · {set.priceRange}
                  </p>
                  <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {set.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">{set.tagline}</p>
                </div>
                <div className="shrink-0 text-right">
                  {oldTotal > total && (
                    <p className="text-xs text-muted-foreground line-through tabular-nums">{formatPLN(oldTotal)}</p>
                  )}
                  <p className="text-xl font-semibold tabular-nums">{formatPLN(total)}</p>
                </div>
              </div>

              {/* Pasek zdjęć całego zestawu */}
              <div className="grid grid-cols-5 gap-1.5 bg-muted/60 p-2">
                {PART_ORDER.map(part => {
                  const p = productFor(set, part)
                  if (!p) return <div key={part} />
                  return (
                    <div key={part} className="overflow-hidden rounded-md border border-border bg-white">
                      <ProductImage src={p.imageUrl} alt={PART_LABEL[part]} category={part} finish={p.finish} style={p.style} className="aspect-square" />
                      <p className="truncate border-t border-border px-1 py-0.5 text-center text-[10px] text-muted-foreground">
                        {PART_LABEL[part]}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <ul className="space-y-1 text-sm">
                  {set.pros.slice(0, 3).map(p => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Zobacz zestaw, zalety i wady
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )
        })}
      </section>

      {/* Tabela porównawcza */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Porównanie wariantów
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60 text-left">
                <th className="px-3 py-2.5 font-medium text-muted-foreground" />
                {APPLIANCE_SETS.map(set => (
                  <th key={set.slug} className="px-3 py-2.5 font-semibold">
                    <Link href={`/agd/${set.slug}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                      <span className="h-2 w-2 rounded-full" style={{ background: set.accent }} />
                      {set.label}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Cena zestawu</td>
                {APPLIANCE_SETS.map(set => (
                  <td key={set.slug} className="px-3 py-2 font-semibold tabular-nums">
                    {formatPLN(setTotal(set))}
                  </td>
                ))}
              </tr>
              {PART_ORDER.map(part => (
                <tr key={part} className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">{PART_LABEL[part]}</td>
                  {APPLIANCE_SETS.map(set => {
                    const p = productFor(set, part)
                    return (
                      <td key={set.slug} className="px-3 py-2">
                        {p && (
                          <>
                            <span className="block">
                              {p.brand} {p.model}
                            </span>
                            <span className="text-xs tabular-nums text-muted-foreground">{formatPLN(p.price)}</span>
                          </>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {COMPARE_ROWS.map(row => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-muted-foreground">{row}</td>
                  {APPLIANCE_SETS.map(set => (
                    <td key={set.slug} className="px-3 py-2">
                      {set.compare[row] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="flex gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ceny orientacyjne z ofert polskich sklepów, zebrane {PRICES_CHECKED_AT} — przed zakupem sprawdź aktualną cenę. Kliknij wariant, żeby zobaczyć zestaw ułożony jak w kuchni,
        szczegóły każdego urządzenia oraz listę zalet i wad.
      </p>
    </div>
  )
}

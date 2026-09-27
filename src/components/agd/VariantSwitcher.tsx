import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPLN } from '@/lib/utils/format'
import { setTotal } from '@/lib/agd/types'
import { APPLIANCE_SETS } from '@/lib/agd/sets'

export function VariantSwitcher({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      <Link
        href="/agd"
        className={cn(
          'shrink-0 rounded-lg border px-3 py-2 text-sm transition',
          !activeSlug
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card hover:bg-muted',
        )}
      >
        <span className="block font-medium">Porównanie</span>
        <span className={cn('block text-xs', !activeSlug ? 'opacity-80' : 'text-muted-foreground')}>
          wszystkie warianty
        </span>
      </Link>
      {APPLIANCE_SETS.map(set => {
        const active = set.slug === activeSlug
        return (
          <Link
            key={set.slug}
            href={`/agd/${set.slug}`}
            className={cn(
              'shrink-0 rounded-lg border px-3 py-2 text-sm transition',
              active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted',
            )}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full" style={{ background: set.accent }} />
              {set.label}
            </span>
            <span className={cn('block text-xs tabular-nums', active ? 'opacity-80' : 'text-muted-foreground')}>
              {formatPLN(setTotal(set))}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

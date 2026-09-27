'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPLN } from '@/lib/utils/format'
import { useAgdCart } from '@/stores/agdCartStore'
import { useMounted } from '@/lib/agd/useMounted'

export function CartLink({ active }: { active: boolean }) {
  const items = useAgdCart(s => s.items)
  const mounted = useMounted()
  const count = mounted ? items.length : 0
  const total = mounted ? items.reduce((s, i) => s + i.offer.price, 0) : 0

  return (
    <Link
      href="/agd/koszyk"
      className={cn(
        'shrink-0 rounded-lg border px-3 py-2 text-sm transition',
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted',
      )}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <ShoppingCart className="h-3.5 w-3.5" /> Koszyk
        {count > 0 && (
          <span className="rounded-full bg-emerald-600 px-1.5 text-[10px] font-semibold text-white">{count}</span>
        )}
      </span>
      <span className={cn('block text-xs tabular-nums', active ? 'opacity-80' : 'text-muted-foreground')}>
        {count > 0 ? formatPLN(total) : 'pusty'}
      </span>
    </Link>
  )
}

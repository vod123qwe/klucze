/**
 * Formats a number as Polish złoty (PLN)
 */
export function formatPLN(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace('.', ',')} mln zł`
  }
  if (compact && Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)} tys. zł`
  }
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a date string (ISO or YYYY-MM) to Polish locale
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    // Handle YYYY-MM format
    const normalized = dateStr.length === 7 ? dateStr + '-01' : dateStr
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: dateStr.length === 7 ? undefined : 'numeric',
    }).format(new Date(normalized))
  } catch {
    return dateStr
  }
}

/**
 * Formats a YYYY-MM string to short month label (e.g. "sty 2025")
 */
export function formatMonthShort(month: string): string {
  try {
    return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'short' }).format(
      new Date(month + '-01'),
    )
  } catch {
    return month
  }
}

/**
 * Returns current month as YYYY-MM
 */
export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Adds N months to a YYYY-MM string
 */
export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Generates a simple UUID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Returns positive/negative CSS class for a number
 */
export function amountColor(value: number): string {
  if (value > 0) return 'text-emerald-600'
  if (value < 0) return 'text-red-500'
  return 'text-muted-foreground'
}

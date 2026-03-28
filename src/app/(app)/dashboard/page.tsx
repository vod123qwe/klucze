'use client'

import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ArrowRight, Home, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/db/db'
import { buildCashflowProjection, calcSavingsAt } from '@/lib/calculations/cashflow'
import { calcEqualInstallment } from '@/lib/calculations/mortgage'
import { formatPLN, formatDate, currentMonth, formatMonthShort } from '@/lib/utils/format'
import { KpiCard } from '@/components/shared/KpiCard'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

function getMonthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

export default function DashboardPage() {
  const property = useLiveQuery(() => db.property.get('main'))
  const purchaseCosts = useLiveQuery(() => db.purchaseCosts.toArray(), [])
  const mortgage = useLiveQuery(() => db.mortgage.get('main'))
  const tranches = useLiveQuery(() => db.mortgageTranches.toArray(), [])
  const incomes = useLiveQuery(() => db.householdIncomes.toArray(), [])
  const expenses = useLiveQuery(() => db.householdExpenses.toArray(), [])
  const savingsPlan = useLiveQuery(() => db.savingsPlan.get('main'))
  const milestones = useLiveQuery(() => db.milestones.orderBy('date').toArray(), [])

  // ── Financials ────────────────────────────────────────────────────────────
  const totalPurchaseCost = purchaseCosts?.reduce((s, c) => s + c.amount, 0) ?? 0

  const totalRate = mortgage ? mortgage.interestRate + mortgage.margin : 0
  const targetInstallment = mortgage && mortgage.amount > 0
    ? calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths)
    : 0

  const projection = useMemo(() => {
    if (!incomes || !expenses) return []
    return buildCashflowProjection(
      currentMonth(),
      48,
      incomes ?? [],
      expenses ?? [],
      mortgage ?? null,
      tranches ?? [],
      savingsPlan?.initialSavings ?? 0,
    )
  }, [incomes, expenses, mortgage, tranches, savingsPlan])

  const deliveryMonth = property?.deliveryDate
    ? property.deliveryDate.slice(0, 7)
    : null

  const savingsAtDelivery = deliveryMonth
    ? calcSavingsAt(deliveryMonth, projection)
    : null

  const latestSavings = projection.length > 0
    ? projection[projection.length - 1].savingsEnd
    : savingsPlan?.currentSavings ?? 0

  const monthlyMargin = projection.length > 0
    ? projection[0].savable
    : (incomes?.reduce((s, i) => s + (i.frequency === 'monthly' ? i.amountNet : 0), 0) ?? 0) -
      (expenses?.reduce((s, e) => s + (e.frequency === 'monthly' ? e.amount : 0), 0) ?? 0)

  // ── Alerts ────────────────────────────────────────────────────────────────
  const alerts: { variant: 'warning' | 'critical' | 'info'; text: string }[] = []

  const safetyBuffer = savingsPlan?.safetyBuffer ?? 20000
  if (savingsAtDelivery !== null && savingsAtDelivery < safetyBuffer) {
    alerts.push({
      variant: 'critical',
      text: `Prognoza oszczędności na odbiór (${formatPLN(savingsAtDelivery)}) jest poniżej poduszki bezpieczeństwa (${formatPLN(safetyBuffer)}).`,
    })
  }
  if (monthlyMargin < 0) {
    alerts.push({
      variant: 'critical',
      text: `Miesięczny bilans jest ujemny: ${formatPLN(monthlyMargin)}. Plan finansowy wymaga korekty.`,
    })
  }
  if (mortgage && tranches && tranches.length > 0) {
    const trancheTotal = tranches.reduce((s, t) => s + t.amount, 0)
    if (Math.abs(trancheTotal - mortgage.amount) > 100) {
      alerts.push({
        variant: 'warning',
        text: `Suma transz (${formatPLN(trancheTotal)}) nie zgadza się z kwotą kredytu (${formatPLN(mortgage.amount)}).`,
      })
    }
  }
  if (!property?.deliveryDate) {
    alerts.push({ variant: 'info', text: 'Uzupełnij datę odbioru mieszkania w sekcji Mieszkanie.' })
  }

  // ── Upcoming milestones ───────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = milestones?.filter(m => m.date >= today && m.status === 'planned').slice(0, 5) ?? []

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartData = projection.slice(0, 36).map(row => ({
    month: formatMonthShort(row.month),
    savings: row.savingsEnd,
    isDelivery: deliveryMonth === row.month,
  }))

  // ── Empty state ───────────────────────────────────────────────────────────
  const hasData = (incomes?.length ?? 0) > 0 || totalPurchaseCost > 0

  return (
    <div className="px-6 py-5 max-w-5xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {property?.investmentName ? property.investmentName : 'Dashboard'}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {property?.developer && `${property.developer} · `}
          {property?.deliveryDate
            ? `Odbiór: ${formatDate(property.deliveryDate)}`
            : 'Uzupełnij dane mieszkania'}
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-5 space-y-2">
          {alerts.map((a, i) => (
            <AlertBanner key={i} variant={a.variant}>{a.text}</AlertBanner>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Koszt zakupu"
          value={totalPurchaseCost > 0 ? formatPLN(totalPurchaseCost) : '—'}
          accent
        />
        <KpiCard
          label="Rata docelowa"
          value={targetInstallment > 0 ? formatPLN(targetInstallment) : '—'}
          sublabel={totalRate > 0 ? `${totalRate.toFixed(2)}% / ${mortgage?.periodMonths ?? '?'} mies.` : undefined}
        />
        <KpiCard
          label="Oszczędności dziś"
          value={formatPLN(savingsPlan?.currentSavings ?? 0)}
        />
        <KpiCard
          label={deliveryMonth ? 'Prognoza na odbiór' : 'Prognoza 12M'}
          value={savingsAtDelivery !== null ? formatPLN(savingsAtDelivery) : formatPLN(latestSavings)}
          alert={savingsAtDelivery !== null && savingsAtDelivery < safetyBuffer ? 'critical' : undefined}
        />
        <KpiCard
          label="Miesięczna nadwyżka"
          value={formatPLN(monthlyMargin)}
          alert={monthlyMargin < 0 ? 'critical' : monthlyMargin < 2000 ? 'warning' : undefined}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Savings chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Projekcja oszczędności</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <SectionEmptyState
                  title="Brak danych"
                  description="Dodaj przychody i wydatki, aby zobaczyć wykres"
                />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      interval={5}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(val) => [formatPLN(Number(val)), 'Oszczędności']}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--card)',
                      }}
                    />
                    {safetyBuffer > 0 && (
                      <ReferenceLine
                        y={safetyBuffer}
                        stroke="var(--destructive)"
                        strokeDasharray="4 4"
                        label={{ value: 'Poduszka', fontSize: 10, fill: 'var(--destructive)' }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming milestones */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Najbliższe terminy</CardTitle>
              <Link href="/harmonogram" className="text-xs text-primary flex items-center gap-1 hover:underline">
                Wszystkie <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {upcoming.length === 0 ? (
                <div className="px-4 pb-4">
                  <SectionEmptyState
                    icon={Calendar}
                    title="Brak nadchodzących zdarzeń"
                    description="Dodaj terminy w sekcji Harmonogram"
                  />
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {upcoming.map((m) => {
                    const daysLeft = Math.ceil((new Date(m.date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={m.id} className="flex items-start gap-3 px-4 py-2.5">
                        <div className={cn(
                          'mt-0.5 h-2 w-2 rounded-full shrink-0',
                          daysLeft <= 7 ? 'bg-red-400' : daysLeft <= 30 ? 'bg-amber-400' : 'bg-blue-400',
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.label}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                        </div>
                        <span className={cn(
                          'text-[11px] shrink-0 font-medium',
                          daysLeft <= 7 ? 'text-red-500' : daysLeft <= 30 ? 'text-amber-600' : 'text-muted-foreground',
                        )}>
                          {daysLeft === 0 ? 'dziś' : `za ${daysLeft}d`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick links to fill in */}
      {!hasData && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Zacznij od uzupełnienia danych
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { href: '/mieszkanie', label: 'Mieszkanie', desc: 'Dane nieruchomości' },
              { href: '/koszty', label: 'Koszty zakupu', desc: 'Ceny i opłaty' },
              { href: '/kredyt', label: 'Kredyt', desc: 'Parametry i transze' },
              { href: '/budzet', label: 'Budżet', desc: 'Przychody i wydatki' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-muted/20 transition-colors"
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

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
import { ArrowRight, Calendar } from 'lucide-react'
import { db } from '@/lib/db/db'
import { calcEqualInstallment } from '@/lib/calculations/mortgage'
import { formatPLN, formatDate, currentMonth, formatMonthShort } from '@/lib/utils/format'
import { KpiCard } from '@/components/shared/KpiCard'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const now = currentMonth()

  const property = useLiveQuery(() => db.property.get('main'))
  const purchaseCosts = useLiveQuery(() => db.purchaseCosts.toArray(), [])
  const mortgage = useLiveQuery(() => db.mortgage.get('main'))
  const incomes = useLiveQuery(() => db.householdIncomes.toArray(), [])
  const expenses = useLiveQuery(() => db.householdExpenses.toArray(), [])
  const savingsPlan = useLiveQuery(() => db.savingsPlan.get('main'))
  const budgetMonths = useLiveQuery(() => db.budgetMonths.orderBy('id').toArray(), [])
  const milestones = useLiveQuery(() => db.milestones.orderBy('date').toArray(), [])

  // ── Mortgage ───────────────────────────────────────────────────────────────
  const totalRate = mortgage ? mortgage.interestRate + mortgage.margin : 0
  const targetInstallment =
    mortgage && mortgage.amount > 0
      ? calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths)
      : 0

  // ── Purchase costs ─────────────────────────────────────────────────────────
  const totalPurchaseCost = purchaseCosts?.reduce((s, c) => s + c.amount, 0) ?? 0

  // ── Delivery month ─────────────────────────────────────────────────────────
  const deliveryMonth = property?.deliveryDate?.slice(0, 7) ?? null

  // ── Current month data (oneTime entries for this month) ───────────────────
  const curIncomes = useMemo(
    () => incomes?.filter(i => i.frequency === 'oneTime' && i.month === now) ?? [],
    [incomes, now],
  )
  const curExpenses = useMemo(
    () => expenses?.filter(e => e.frequency === 'oneTime' && e.month === now) ?? [],
    [expenses, now],
  )
  const curBudgetMonth = budgetMonths?.find(m => m.id === now)

  const curTotalIncome = curIncomes.reduce((s, i) => s + i.amountNet, 0)
  const curTotalExpenses = curExpenses.reduce((s, e) => s + e.amount, 0)
  const curSavedAmount = curBudgetMonth?.savedAmount ?? 0
  const curRemainder = curTotalIncome - curSavedAmount - curTotalExpenses

  // ── Savings curve (from opened months + savedAmount – withdrawals) ──────────
  const initialSavings = savingsPlan?.initialSavings ?? 0

  const chartData = useMemo(() => {
    if (!budgetMonths || budgetMonths.length === 0) return []
    const withdrawalsByMonth = (expenses ?? [])
      .filter(e => e.isSavingsWithdrawal && e.month)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.month!] = (acc[e.month!] ?? 0) + e.amount
        return acc
      }, {})
    let cumulative = initialSavings
    return budgetMonths.map(m => {
      cumulative += m.savedAmount - (withdrawalsByMonth[m.id] ?? 0)
      return { monthId: m.id, savings: cumulative }
    })
  }, [budgetMonths, initialSavings, expenses])

  // ── Savings at delivery ────────────────────────────────────────────────────
  const savingsAtDelivery = useMemo(() => {
    if (!deliveryMonth || chartData.length === 0) return null
    const atOrBefore = chartData.filter(d => d.monthId <= deliveryMonth)
    if (atOrBefore.length === 0) return initialSavings
    return atOrBefore[atOrBefore.length - 1].savings
  }, [deliveryMonth, chartData, initialSavings])

  // ── Alerts ────────────────────────────────────────────────────────────────
  const safetyBuffer = savingsPlan?.safetyBuffer ?? 20000
  const alerts: { variant: 'warning' | 'critical' | 'info'; text: string }[] = []

  if (savingsAtDelivery !== null && savingsAtDelivery < safetyBuffer) {
    alerts.push({
      variant: 'critical',
      text: `Prognoza oszczędności na odbiór (${formatPLN(savingsAtDelivery)}) jest poniżej poduszki bezpieczeństwa (${formatPLN(safetyBuffer)}).`,
    })
  }
  if (curRemainder < 0 && curTotalIncome > 0) {
    alerts.push({
      variant: 'warning',
      text: `W ${formatDate(now)} zostaje na życie: ${formatPLN(curRemainder)}.`,
    })
  }
  if (!property?.deliveryDate) {
    alerts.push({ variant: 'info', text: 'Uzupełnij datę odbioru mieszkania w sekcji Mieszkanie.' })
  }

  // ── Upcoming milestones ───────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const upcoming =
    milestones?.filter(m => m.date >= today && m.status === 'planned').slice(0, 5) ?? []

  const hasData = (budgetMonths?.length ?? 0) > 0 || (incomes?.length ?? 0) > 0

  return (
    <div className="px-6 py-5 mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {property?.investmentName ?? 'Dashboard'}
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
            <AlertBanner key={i} variant={a.variant}>
              {a.text}
            </AlertBanner>
          ))}
        </div>
      )}

      {/* Current month */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Bieżący miesiąc — {formatDate(now)}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Przychody"
            value={curTotalIncome > 0 ? formatPLN(curTotalIncome) : '—'}
          />
          <KpiCard
            label="Wydatki"
            value={curTotalExpenses > 0 ? formatPLN(curTotalExpenses) : '—'}
          />
          <KpiCard
            label="Odkładam"
            value={curSavedAmount > 0 ? formatPLN(curSavedAmount) : '—'}
            valueClassName="text-violet-600"
            accent
          />
          <KpiCard
            label="Zostaje na życie"
            value={curTotalIncome > 0 ? formatPLN(curRemainder) : '—'}
            alert={curRemainder < 0 && curTotalIncome > 0 ? 'critical' : undefined}
            valueClassName={
              curRemainder >= 0 && curTotalIncome > 0 ? 'text-emerald-600' : undefined
            }
          />
        </div>
      </div>

      {/* Big picture */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Ogólny plan
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Oszczędności dziś"
            value={formatPLN(savingsPlan?.currentSavings ?? 0)}
          />
          <KpiCard
            label={deliveryMonth ? 'Prognoza na odbiór' : 'Prognoza łącznie'}
            value={
              savingsAtDelivery !== null
                ? formatPLN(savingsAtDelivery)
                : chartData.length > 0
                  ? formatPLN(chartData[chartData.length - 1].savings)
                  : '—'
            }
            alert={
              savingsAtDelivery !== null && savingsAtDelivery < safetyBuffer
                ? 'critical'
                : undefined
            }
          />
          <KpiCard
            label="Rata docelowa"
            value={targetInstallment > 0 ? formatPLN(targetInstallment) : '—'}
            sublabel={
              totalRate > 0
                ? `${totalRate.toFixed(2)}% / ${mortgage?.periodMonths ?? '?'} mies.`
                : undefined
            }
          />
          <KpiCard
            label="Koszt zakupu"
            value={totalPurchaseCost > 0 ? formatPLN(totalPurchaseCost) : '—'}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Savings chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Krzywa oszczędności</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <SectionEmptyState
                  title="Brak danych"
                  description="Otwórz miesiące w Budżecie i ustaw kwoty odkładania"
                />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="monthId"
                      tickFormatter={formatMonthShort}
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={val => [formatPLN(Number(val)), 'Oszczędności']}
                      labelFormatter={(v) => formatMonthShort(String(v))}
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
                        label={{
                          value: 'Poduszka',
                          fontSize: 10,
                          fill: 'var(--destructive)',
                          position: 'insideTopRight',
                        }}
                      />
                    )}
                    {deliveryMonth && chartData.some(d => d.monthId === deliveryMonth) && (
                      <ReferenceLine
                        x={deliveryMonth}
                        stroke="var(--primary)"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Odbiór',
                          fontSize: 10,
                          fill: 'var(--primary)',
                          position: 'insideTopLeft',
                        }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'var(--chart-1)' }}
                      activeDot={{ r: 5 }}
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
              <Link
                href="/harmonogram"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
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
                  {upcoming.map(m => {
                    const daysLeft = Math.ceil(
                      (new Date(m.date).getTime() - new Date(today).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )
                    return (
                      <div key={m.id} className="flex items-start gap-3 px-4 py-2.5">
                        <div
                          className={cn(
                            'mt-0.5 h-2 w-2 rounded-full shrink-0',
                            daysLeft <= 7
                              ? 'bg-red-400'
                              : daysLeft <= 30
                                ? 'bg-amber-400'
                                : 'bg-blue-400',
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.label}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                        </div>
                        <span
                          className={cn(
                            'text-[11px] shrink-0 font-medium',
                            daysLeft <= 7
                              ? 'text-red-500'
                              : daysLeft <= 30
                                ? 'text-amber-600'
                                : 'text-muted-foreground',
                          )}
                        >
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

      {/* Quick links when no data */}
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
            ].map(item => (
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

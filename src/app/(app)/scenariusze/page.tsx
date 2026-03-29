'use client'

import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { KpiCard } from '@/components/shared/KpiCard'
import { db } from '@/lib/db/db'
import { calcEqualInstallment, calcOverpaymentSchedule } from '@/lib/calculations/mortgage'
import { formatPLN } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

// ─── helpers ──────────────────────────────────────────────────────────────────

function toMonthly(amount: number, frequency: string): number {
  if (frequency === 'quarterly') return amount / 3
  if (frequency === 'annual') return amount / 12
  return amount
}

function statusLabel(ok: boolean, warn: boolean): { text: string; color: string } {
  if (ok) return { text: 'OK', color: 'text-emerald-600 bg-emerald-50' }
  if (warn) return { text: 'UWAGA', color: 'text-amber-600 bg-amber-50' }
  return { text: 'KRYTYCZNY', color: 'text-rose-600 bg-rose-50' }
}

function Delta({ value, unit = 'PLN' }: { value: number; unit?: string }) {
  const isPos = value > 0
  const isZero = value === 0
  return (
    <span className={cn('text-xs font-medium tabular-nums', isZero ? 'text-muted-foreground' : isPos ? 'text-emerald-600' : 'text-rose-600')}>
      {isPos ? '+' : ''}{unit === 'PLN' ? formatPLN(value) : `${value} mies.`}
    </span>
  )
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

// ─── Scenario card ────────────────────────────────────────────────────────────

function ScenarioCard({
  title, description, input, result,
}: {
  title: string
  description: string
  input: React.ReactNode
  result: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>{input}</div>
        <div>{result}</div>
      </div>
    </div>
  )
}

// ─── Toggle group ─────────────────────────────────────────────────────────────

function ToggleGroup<T extends string | number>({
  options, value, onChange, label,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="flex gap-1 flex-wrap">
        {options.map(o => (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full border font-medium transition-colors',
              value === o.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ScenariuszePage() {
  const [tab, setTab] = useState<'scenarios' | 'overpayment'>('scenarios')

  // ── DB ──────────────────────────────────────────────────────────────────────
  const mortgage    = useLiveQuery(() => db.mortgage.toArray().then(r => r[0] ?? null))
  const tranches    = useLiveQuery(() => db.mortgageTranches.toArray(), [])
  const incomes     = useLiveQuery(() => db.householdIncomes.toArray(), [])
  const expenses    = useLiveQuery(() => db.householdExpenses.toArray(), [])
  const savingsPlan = useLiveQuery(() => db.savingsPlan.toArray().then(r => r[0] ?? null))
  const fitoutItems = useLiveQuery(() => db.fitoutItems.toArray(), [])
  const budgetMonths = useLiveQuery(() => db.budgetMonths.toArray(), [])

  // ── Base financials ──────────────────────────────────────────────────────────
  const totalRate = useMemo(() =>
    mortgage ? (mortgage.interestRate + mortgage.margin) : 0
  , [mortgage])

  const baseInstallment = useMemo(() =>
    mortgage ? calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths) : 0
  , [mortgage, totalRate])

  const baseMonthlyIncome = useMemo(() =>
    (incomes ?? [])
      .filter(i => i.frequency !== 'oneTime' as string)
      .reduce((s, i) => s + toMonthly(i.amountNet, i.frequency), 0)
  , [incomes])

  const baseMonthlyExpenses = useMemo(() =>
    (expenses ?? [])
      .filter(e => e.frequency !== 'oneTime' && !e.isSavingsWithdrawal)
      .reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0)
  , [expenses])

  const baseCashflow = useMemo(() =>
    baseMonthlyIncome - baseMonthlyExpenses - baseInstallment
  , [baseMonthlyIncome, baseMonthlyExpenses, baseInstallment])

  const currentSavings = savingsPlan?.currentSavings ?? 0
  const safetyBuffer   = savingsPlan?.safetyBuffer ?? 0

  const walletBalance = useMemo(() => {
    const deposited = (budgetMonths ?? []).reduce((s, m) => s + (m.savedAmount ?? 0), 0)
    const withdrawn = (expenses ?? [])
      .filter(e => e.isSavingsWithdrawal)
      .reduce((s, e) => s + e.amount, 0)
    return currentSavings + deposited - withdrawn
  }, [currentSavings, budgetMonths, expenses])

  const fitoutCostMin = useMemo(() =>
    (fitoutItems ?? []).reduce((s, i) => s + (i.costMin ?? 0), 0)
  , [fitoutItems])

  const fitoutCostTarget = useMemo(() =>
    (fitoutItems ?? []).reduce((s, i) => s + (i.costTarget ?? 0), 0)
  , [fitoutItems])

  // Monthly rent from expenses (largest "Mieszkanie" category expense, as proxy)
  const monthlyRent = useMemo(() =>
    (expenses ?? [])
      .filter(e => e.frequency === 'monthly' && e.category.toLowerCase().includes('mieszkan'))
      .reduce((s, e) => s + e.amount, 0)
  , [expenses])

  // ── Scenario inputs ──────────────────────────────────────────────────────────
  const [incomeDrop, setIncomeDrop]     = useState<number>(20)
  const [rateDelta, setRateDelta]       = useState<number>(1)
  const [delayMonths, setDelayMonths]   = useState<number>(3)
  const [fitoutPct, setFitoutPct]       = useState<number>(20)

  // Scenario results
  const sc1Income = baseMonthlyIncome * (1 - incomeDrop / 100)
  const sc1Cash   = sc1Income - baseMonthlyExpenses - baseInstallment
  const sc1OK     = sc1Cash >= 0
  const sc1Warn   = sc1Cash >= -safetyBuffer

  const sc2Rate        = totalRate + rateDelta
  const sc2Installment = mortgage ? calcEqualInstallment(mortgage.amount, sc2Rate, mortgage.periodMonths) : 0
  const sc2Delta       = sc2Installment - baseInstallment
  const sc2Cash        = baseCashflow - sc2Delta
  const sc2OK          = sc2Cash >= 0
  const sc2Warn        = sc2Cash >= -safetyBuffer

  const sc3RentExtra   = monthlyRent * delayMonths
  const sc3ExtraSaved  = Math.max(0, baseCashflow) * delayMonths
  const sc3NetImpact   = sc3ExtraSaved - sc3RentExtra
  const sc3OK          = sc3NetImpact >= 0
  const sc3Warn        = sc3NetImpact >= -5000

  const sc4FitoutMin    = fitoutCostMin * (1 + fitoutPct / 100)
  const sc4FitoutTarget = fitoutCostTarget * (1 + fitoutPct / 100)
  const sc4GapMin       = walletBalance - sc4FitoutMin
  const sc4GapTarget    = walletBalance - sc4FitoutTarget
  const sc4OK           = sc4GapMin >= 0
  const sc4Warn         = sc4GapTarget >= 0

  // Stress test: -20% dochodu + +2pp stopy + +20% wykończenia
  const stressIncome      = baseMonthlyIncome * 0.8
  const stressInstallment = mortgage ? calcEqualInstallment(mortgage.amount, totalRate + 2, mortgage.periodMonths) : 0
  const stressCash        = stressIncome - baseMonthlyExpenses - stressInstallment
  const stressFitoutMin   = fitoutCostMin * 1.2
  const stressGapMin      = walletBalance - stressFitoutMin
  const stressOK          = stressCash >= 0 && stressGapMin >= 0
  const stressWarn        = stressCash >= -safetyBuffer && stressGapMin >= -20000

  // Buffer
  const monthsBuffer = baseCashflow > 0
    ? Math.floor(walletBalance / (baseMonthlyExpenses + baseInstallment))
    : 0

  // ── Overpayment inputs ───────────────────────────────────────────────────────
  const [ovAmt,      setOvAmt]      = useState(10000)
  const [ovType,     setOvType]     = useState<'oneTime' | 'monthly'>('oneTime')
  const [ovStart,    setOvStart]    = useState(0)
  const [ovDuration, setOvDuration] = useState(0) // 0 = zawsze; else months

  const overpaymentPrincipal = mortgage?.amount ?? 0
  const overpaymentMonths    = mortgage?.periodMonths ?? 0
  const overpaymentInstType  = mortgage?.installmentType ?? 'equal'

  const baseSchedule = useMemo(() => {
    if (!mortgage || overpaymentPrincipal <= 0) return []
    return calcOverpaymentSchedule(
      overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType,
      0, 'oneTime', 0, 'reducePeriod',
    )
  }, [mortgage, overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType])

  const ovEndMonth = ovType === 'monthly' && ovDuration > 0 ? ovStart + ovDuration : undefined

  // Two schedules — always compute both effects simultaneously
  const ovSchedulePeriod = useMemo(() => {
    if (!mortgage || overpaymentPrincipal <= 0 || ovAmt <= 0) return []
    return calcOverpaymentSchedule(
      overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType,
      ovAmt, ovType, ovStart, 'reducePeriod', ovEndMonth,
    )
  }, [mortgage, overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType, ovAmt, ovType, ovStart, ovEndMonth])

  const ovScheduleInstall = useMemo(() => {
    if (!mortgage || overpaymentPrincipal <= 0 || ovAmt <= 0) return []
    return calcOverpaymentSchedule(
      overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType,
      ovAmt, ovType, ovStart, 'reduceInstallment', ovEndMonth,
    )
  }, [mortgage, overpaymentPrincipal, totalRate, overpaymentMonths, overpaymentInstType, ovAmt, ovType, ovStart, ovEndMonth])

  const baseTotalInterest   = useMemo(() => baseSchedule.reduce((s, r) => s + r.interest, 0), [baseSchedule])
  const periodTotalInterest = useMemo(() => ovSchedulePeriod.reduce((s, r) => s + r.interest, 0), [ovSchedulePeriod])
  const installTotalInterest = useMemo(() => ovScheduleInstall.reduce((s, r) => s + r.interest, 0), [ovScheduleInstall])

  const savedInterestPeriod  = baseTotalInterest - periodTotalInterest
  const savedInterestInstall = baseTotalInterest - installTotalInterest
  const periodReduction      = baseSchedule.length - ovSchedulePeriod.length
  const newInstallment       = ovScheduleInstall.length > ovStart + 1 ? ovScheduleInstall[ovStart + 1]?.payment : undefined

  // Snapshot rows for comparison table
  const snapshotAt = (schedule: typeof baseSchedule, months: number) => {
    const row = schedule[Math.min(months - 1, schedule.length - 1)]
    if (!row) return null
    const interestPaid = schedule.slice(0, months).reduce((s, r) => s + r.interest, 0)
    return { balance: row.balance, interestPaid, payment: row.payment }
  }

  // Chart data — 3 lines: base, reducePeriod, reduceInstallment
  const chartData = useMemo(() => {
    const maxLen = Math.max(baseSchedule.length, ovSchedulePeriod.length, ovScheduleInstall.length)
    const data = []
    for (let i = 0; i <= maxLen; i += 6) {
      data.push({
        month: i,
        base:    baseSchedule[i]?.balance ?? null,
        period:  ovSchedulePeriod.length > 0  ? (i < ovSchedulePeriod.length  ? (ovSchedulePeriod[i]?.balance  ?? null) : null) : null,
        install: ovScheduleInstall.length > 0 ? (i < ovScheduleInstall.length ? (ovScheduleInstall[i]?.balance ?? null) : null) : null,
      })
    }
    return data
  }, [baseSchedule, ovSchedulePeriod, ovScheduleInstall])

  // X-axis ticks: every 2 years
  const chartTicks = useMemo(() => {
    const maxLen = Math.max(baseSchedule.length, ovSchedulePeriod.length, ovScheduleInstall.length)
    const ticks = []
    for (let i = 0; i <= maxLen; i += 24) ticks.push(i)
    return ticks
  }, [baseSchedule.length, ovSchedulePeriod.length, ovScheduleInstall.length])

  const hasMortgage  = !!mortgage
  const hasNoData    = !hasMortgage

  return (
    <div className="px-6 py-5 mx-auto max-w-5xl space-y-5">
      <PageHeader
        title="Scenariusze"
        description="Symulacje finansowe i kalkulator nadpłat kredytu"
      />

      {/* Tabs */}
      <div className="border-b flex gap-1">
        <Tab active={tab === 'scenarios'} onClick={() => setTab('scenarios')}>Scenariusze ryzyka</Tab>
        <Tab active={tab === 'overpayment'} onClick={() => setTab('overpayment')}>Kalkulator nadpłat</Tab>
      </div>

      {/* ── TAB 1: Scenariusze ryzyka ── */}
      {tab === 'scenarios' && (
        <div className="space-y-5">

          {/* Base KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Miesięczny cashflow" value={formatPLN(baseCashflow)} valueClassName={baseCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
            <KpiCard label="Rata kredytu" value={hasMortgage ? formatPLN(baseInstallment) : '—'} />
            <KpiCard label="Portfel oszczędności" value={formatPLN(walletBalance)} valueClassName="text-amber-600" />
            <KpiCard label="Bufor bezpieczeństwa" value={`${monthsBuffer} mies.`} valueClassName={monthsBuffer >= 3 ? 'text-emerald-600' : 'text-rose-600'} />
          </div>

          {!hasMortgage && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Uzupełnij dane kredytu w sekcji Kredyt, aby zobaczyć pełne wyniki scenariuszy.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Sc 1: Spadek dochodu */}
            <ScenarioCard
              title="Spadek dochodu"
              description="Co jeśli mój dochód netto spadnie?"
              input={
                <ToggleGroup
                  label="Redukcja dochodu"
                  options={[10, 20, 30, 50].map(v => ({ value: v, label: `-${v}%` }))}
                  value={incomeDrop}
                  onChange={setIncomeDrop}
                />
              }
              result={
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Nowy dochód netto</span>
                    <span className="text-sm font-medium tabular-nums">{formatPLN(sc1Income)} <Delta value={-baseMonthlyIncome * incomeDrop / 100} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Cashflow po zmianie</span>
                    <span className={cn('text-sm font-semibold tabular-nums', sc1Cash >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(sc1Cash)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusLabel(sc1OK, sc1Warn).color)}>
                      {statusLabel(sc1OK, sc1Warn).text}
                    </span>
                  </div>
                  {!sc1OK && (
                    <p className="text-[11px] text-muted-foreground bg-muted/50 rounded p-2">
                      Cashflow ujemny — rozważ poduszkę finansową lub ograniczenie wydatków zmiennych.
                    </p>
                  )}
                </div>
              }
            />

            {/* Sc 2: Wzrost stóp */}
            <ScenarioCard
              title="Wzrost stóp procentowych"
              description="Co jeśli WIBOR wzrośnie?"
              input={
                <ToggleGroup
                  label="Wzrost stopy"
                  options={[0.5, 1, 1.5, 2, 3].map(v => ({ value: v, label: `+${v} pp` }))}
                  value={rateDelta}
                  onChange={setRateDelta}
                />
              }
              result={
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Nowa stopa</span>
                    <span className="text-sm font-medium tabular-nums">{sc2Rate.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Nowa rata</span>
                    <span className="text-sm font-medium tabular-nums">{hasMortgage ? formatPLN(sc2Installment) : '—'} <Delta value={-sc2Delta} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Cashflow po zmianie</span>
                    <span className={cn('text-sm font-semibold tabular-nums', sc2Cash >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(sc2Cash)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusLabel(sc2OK, sc2Warn).color)}>
                      {statusLabel(sc2OK, sc2Warn).text}
                    </span>
                  </div>
                </div>
              }
            />

            {/* Sc 3: Opóźnienie odbioru */}
            <ScenarioCard
              title="Opóźnienie odbioru"
              description="Co jeśli deweloper opóźni oddanie mieszkania?"
              input={
                <ToggleGroup
                  label="Opóźnienie"
                  options={[1, 2, 3, 6, 12].map(v => ({ value: v, label: `${v} mies.` }))}
                  value={delayMonths}
                  onChange={setDelayMonths}
                />
              }
              result={
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Dodatkowy koszt najmu</span>
                    <span className="text-sm font-medium tabular-nums text-rose-600">–{formatPLN(sc3RentExtra)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Dodatkowe oszczędności</span>
                    <span className="text-sm font-medium tabular-nums text-emerald-600">+{formatPLN(sc3ExtraSaved)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Wynik netto</span>
                    <span className={cn('text-sm font-semibold tabular-nums', sc3NetImpact >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(sc3NetImpact)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusLabel(sc3OK, sc3Warn).color)}>
                      {statusLabel(sc3OK, sc3Warn).text}
                    </span>
                  </div>
                </div>
              }
            />

            {/* Sc 4: Przekroczenie budżetu wykończenia */}
            <ScenarioCard
              title="Przekroczenie budżetu wykończenia"
              description="Co jeśli wykończenie okaże się droższe?"
              input={
                <ToggleGroup
                  label="Wzrost kosztów"
                  options={[10, 20, 30, 50].map(v => ({ value: v, label: `+${v}%` }))}
                  value={fitoutPct}
                  onChange={setFitoutPct}
                />
              }
              result={
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Nowy koszt (min)</span>
                    <span className="text-sm font-medium tabular-nums">{formatPLN(sc4FitoutMin)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Gap portfel vs koszt min</span>
                    <span className={cn('text-sm font-semibold tabular-nums', sc4GapMin >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(sc4GapMin)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Gap portfel vs koszt target</span>
                    <span className={cn('text-sm font-semibold tabular-nums', sc4GapTarget >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(sc4GapTarget)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusLabel(sc4OK, sc4Warn).color)}>
                      {statusLabel(sc4OK, sc4Warn).text}
                    </span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Stress test */}
          <div className="rounded-lg border-2 border-rose-200 bg-rose-50/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-rose-200 bg-rose-100/60">
              <p className="font-semibold text-sm text-rose-800">Stress test — najgorszy wariant</p>
              <p className="text-xs text-rose-700 mt-0.5">−20% dochodu + wzrost stopy o 2 pp + wykończenie droższe o 20%</p>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Dochód netto</p>
                <p className="font-semibold tabular-nums text-sm">{formatPLN(stressIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata kredytu</p>
                <p className="font-semibold tabular-nums text-sm">{hasMortgage ? formatPLN(stressInstallment) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cashflow miesięczny</p>
                <p className={cn('font-semibold tabular-nums text-sm', stressCash >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(stressCash)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gap do wykończenia (min)</p>
                <p className={cn('font-semibold tabular-nums text-sm', stressGapMin >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{formatPLN(stressGapMin)}</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', statusLabel(stressOK, stressWarn).color)}>
                {statusLabel(stressOK, stressWarn).text}
              </span>
              {!stressOK && (
                <p className="text-xs text-muted-foreground mt-2">
                  W najgorszym wariancie plan się nie spina. Rozważ zwiększenie poduszki finansowej lub zmniejszenie wariantu wykończenia.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Kalkulator nadpłat ── */}
      {tab === 'overpayment' && (
        <div className="space-y-5">

          {hasNoData && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Uzupełnij dane kredytu w sekcji Kredyt, aby skorzystać z kalkulatora.
            </div>
          )}

          {/* Inputs */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <p className="font-semibold text-sm">Parametry nadpłaty</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs text-muted-foreground">Kwota nadpłaty (zł)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={ovAmt}
                  onChange={e => setOvAmt(Number(e.target.value))}
                  className="border rounded px-3 py-1.5 text-sm tabular-nums w-full outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex gap-1 flex-wrap">
                  {[1000, 5000, 10000, 20000, 50000].map(v => (
                    <button key={v} onClick={() => setOvAmt(v)}
                      className={cn('px-2 py-0.5 text-xs rounded border transition-colors',
                        ovAmt === v ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                      )}>
                      {v >= 1000 ? `${v / 1000}k` : v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Typ nadpłaty</label>
                <ToggleGroup
                  options={[
                    { value: 'oneTime' as const, label: 'Jednorazowa' },
                    { value: 'monthly' as const, label: 'Co miesiąc' },
                  ]}
                  value={ovType}
                  onChange={setOvType}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Kiedy zacząć</label>
                <ToggleGroup
                  options={[
                    { value: 0,   label: 'Teraz' },
                    { value: 12,  label: 'Po 1r' },
                    { value: 24,  label: 'Po 2l' },
                    { value: 36,  label: 'Po 3l' },
                    { value: 60,  label: 'Po 5l' },
                    { value: 120, label: 'Po 10l' },
                  ]}
                  value={ovStart}
                  onChange={setOvStart}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Efekt nadpłaty</label>
                <ToggleGroup
                  options={[
                    { value: 'reducePeriod' as const, label: 'Skróć okres' },
                    { value: 'reduceInstallment' as const, label: 'Zmniejsz ratę' },
                  ]}
                  value={ovEffect}
                  onChange={setOvEffect}
                />
              </div>

              {ovType === 'monthly' && (
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-4">
                  <label className="text-xs text-muted-foreground">Przez ile lat nadpłacać</label>
                  <ToggleGroup
                    options={[
                      { value: 0,   label: 'Zawsze' },
                      { value: 24,  label: '2 lata' },
                      { value: 60,  label: '5 lat' },
                      { value: 96,  label: '8 lat' },
                      { value: 120, label: '10 lat' },
                      { value: 180, label: '15 lat' },
                    ]}
                    value={ovDuration}
                    onChange={setOvDuration}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Kredyt bazowy: {hasMortgage ? `${formatPLN(overpaymentPrincipal)} / ${overpaymentMonths} mies. / ${totalRate.toFixed(2)}%` : 'brak danych'}
              {hasMortgage && ` → rata ${formatPLN(baseInstallment)}`}
            </p>
          </div>

          {/* KPI summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <KpiCard
              label="Zaoszczędzone odsetki"
              value={ovSchedule.length > 0 ? formatPLN(savedInterest) : '—'}
              valueClassName="text-emerald-600"
            />
            {ovEffect === 'reducePeriod' ? (
              <KpiCard
                label="Skrócenie okresu"
                value={periodReduction > 0 ? `${periodReduction} mies.` : '0 mies.'}
                valueClassName={periodReduction > 0 ? 'text-violet-600' : undefined}
              />
            ) : (
              <KpiCard
                label={`Nowa rata (zamiast ${formatPLN(baseInstallment)})`}
                value={newInstallment ? formatPLN(newInstallment) : '—'}
                valueClassName="text-violet-600"
              />
            )}
            <KpiCard
              label={`Nowy okres (zamiast ${baseSchedule.length} mies.)`}
              value={ovSchedule.length > 0 ? `${ovSchedule.length} mies.` : '—'}
              valueClassName={periodReduction > 0 ? 'text-violet-600' : undefined}
            />
          </div>

          {/* "Stan po X latach" — panel widoczny gdy duration > 0 */}
          {ovType === 'monthly' && ovDuration > 0 && ovSchedule.length > 0 && hasMortgage && (() => {
            const endIdx  = Math.min(ovEndMonth! - 1, ovSchedule.length - 1)
            const baseEnd = snapshotAt(baseSchedule, ovEndMonth!)
            const ovEnd   = ovSchedule[endIdx]
            const interestSavedSoFar = baseSchedule.slice(0, ovEndMonth).reduce((s, r) => s + r.interest, 0)
              - ovSchedule.slice(0, Math.min(ovEndMonth!, ovSchedule.length)).reduce((s, r) => s + r.interest, 0)
            // installment after overpayments stop (next row after end)
            const installmentAfter = ovSchedule[Math.min(ovEndMonth!, ovSchedule.length - 1)]?.payment
            return (
              <div className="rounded-lg border-2 border-violet-200 bg-violet-50/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-violet-200 bg-violet-100/50">
                  <p className="font-semibold text-sm text-violet-800">
                    Stan po {ovDuration / 12 >= 1 ? `${ovDuration / 12} latach` : `${ovDuration} miesiącach`} nadpłacania
                  </p>
                  <p className="text-xs text-violet-600 mt-0.5">
                    Nadpłaty +{formatPLN(ovAmt)}/mies. od miesiąca {ovStart} do miesiąca {ovEndMonth} — potem standardowe raty
                  </p>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo bez nadpłat</p>
                    <p className="font-semibold tabular-nums text-sm">{baseEnd ? formatPLN(baseEnd.balance) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo z nadpłatami</p>
                    <p className="font-semibold tabular-nums text-sm text-violet-700">{ovEnd ? formatPLN(ovEnd.balance) : 'spłacony'}</p>
                    {baseEnd && ovEnd && (
                      <p className="text-xs text-emerald-600 font-medium">–{formatPLN(baseEnd.balance - ovEnd.balance)} mniej</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Zaoszczędzone odsetki</p>
                    <p className="font-semibold tabular-nums text-sm text-emerald-600">{formatPLN(interestSavedSoFar)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {ovEffect === 'reduceInstallment' ? 'Rata po okresie' : 'Skrócenie okresu'}
                    </p>
                    {ovEffect === 'reduceInstallment'
                      ? <p className="font-semibold tabular-nums text-sm text-violet-700">{installmentAfter ? formatPLN(installmentAfter) : '—'} <span className="text-xs font-normal text-muted-foreground">(było {formatPLN(baseInstallment)})</span></p>
                      : <p className="font-semibold tabular-nums text-sm text-violet-700">{periodReduction} mies. krócej</p>
                    }
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Plain-language summary */}
          {ovSchedule.length > 0 && hasMortgage && (
            <div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
              {ovType === 'oneTime'
                ? <>Jednorazowa nadpłata <strong className="text-foreground">{formatPLN(ovAmt)}</strong> po {ovStart === 0 ? 'pierwszej racie' : `${ovStart} miesiącach`} — </>
                : <>Nadpłacając <strong className="text-foreground">{formatPLN(ovAmt)}</strong> extra co miesiąc od {ovStart === 0 ? 'teraz' : `miesiąca ${ovStart}`} — </>
              }
              {ovEffect === 'reducePeriod'
                ? <>skrócisz kredyt o <strong className="text-foreground">{periodReduction} mies.</strong> i zaoszczędzisz <strong className="text-emerald-600">{formatPLN(savedInterest)}</strong> na odsetkach.</>
                : <>zmniejszysz ratę do <strong className="text-foreground">{newInstallment ? formatPLN(newInstallment) : '—'}</strong> i zaoszczędzisz <strong className="text-emerald-600">{formatPLN(savedInterest)}</strong> na odsetkach.</>
              }
            </div>
          )}

          {/* Comparison table */}
          {hasMortgage && baseSchedule.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-4 py-2.5 font-semibold text-xs">Punkt w czasie</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-xs">Saldo bez nadpłat</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-xs">Saldo z nadpłatą</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-xs">Odsetki bez</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-xs">Odsetki z</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[36, 60, 120].map(m => {
                    const base = snapshotAt(baseSchedule, m)
                    const ov   = snapshotAt(ovSchedule, m)
                    return (
                      <tr key={m} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">Po {m === 36 ? '3' : m === 60 ? '5' : '10'} latach</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{base ? formatPLN(base.balance) : '—'}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-violet-600">{ov ? formatPLN(ov.balance) : 'spłacony'}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{base ? formatPLN(base.interestPaid) : '—'}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{ov ? formatPLN(ov.interestPaid) : '—'}</td>
                      </tr>
                    )
                  })}
                  <tr className="bg-muted/40 font-semibold">
                    <td className="px-4 py-2.5">Łącznie (cały okres)</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{baseSchedule.length} mies.</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-violet-600">{ovSchedule.length || baseSchedule.length} mies.</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatPLN(baseTotalInterest)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{ovSchedule.length > 0 ? formatPLN(ovTotalInterest) : '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Chart */}
          {hasMortgage && chartData.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <p className="font-semibold text-sm mb-3">Krzywa zadłużenia</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    ticks={chartTicks}
                    tickFormatter={v => `${Math.round(Number(v) / 12)}r`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={v => `${Math.round(Number(v) / 1000)}k`}
                    tick={{ fontSize: 11 }}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v: unknown, name: unknown) => [
                      v != null ? formatPLN(Number(v)) : '—',
                      name === 'base' ? 'Bez nadpłat' : 'Z nadpłatą',
                    ]}
                    labelFormatter={(v: unknown) => `Rok ${Math.floor(Number(v) / 12)} (mies. ${v})`}
                  />
                  <Legend formatter={v => v === 'base' ? 'Bez nadpłat' : 'Z nadpłatą'} />
                  <Line
                    type="monotone" dataKey="base" name="base"
                    stroke="#94a3b8" strokeWidth={2} dot={false}
                    connectNulls={false}
                  />
                  {ovSchedule.length > 0 && (
                    <Line
                      type="monotone" dataKey="ov" name="ov"
                      stroke="#7c3aed" strokeWidth={2.5} dot={false}
                      connectNulls={false}
                    />
                  )}
                  {ovEffect === 'reducePeriod' && ovSchedule.length < baseSchedule.length && ovSchedule.length > 0 && (
                    <ReferenceLine
                      x={ovSchedule.length}
                      stroke="#7c3aed" strokeDasharray="4 2"
                      label={{ value: 'spłata', fontSize: 10, fill: '#7c3aed', position: 'top' }}
                    />
                  )}
                  {ovDuration > 0 && ovEndMonth && (
                    <ReferenceLine
                      x={ovEndMonth}
                      stroke="#f59e0b" strokeDasharray="4 2"
                      label={{ value: 'koniec nadpłat', fontSize: 9, fill: '#b45309', position: 'top' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

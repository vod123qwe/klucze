import type { Mortgage, MortgageTranche } from '@/types'

/**
 * Calculates equal (annuity) monthly installment
 * @param principal loan amount
 * @param annualRate total annual rate (base + margin) as percentage, e.g. 7.5
 * @param months loan period in months
 */
export function calcEqualInstallment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0
  if (annualRate === 0) return principal / months

  const monthlyRate = annualRate / 100 / 12
  const installment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(installment * 100) / 100
}

/**
 * Calculates decreasing installment for a given month number (1-based)
 */
export function calcDecreasingInstallment(
  principal: number,
  annualRate: number,
  months: number,
  monthNumber: number,
): number {
  if (principal <= 0 || months <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  const capitalPart = principal / months
  const remainingPrincipal = principal - capitalPart * (monthNumber - 1)
  return Math.round((capitalPart + remainingPrincipal * monthlyRate) * 100) / 100
}

/**
 * Calculates interest-only payment for a given outstanding balance
 */
export function calcInterestOnly(balance: number, annualRate: number): number {
  if (balance <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  return Math.round(balance * monthlyRate * 100) / 100
}

/**
 * Returns the outstanding mortgage balance on a given YYYY-MM month,
 * considering tranche disbursement dates.
 */
export function calcMortgageBalanceAt(tranches: MortgageTranche[], targetMonth: string): number {
  let balance = 0
  for (const t of tranches) {
    const trancheMonth = t.actualDate
      ? t.actualDate.slice(0, 7)
      : t.plannedDate.slice(0, 7)
    if (trancheMonth <= targetMonth) {
      balance += t.amount
    }
  }
  return balance
}

/**
 * Returns the monthly mortgage load (interest-only or full installment)
 * for a given month, based on tranches and mortgage parameters.
 *
 * Logic:
 * - Before all tranches are disbursed: interest-only on current balance
 * - After last tranche: full installment on total balance
 */
export function calcMortgageLoadForMonth(
  mortgage: Mortgage,
  tranches: MortgageTranche[],
  month: string, // YYYY-MM
): number {
  if (!mortgage || tranches.length === 0) return 0

  const totalRate = mortgage.interestRate + mortgage.margin
  const sortedTranches = [...tranches].sort((a, b) =>
    (a.actualDate ?? a.plannedDate).localeCompare(b.actualDate ?? b.plannedDate),
  )

  const lastTranche = sortedTranches[sortedTranches.length - 1]
  const lastTrancheMonth = (lastTranche.actualDate ?? lastTranche.plannedDate).slice(0, 7)

  const currentBalance = calcMortgageBalanceAt(sortedTranches, month)

  if (currentBalance === 0) return 0

  if (month <= lastTrancheMonth) {
    // Interest-only phase
    return calcInterestOnly(currentBalance, totalRate)
  } else {
    // Full installment phase
    if (mortgage.installmentType === 'equal') {
      return calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths)
    } else {
      // Decreasing — approximate month number from last tranche
      const [lastYear, lastMon] = lastTrancheMonth.split('-').map(Number)
      const [curYear, curMon] = month.split('-').map(Number)
      const monthNumber = (curYear - lastYear) * 12 + (curMon - lastMon) + 1
      return calcDecreasingInstallment(mortgage.amount, totalRate, mortgage.periodMonths, monthNumber)
    }
  }
}

// ─── Overpayment calculator ───────────────────────────────────────────────────

export interface OverpaymentScheduleRow {
  monthIndex: number
  balance: number
  payment: number
  interest: number
  principal: number
  overpaymentAmount: number
}

/**
 * Simulates mortgage amortization with optional overpayments.
 *
 * @param principal       Outstanding loan balance at simulation start
 * @param annualRate      Total annual rate (interestRate + margin) as %
 * @param originalMonths  Remaining months in the loan
 * @param installmentType 'equal' (annuity) or 'decreasing'
 * @param overpayment     Extra payment amount (jednorazowa or miesięczna)
 * @param overpaymentType 'oneTime' | 'monthly'
 * @param overpaymentStartMonth 0-based month index when overpayment kicks in
 * @param overpaymentEffect 'reducePeriod' keeps installment, 'reduceInstallment' recalculates it
 */
export function calcOverpaymentSchedule(
  principal: number,
  annualRate: number,
  originalMonths: number,
  installmentType: 'equal' | 'decreasing',
  overpayment: number,
  overpaymentType: 'oneTime' | 'monthly',
  overpaymentStartMonth: number,
  overpaymentEffect: 'reducePeriod' | 'reduceInstallment',
): OverpaymentScheduleRow[] {
  if (principal <= 0 || originalMonths <= 0 || annualRate < 0) return []

  const monthlyRate = annualRate / 100 / 12
  const rows: OverpaymentScheduleRow[] = []
  let balance = principal
  let currentInstallment =
    installmentType === 'equal' ? calcEqualInstallment(principal, annualRate, originalMonths) : 0

  for (let i = 0; i < originalMonths * 2 && balance > 0.5; i++) {
    const interest = Math.round(balance * monthlyRate * 100) / 100

    let capitalInPayment: number
    let payment: number
    if (installmentType === 'equal') {
      payment = Math.min(currentInstallment, balance + interest)
      capitalInPayment = Math.max(0, payment - interest)
    } else {
      const cap = Math.round((principal / originalMonths) * 100) / 100
      capitalInPayment = Math.min(cap, balance)
      payment = capitalInPayment + interest
    }

    const isOverpaymentMonth =
      overpaymentType === 'oneTime' ? i === overpaymentStartMonth : i >= overpaymentStartMonth
    let overpaymentThisMonth = 0
    if (isOverpaymentMonth && overpayment > 0) {
      overpaymentThisMonth = Math.min(overpayment, Math.max(0, balance - capitalInPayment))
    }

    balance = Math.max(0, balance - capitalInPayment - overpaymentThisMonth)

    rows.push({ monthIndex: i, balance, payment, interest, principal: capitalInPayment, overpaymentAmount: overpaymentThisMonth })

    if (
      overpaymentThisMonth > 0 &&
      overpaymentEffect === 'reduceInstallment' &&
      balance > 0 &&
      installmentType === 'equal'
    ) {
      const remainingMonths = originalMonths - i - 1
      if (remainingMonths > 0) {
        currentInstallment = calcEqualInstallment(balance, annualRate, remainingMonths)
      }
    }
  }

  return rows
}

/**
 * Builds a full amortization schedule for the mortgage
 */
export interface AmortizationRow {
  month: string
  installment: number
  interest: number
  capital: number
  balance: number
}

export function buildAmortizationSchedule(
  mortgage: Mortgage,
  tranches: MortgageTranche[],
  months: number = 360,
): AmortizationRow[] {
  if (!mortgage || tranches.length === 0) return []

  const totalRate = mortgage.interestRate + mortgage.margin
  const monthlyRate = totalRate / 100 / 12
  const rows: AmortizationRow[] = []

  const sortedTranches = [...tranches].sort((a, b) =>
    (a.actualDate ?? a.plannedDate).localeCompare(b.actualDate ?? b.plannedDate),
  )
  const lastTranche = sortedTranches[sortedTranches.length - 1]
  const lastTrancheMonth = (lastTranche.actualDate ?? lastTranche.plannedDate).slice(0, 7)

  // Generate months from first tranche to end
  const firstTrancheDate = sortedTranches[0].actualDate ?? sortedTranches[0].plannedDate
  const startDate = new Date(firstTrancheDate.slice(0, 7) + '-01')

  let balance = 0
  let fullInstallmentMonthNum = 0

  for (let i = 0; i < months; i++) {
    const d = new Date(startDate)
    d.setMonth(d.getMonth() + i)
    const month = d.toISOString().slice(0, 7)

    // Add tranches disbursed this month
    for (const t of sortedTranches) {
      const tm = (t.actualDate ?? t.plannedDate).slice(0, 7)
      if (tm === month) balance += t.amount
    }

    if (balance === 0) continue

    let installment: number
    let interest: number
    let capital: number

    if (month <= lastTrancheMonth) {
      interest = calcInterestOnly(balance, totalRate)
      installment = interest
      capital = 0
    } else {
      fullInstallmentMonthNum++
      interest = Math.round(balance * monthlyRate * 100) / 100

      if (mortgage.installmentType === 'equal') {
        installment = calcEqualInstallment(mortgage.amount, totalRate, mortgage.periodMonths)
        capital = installment - interest
      } else {
        capital = Math.round((mortgage.amount / mortgage.periodMonths) * 100) / 100
        installment = capital + interest
      }

      capital = Math.min(capital, balance)
      balance = Math.max(0, balance - capital)
    }

    rows.push({ month, installment, interest, capital, balance })
    if (balance === 0 && fullInstallmentMonthNum > 0) break
  }

  return rows
}

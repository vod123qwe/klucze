import type {
  HouseholdIncome,
  HouseholdExpense,
  Mortgage,
  MortgageTranche,
  MonthlyCashflow,
} from '@/types'
import { calcMortgageLoadForMonth } from './mortgage'

function normalizeToMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case 'monthly':
      return amount
    case 'quarterly':
      return amount / 3
    case 'annual':
      return amount / 12
    default:
      return 0
  }
}

/**
 * Calculates monthly cashflow for a given month (YYYY-MM).
 */
export function calcMonthlyData(
  month: string,
  incomes: HouseholdIncome[],
  expenses: HouseholdExpense[],
  mortgage: Mortgage | null,
  tranches: MortgageTranche[],
  prevSavings: number,
): MonthlyCashflow {
  // Total income (active in this month)
  const totalIncome = incomes.reduce((sum, inc) => {
    if (inc.activeFrom && inc.activeFrom.slice(0, 7) > month) return sum
    if (inc.activeTo && inc.activeTo.slice(0, 7) < month) return sum
    return sum + normalizeToMonthly(inc.amountNet, inc.frequency)
  }, 0)

  // Fixed expenses (recurring, not oneTime, not liabilities handled separately)
  const fixedExpenses = expenses.reduce((sum, exp) => {
    if (exp.frequency === 'oneTime') return sum
    return sum + normalizeToMonthly(exp.amount, exp.frequency)
  }, 0)

  // One-time expenses in this month
  const oneTimeExpenses = expenses.reduce((sum, exp) => {
    if (exp.frequency !== 'oneTime') return sum
    if (exp.month === month) return sum + exp.amount
    return sum
  }, 0)

  // Mortgage load
  const mortgageLoad =
    mortgage && tranches.length > 0
      ? calcMortgageLoadForMonth(mortgage, tranches, month)
      : 0

  const savable = totalIncome - fixedExpenses - oneTimeExpenses - mortgageLoad
  const savingsEnd = prevSavings + savable

  return {
    month,
    totalIncome: Math.round(totalIncome),
    fixedExpenses: Math.round(fixedExpenses),
    mortgageLoad: Math.round(mortgageLoad),
    oneTimeExpenses: Math.round(oneTimeExpenses),
    savable: Math.round(savable),
    savingsEnd: Math.round(savingsEnd),
  }
}

/**
 * Builds a cashflow projection for N months starting from startMonth.
 */
export function buildCashflowProjection(
  startMonth: string,
  months: number,
  incomes: HouseholdIncome[],
  expenses: HouseholdExpense[],
  mortgage: Mortgage | null,
  tranches: MortgageTranche[],
  initialSavings: number,
): MonthlyCashflow[] {
  const result: MonthlyCashflow[] = []
  let prevSavings = initialSavings

  const [startYear, startMon] = startMonth.split('-').map(Number)

  for (let i = 0; i < months; i++) {
    const d = new Date(startYear, startMon - 1 + i, 1)
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const row = calcMonthlyData(month, incomes, expenses, mortgage, tranches, prevSavings)
    result.push(row)
    prevSavings = row.savingsEnd
  }

  return result
}

/**
 * Finds the projected savings at a specific target month.
 */
export function calcSavingsAt(
  targetMonth: string,
  cashflows: MonthlyCashflow[],
): number {
  const found = cashflows.find((c) => c.month === targetMonth)
  if (found) return found.savingsEnd

  // If target is before first month, return initial savings
  if (cashflows.length > 0 && targetMonth < cashflows[0].month) {
    return cashflows[0].savingsEnd - cashflows[0].savable
  }

  // If target is after last month, return last known savings
  if (cashflows.length > 0) return cashflows[cashflows.length - 1].savingsEnd

  return 0
}

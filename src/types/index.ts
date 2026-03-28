// ─── PROPERTY ────────────────────────────────────────────────────────────────

export interface Property {
  id: string
  investmentName: string
  developer: string
  address: string
  unitNumber: string
  area: number
  rooms: number
  floor: number
  exposure: string
  extras: { balcony: boolean; garden: boolean; terrace: boolean }
  deliveryDate: string // ISO date
  buildingStatus: 'planning' | 'under_construction' | 'finished'
  developerStandard: string
  includedInPrice: string[]
  notIncludedInPrice: string[]
  floorPlanImageId: string | null
  roomNotes: Record<string, string>
  links: { label: string; url: string }[]
  notes: string
}

// ─── PURCHASE COSTS ───────────────────────────────────────────────────────────

export type PurchaseCostCategory =
  | 'property'
  | 'garage'
  | 'storage'
  | 'parking'
  | 'downPayment'
  | 'notary'
  | 'court'
  | 'bank'
  | 'commission'
  | 'insurance'
  | 'other'
  | 'postHandover'

export type CostStatus = 'planned' | 'confirmed' | 'paid'

export interface PurchaseCost {
  id: string
  name: string
  category: PurchaseCostCategory
  amount: number
  status: CostStatus
  dueDate: string | null
  note: string
  linkedDocumentIds: string[]
}

// ─── MORTGAGE ─────────────────────────────────────────────────────────────────

export interface Mortgage {
  id: string
  bankName: string
  amount: number
  interestRate: number // %
  margin: number // %
  rateType: 'fixed' | 'variable'
  periodMonths: number
  installmentType: 'equal' | 'decreasing'
  startDate: string | null
  notes: string
  linkedDocumentIds: string[]
}

export type TrancheStatus = 'planned' | 'applied' | 'disbursed'

export interface MortgageTranche {
  id: string
  mortgageId: string
  index: number
  plannedDate: string
  amount: number
  condition: string
  status: TrancheStatus
  actualDate: string | null
  notes: string
}

// ─── HOUSEHOLD ────────────────────────────────────────────────────────────────

export interface HouseholdIncome {
  id: string
  label: string
  person: 'me' | 'partner' | 'other'
  amountNet: number
  frequency: 'monthly' | 'quarterly' | 'annual' | 'oneTime'
  month?: string | null  // YYYY-MM for oneTime
  activeFrom: string
  activeTo: string | null
  sortIndex?: number
}

export interface ExpenseCategory {
  id: string       // same as name
  name: string
  sortIndex: number
}

export interface HouseholdExpense {
  id: string
  label: string
  category: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'annual' | 'oneTime'
  month: string | null // YYYY-MM for oneTime
  isLiability: boolean
  isPaid?: boolean
  sortIndex?: number
}

// ─── BUDGET MONTH ─────────────────────────────────────────────────────────────

export interface BudgetMonth {
  id: string        // YYYY-MM
  openedAt: string  // ISO datetime
  savedAmount: number  // ile odkładasz tego miesiąca
}

// ─── SAVINGS PLAN ─────────────────────────────────────────────────────────────

export interface SavingsPlan {
  id: string
  initialSavings: number
  safetyBuffer: number
  currentSavings: number
  lastUpdated: string
}

// ─── MONTHLY CASHFLOW (calculated, never stored) ─────────────────────────────

export interface MonthlyCashflow {
  month: string // YYYY-MM
  totalIncome: number
  fixedExpenses: number
  mortgageLoad: number
  oneTimeExpenses: number
  savable: number
  savingsEnd: number
}

// ─── FITOUT ───────────────────────────────────────────────────────────────────

export type FitoutCategory =
  | 'kitchen'
  | 'bathroom'
  | 'floors'
  | 'doors'
  | 'painting'
  | 'joinery'
  | 'lighting'
  | 'appliances'
  | 'furniture'
  | 'extras'

export type FitoutExecutor = 'contractor' | 'self' | 'shop' | 'later'
export type FitoutStatus = 'idea' | 'decided' | 'ordered' | 'done'
export type FitoutPriority = 'must' | 'nice'

export interface FitoutItem {
  id: string
  name: string
  category: FitoutCategory
  room: string
  costMin: number
  costTarget: number
  costActual: number | null
  decisionDeadline: string | null
  status: FitoutStatus
  priority: FitoutPriority
  executor: FitoutExecutor
  vendor: string
  notes: string
  linkedDocumentIds: string[]
}

// ─── SCENARIOS ────────────────────────────────────────────────────────────────

export interface Scenario {
  id: string
  name: string
  type: 'optimistic' | 'realistic' | 'safe'
  overrides: {
    monthlyIncomeDelta?: number
    monthlyExpensesDelta?: number
    mortgageRateDelta?: number
    fitoutVariant?: 'min' | 'target'
    deliveryDateDelta?: number
    safetyBufferMultiplier?: number
  }
  notes: string
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

export type DocumentCategory =
  | 'mortgage_offer'
  | 'contract'
  | 'floor_plan'
  | 'cost_estimate'
  | 'fitout_offer'
  | 'correspondence'
  | 'legal'
  | 'other'

export interface DocumentLink {
  type: string
  id: string
}

export interface AppDocument {
  id: string
  title: string
  category: DocumentCategory
  date: string
  source: string
  tags: string[]
  description: string
  extractedData: string
  linkedTo: DocumentLink[]
  fileRef: string | null
  mimeType: string | null
}

// ─── MILESTONES ───────────────────────────────────────────────────────────────

export type MilestoneCategory =
  | 'reservation'
  | 'contract'
  | 'downPayment'
  | 'tranche'
  | 'delivery'
  | 'fitout'
  | 'moveIn'
  | 'custom'

export interface Milestone {
  id: string
  label: string
  date: string
  category: MilestoneCategory
  status: 'planned' | 'done'
  notes: string
}

// ─── CHECKLIST ────────────────────────────────────────────────────────────────

export type ChecklistGroup =
  | 'before_contract'
  | 'after_contract'
  | 'before_mortgage'
  | 'during_construction'
  | 'before_delivery'
  | 'after_delivery'
  | 'before_fitout'
  | 'during_fitout'
  | 'before_move'

export interface ChecklistItem {
  id: string
  group: ChecklistGroup
  title: string
  description: string
  dueDate: string | null
  status: 'todo' | 'in_progress' | 'done' | 'skipped'
  priority: 'high' | 'medium' | 'low'
  linkedDocumentIds: string[]
  notes: string
}

// ─── DECISIONS / NOTES ───────────────────────────────────────────────────────

export interface Decision {
  id: string
  date: string
  topic: string
  description: string
  reasoning: string
  financialImpact: number | null
  scheduleImpact: string
  linkedDocumentIds: string[]
}

// ─── CALCULATED RESULTS ───────────────────────────────────────────────────────

export interface ScenarioResult {
  scenario: Scenario
  savingsAtDelivery: number
  availableForFitout: number
  fitoutCostMin: number
  fitoutCostTarget: number
  gapMin: number
  gapTarget: number
  monthlyMargin: number
  safetyBufferMet: boolean
}

export interface FinancialHealth {
  status: 'ok' | 'warning' | 'critical'
  alerts: string[]
  savingsAtDelivery: number
  availableForFitout: number
  monthlyMargin: number
}

// ─── LABEL MAPS ───────────────────────────────────────────────────────────────

export const PURCHASE_COST_CATEGORY_LABELS: Record<PurchaseCostCategory, string> = {
  property: 'Mieszkanie',
  garage: 'Garaż',
  storage: 'Komórka lokatorska',
  parking: 'Miejsce postojowe',
  downPayment: 'Wkład własny',
  notary: 'Koszty notarialne',
  court: 'Koszty sądowe',
  bank: 'Koszty bankowe',
  commission: 'Prowizja',
  insurance: 'Ubezpieczenie',
  other: 'Inne',
  postHandover: 'Koszty po odbiorze',
}

export const COST_STATUS_LABELS: Record<CostStatus, string> = {
  planned: 'Planowany',
  confirmed: 'Potwierdzony',
  paid: 'Zapłacony',
}

export const TRANCHE_STATUS_LABELS: Record<TrancheStatus, string> = {
  planned: 'Planowana',
  applied: 'Złożony wniosek',
  disbursed: 'Wypłacona',
}

export const FITOUT_CATEGORY_LABELS: Record<FitoutCategory, string> = {
  kitchen: 'Kuchnia',
  bathroom: 'Łazienka',
  floors: 'Podłogi',
  doors: 'Drzwi',
  painting: 'Malowanie',
  joinery: 'Stolarka',
  lighting: 'Oświetlenie',
  appliances: 'AGD',
  furniture: 'Meble',
  extras: 'Dodatki',
}

export const CHECKLIST_GROUP_LABELS: Record<ChecklistGroup, string> = {
  before_contract: 'Przed podpisaniem umowy',
  after_contract: 'Po podpisaniu umowy',
  before_mortgage: 'Przed uruchomieniem kredytu',
  during_construction: 'W trakcie budowy',
  before_delivery: 'Przed odbiorem',
  after_delivery: 'Po odbiorze',
  before_fitout: 'Przed wykończeniem',
  during_fitout: 'W trakcie wykończenia',
  before_move: 'Przed przeprowadzką',
}

export const MILESTONE_CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  reservation: 'Rezerwacja',
  contract: 'Umowa',
  downPayment: 'Wpłata wkładu',
  tranche: 'Transza',
  delivery: 'Odbiór',
  fitout: 'Wykończenie',
  moveIn: 'Przeprowadzka',
  custom: 'Inne',
}

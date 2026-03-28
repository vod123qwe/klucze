import Dexie, { type EntityTable } from 'dexie'
import type {
  Property,
  PurchaseCost,
  Mortgage,
  MortgageTranche,
  HouseholdIncome,
  HouseholdExpense,
  SavingsPlan,
  FitoutItem,
  Scenario,
  AppDocument,
  Milestone,
  ChecklistItem,
  Decision,
} from '@/types'

class KluczeDB extends Dexie {
  property!: EntityTable<Property, 'id'>
  purchaseCosts!: EntityTable<PurchaseCost, 'id'>
  mortgage!: EntityTable<Mortgage, 'id'>
  mortgageTranches!: EntityTable<MortgageTranche, 'id'>
  householdIncomes!: EntityTable<HouseholdIncome, 'id'>
  householdExpenses!: EntityTable<HouseholdExpense, 'id'>
  savingsPlan!: EntityTable<SavingsPlan, 'id'>
  fitoutItems!: EntityTable<FitoutItem, 'id'>
  scenarios!: EntityTable<Scenario, 'id'>
  documents!: EntityTable<AppDocument, 'id'>
  milestones!: EntityTable<Milestone, 'id'>
  checklistItems!: EntityTable<ChecklistItem, 'id'>
  decisions!: EntityTable<Decision, 'id'>

  constructor() {
    super('KluczeDB')
    this.version(1).stores({
      property: 'id',
      purchaseCosts: 'id, category, status',
      mortgage: 'id',
      mortgageTranches: 'id, mortgageId, index',
      householdIncomes: 'id, person',
      householdExpenses: 'id, category, frequency',
      savingsPlan: 'id',
      fitoutItems: 'id, category, room, status, priority',
      scenarios: 'id, type',
      documents: 'id, category, *tags',
      milestones: 'id, category, status, date',
      checklistItems: 'id, group, status, priority',
      decisions: 'id, date',
    })

    // Version 2 — seed real data (Moja Skawina)
    this.version(2).stores({}).upgrade(async tx => {
      await _seedRealData(tx as unknown as KluczeDB)
    })
  }
}

export const db = new KluczeDB()

// ─── REAL DATA SEED (Moja Skawina, March 2026) ────────────────────────────────

async function _seedRealData(tx: KluczeDB) {
  // Only seed if DB is empty (fresh install or first upgrade)
  const propCount = await tx.property.count()
  if (propCount > 0) return

  await tx.property.add({
    id: 'main',
    investmentName: 'Moja Skawina',
    developer: 'Moja Skawina',
    address: 'ul. Feliksa Pachla, Skawina',
    unitNumber: '',
    area: 0,
    rooms: 0,
    floor: 0,
    exposure: '',
    extras: { balcony: false, garden: false, terrace: false },
    deliveryDate: '2027-05-31',
    buildingStatus: 'under_construction',
    developerStandard: 'Standard deweloperski Segment A+B',
    includedInPrice: [],
    notIncludedInPrice: [],
    floorPlanImageId: null,
    roomNotes: {},
    links: [],
    notes: 'Termin odbioru: do 31.05.2027. Segment B. Cena: 849 000 zł.',
  })

  await tx.purchaseCosts.bulkAdd([
    {
      id: 'cost-1',
      name: 'Cena mieszkania',
      category: 'property',
      amount: 849000,
      status: 'confirmed',
      dueDate: null,
      note: 'Płatna w 4 transzach wg harmonogramu dewelopera.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-2',
      name: 'Budżet remontowy (w kredycie)',
      category: 'postHandover',
      amount: 130000,
      status: 'planned',
      dueDate: null,
      note: 'Włączony do kwoty kredytu. Wartość nieruchomości po remoncie: 979 000 zł.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-3',
      name: 'Rezerwacja (zapłacona)',
      category: 'downPayment',
      amount: 8000,
      status: 'paid',
      dueDate: '2026-03-01',
      note: 'Wejdzie w skład wkładu własnego 97 900 zł.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-4',
      name: 'Wkład własny — pozostałe',
      category: 'downPayment',
      amount: 89900,
      status: 'planned',
      dueDate: '2026-04-30',
      note: 'Łącznie wkład własny = 97 900 zł (10% z 979 000 zł). Zapłacono już 8 000 zł (rezerwacja).',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-5',
      name: 'Koszty notarialne',
      category: 'notary',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'Do wyceny u notariusza przed podpisaniem UD.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-6',
      name: 'Koszty bankowe / prowizja',
      category: 'bank',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'Do potwierdzenia z banku — uzupełnij z Formularza Informacyjnego KS22562797.',
      linkedDocumentIds: [],
    },
  ])

  await tx.mortgage.add({
    id: 'main',
    bankName: '',
    amount: 881100,
    interestRate: 5.82,
    margin: 2.0,
    rateType: 'variable',
    periodMonths: 300,
    installmentType: 'equal',
    startDate: '2026-04-30',
    notes:
      'Kwota: 849 000 (zakup) + 130 000 (remont) − 97 900 (wkład własny) = 881 100 zł. ' +
      'Oprocentowanie szacunkowe — uzupełnij z Formularza Informacyjnego KS22562797 (WIBOR 3M + marża).',
    linkedDocumentIds: [],
  })

  await tx.mortgageTranches.bulkAdd([
    {
      id: 'tranche-1',
      mortgageId: 'main',
      index: 1,
      plannedDate: '2026-04-30',
      amount: 169800,
      condition: 'Płatne w terminie 14 dni od dnia zawarcia umowy deweloperskiej. Zakończenie I Etapu.',
      status: 'planned',
      actualDate: null,
      notes: '20% ceny. Pierwsza transza — koniec kwietnia 2026.',
    },
    {
      id: 'tranche-2',
      mortgageId: 'main',
      index: 2,
      plannedDate: '2026-05-31',
      amount: 84900,
      condition: 'Płatne nie wcześniej niż 31.05.2026. Po zakończeniu IV Etapu.',
      status: 'planned',
      actualDate: null,
      notes: '10% ceny.',
    },
    {
      id: 'tranche-3',
      mortgageId: 'main',
      index: 3,
      plannedDate: '2026-09-15',
      amount: 424500,
      condition: 'Płatne nie wcześniej niż 15.09.2026. Po zakończeniu V Etapu.',
      status: 'planned',
      actualDate: null,
      notes: '50% ceny. Największa transza.',
    },
    {
      id: 'tranche-4',
      mortgageId: 'main',
      index: 4,
      plannedDate: '2026-10-31',
      amount: 169800,
      condition: 'Płatne nie wcześniej niż 31.10.2026. Po zakończeniu VI Etapu.',
      status: 'planned',
      actualDate: null,
      notes: '20% ceny.',
    },
    {
      id: 'tranche-5',
      mortgageId: 'main',
      index: 5,
      plannedDate: '2027-06-30',
      amount: 32100,
      condition: 'Transza remontowa — po odbiorze mieszkania (31.05.2027).',
      status: 'planned',
      actualDate: null,
      notes: 'Pozostała część kredytu: 881 100 − 849 000 = 32 100 zł.',
    },
  ])

  await tx.householdIncomes.bulkAdd([
    {
      id: 'income-1',
      label: 'Jarek',
      person: 'me',
      amountNet: 25200,
      frequency: 'monthly',
      activeFrom: '2026-01-01',
      activeTo: null,
    },
    {
      id: 'income-2',
      label: 'Blanka',
      person: 'partner',
      amountNet: 5000,
      frequency: 'monthly',
      activeFrom: '2026-01-01',
      activeTo: null,
    },
    {
      id: 'income-3',
      label: 'Dziecko',
      person: 'other',
      amountNet: 800,
      frequency: 'monthly',
      activeFrom: '2026-01-01',
      activeTo: null,
    },
  ])

  await tx.householdExpenses.bulkAdd([
    {
      id: 'exp-1',
      label: 'Mieszkanie — wynajem',
      category: 'Mieszkanie (wynajem/czynsz)',
      amount: 1700,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-2',
      label: 'Mieszkanie — czynsz',
      category: 'Mieszkanie (wynajem/czynsz)',
      amount: 800,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-3',
      label: 'Orange — Telefon / internet',
      category: 'Rachunki',
      amount: 250,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-4',
      label: 'Netflix',
      category: 'Subskrypcje',
      amount: 43,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-5',
      label: 'Disney+',
      category: 'Subskrypcje',
      amount: 30,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-6',
      label: 'Przedszkole',
      category: 'Dziecko',
      amount: 600,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-7',
      label: 'Rata — Telefon',
      category: 'Kredyty/raty',
      amount: 580,
      frequency: 'monthly',
      month: null,
      isLiability: true,
    },
    {
      id: 'exp-8',
      label: 'Rata — Leczenie',
      category: 'Kredyty/raty',
      amount: 1250,
      frequency: 'monthly',
      month: null,
      isLiability: true,
    },
    {
      id: 'exp-9',
      label: 'Księgowość',
      category: 'Firma',
      amount: 250,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-10',
      label: 'ZUS',
      category: 'Firma',
      amount: 2757,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-11',
      label: 'PIT 28',
      category: 'Firma',
      amount: 2361,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
    {
      id: 'exp-12',
      label: 'VAT 7',
      category: 'Firma',
      amount: 4715,
      frequency: 'monthly',
      month: null,
      isLiability: false,
    },
  ])

  await tx.savingsPlan.add({
    id: 'main',
    initialSavings: 8000,
    safetyBuffer: 30000,
    currentSavings: 8000,
    lastUpdated: new Date().toISOString(),
  })

  await tx.milestones.bulkAdd([
    {
      id: 'ms-1',
      label: 'Rezerwacja mieszkania',
      date: '2026-03-01',
      category: 'reservation',
      status: 'done',
      notes: 'Wpłacono 8 000 zł. Wejdzie w skład wkładu własnego.',
    },
    {
      id: 'ms-2',
      label: 'Podpisanie umowy deweloperskiej',
      date: '2026-04-01',
      category: 'contract',
      status: 'planned',
      notes: 'Data orientacyjna — potwierdzić z deweloperem i notariuszem.',
    },
    {
      id: 'ms-3',
      label: 'Transza 1 — 169 800 zł (20%)',
      date: '2026-04-30',
      category: 'tranche',
      status: 'planned',
      notes: '14 dni od podpisania UD. I Etap Przedsięwzięcia Deweloperskiego.',
    },
    {
      id: 'ms-4',
      label: 'Transza 2 — 84 900 zł (10%)',
      date: '2026-05-31',
      category: 'tranche',
      status: 'planned',
      notes: 'Po zakończeniu IV Etapu budowy. Nie wcześniej niż 31.05.2026.',
    },
    {
      id: 'ms-5',
      label: 'Transza 3 — 424 500 zł (50%)',
      date: '2026-09-15',
      category: 'tranche',
      status: 'planned',
      notes: 'Po zakończeniu V Etapu budowy. Nie wcześniej niż 15.09.2026. Największa transza.',
    },
    {
      id: 'ms-6',
      label: 'Transza 4 — 169 800 zł (20%)',
      date: '2026-10-31',
      category: 'tranche',
      status: 'planned',
      notes: 'Po zakończeniu VI Etapu budowy. Nie wcześniej niż 31.10.2026.',
    },
    {
      id: 'ms-7',
      label: 'Odbiór mieszkania',
      date: '2027-05-31',
      category: 'delivery',
      status: 'planned',
      notes: 'Termin umowny wg UD: do 31.05.2027.',
    },
    {
      id: 'ms-8',
      label: 'Start wykończenia',
      date: '2027-06-01',
      category: 'fitout',
      status: 'planned',
      notes: 'Po odbiorze kluczy.',
    },
    {
      id: 'ms-9',
      label: 'Przeprowadzka',
      date: '2027-09-01',
      category: 'moveIn',
      status: 'planned',
      notes: 'Orientacyjny termin — zależy od tempa wykończenia.',
    },
  ])

  await tx.scenarios.bulkAdd([
    {
      id: 'optimistic',
      name: 'Optymistyczny',
      type: 'optimistic',
      overrides: { monthlyIncomeDelta: 2000, monthlyExpensesDelta: -500 },
      notes: '',
    },
    {
      id: 'realistic',
      name: 'Realistyczny',
      type: 'realistic',
      overrides: {},
      notes: '',
    },
    {
      id: 'safe',
      name: 'Bezpieczny',
      type: 'safe',
      overrides: { monthlyIncomeDelta: -1000, monthlyExpensesDelta: 1000, safetyBufferMultiplier: 1.5 },
      notes: '',
    },
  ])
}

// ─── PUBLIC SEED (called on app init for truly empty DB) ──────────────────────

export async function seedDefaultData() {
  const [propCount, planCount, scenarioCount] = await Promise.all([
    db.property.count(),
    db.savingsPlan.count(),
    db.scenarios.count(),
  ])

  // If version upgrade already seeded everything, skip
  if (propCount > 0 && planCount > 0 && scenarioCount > 0) return

  // Fallback for first-ever open (before any version upgrade ran)
  await _seedRealData(db as unknown as KluczeDB)
}

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────

export async function exportAllData(): Promise<string> {
  const [
    property,
    purchaseCosts,
    mortgage,
    mortgageTranches,
    householdIncomes,
    householdExpenses,
    savingsPlan,
    fitoutItems,
    scenarios,
    documents,
    milestones,
    checklistItems,
    decisions,
  ] = await Promise.all([
    db.property.toArray(),
    db.purchaseCosts.toArray(),
    db.mortgage.toArray(),
    db.mortgageTranches.toArray(),
    db.householdIncomes.toArray(),
    db.householdExpenses.toArray(),
    db.savingsPlan.toArray(),
    db.fitoutItems.toArray(),
    db.scenarios.toArray(),
    db.documents.toArray(),
    db.milestones.toArray(),
    db.checklistItems.toArray(),
    db.decisions.toArray(),
  ])

  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        property,
        purchaseCosts,
        mortgage,
        mortgageTranches,
        householdIncomes,
        householdExpenses,
        savingsPlan,
        fitoutItems,
        scenarios,
        documents,
        milestones,
        checklistItems,
        decisions,
      },
    },
    null,
    2,
  )
}

export async function importAllData(json: string): Promise<void> {
  const parsed = JSON.parse(json)
  const { data } = parsed

  await db.transaction(
    'rw',
    [
      db.property,
      db.purchaseCosts,
      db.mortgage,
      db.mortgageTranches,
      db.householdIncomes,
      db.householdExpenses,
      db.savingsPlan,
      db.fitoutItems,
      db.scenarios,
      db.documents,
      db.milestones,
      db.checklistItems,
      db.decisions,
    ],
    async () => {
      await Promise.all([
        db.property.clear(),
        db.purchaseCosts.clear(),
        db.mortgage.clear(),
        db.mortgageTranches.clear(),
        db.householdIncomes.clear(),
        db.householdExpenses.clear(),
        db.savingsPlan.clear(),
        db.fitoutItems.clear(),
        db.scenarios.clear(),
        db.documents.clear(),
        db.milestones.clear(),
        db.checklistItems.clear(),
        db.decisions.clear(),
      ])

      await Promise.all([
        data.property?.length && db.property.bulkAdd(data.property),
        data.purchaseCosts?.length && db.purchaseCosts.bulkAdd(data.purchaseCosts),
        data.mortgage?.length && db.mortgage.bulkAdd(data.mortgage),
        data.mortgageTranches?.length && db.mortgageTranches.bulkAdd(data.mortgageTranches),
        data.householdIncomes?.length && db.householdIncomes.bulkAdd(data.householdIncomes),
        data.householdExpenses?.length && db.householdExpenses.bulkAdd(data.householdExpenses),
        data.savingsPlan?.length && db.savingsPlan.bulkAdd(data.savingsPlan),
        data.fitoutItems?.length && db.fitoutItems.bulkAdd(data.fitoutItems),
        data.scenarios?.length && db.scenarios.bulkAdd(data.scenarios),
        data.documents?.length && db.documents.bulkAdd(data.documents),
        data.milestones?.length && db.milestones.bulkAdd(data.milestones),
        data.checklistItems?.length && db.checklistItems.bulkAdd(data.checklistItems),
        data.decisions?.length && db.decisions.bulkAdd(data.decisions),
      ])
    },
  )
}

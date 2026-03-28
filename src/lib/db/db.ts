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
  }
}

export const db = new KluczeDB()

// ─── SEED default data ────────────────────────────────────────────────────────

export async function seedDefaultData() {
  const [propCount, planCount, scenarioCount] = await Promise.all([
    db.property.count(),
    db.savingsPlan.count(),
    db.scenarios.count(),
  ])

  if (propCount === 0) {
    await db.property.add({
      id: 'main',
      investmentName: '',
      developer: '',
      address: '',
      unitNumber: '',
      area: 0,
      rooms: 0,
      floor: 0,
      exposure: '',
      extras: { balcony: false, garden: false, terrace: false },
      deliveryDate: '',
      buildingStatus: 'under_construction',
      developerStandard: '',
      includedInPrice: [],
      notIncludedInPrice: [],
      floorPlanImageId: null,
      roomNotes: {},
      links: [],
      notes: '',
    })
  }

  if (planCount === 0) {
    await db.savingsPlan.add({
      id: 'main',
      initialSavings: 0,
      safetyBuffer: 20000,
      currentSavings: 0,
      lastUpdated: new Date().toISOString(),
    })
  }

  if (scenarioCount === 0) {
    await db.scenarios.bulkAdd([
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
        overrides: {
          monthlyIncomeDelta: -1000,
          monthlyExpensesDelta: 1000,
          safetyBufferMultiplier: 1.5,
        },
        notes: '',
      },
    ])
  }
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

import Dexie, { type EntityTable } from 'dexie'
import type {
  Property,
  PurchaseCost,
  Mortgage,
  MortgageTranche,
  HouseholdIncome,
  HouseholdExpense,
  ExpenseCategory,
  BudgetMonth,
  SavingsPlan,
  FitoutItem,
  Scenario,
  AppDocument,
  Milestone,
  ChecklistItem,
  Decision,
} from '@/types'

const DEFAULT_CATEGORIES: string[] = [
  'Mieszkanie (wynajem/czynsz)',
  'Bank i ubezpieczenia',
  'Kredyty/raty',
  'Firma',
  'Rachunki',
  'Subskrypcje',
  'Dziecko',
  'Zdrowie',
  'Żywność',
  'Transport',
  'Rozrywka',
  'Inne',
]

class KluczeDB extends Dexie {
  property!: EntityTable<Property, 'id'>
  purchaseCosts!: EntityTable<PurchaseCost, 'id'>
  mortgage!: EntityTable<Mortgage, 'id'>
  mortgageTranches!: EntityTable<MortgageTranche, 'id'>
  householdIncomes!: EntityTable<HouseholdIncome, 'id'>
  householdExpenses!: EntityTable<HouseholdExpense, 'id'>
  expenseCategories!: EntityTable<ExpenseCategory, 'id'>
  budgetMonths!: EntityTable<BudgetMonth, 'id'>
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

    this.version(2).stores({})

    this.version(3).stores({
      householdIncomes: 'id, person, sortIndex',
      householdExpenses: 'id, category, frequency, sortIndex',
    }).upgrade(async tx => {
      const expTable = tx.table('householdExpenses')
      const expenses = await expTable.toArray()
      for (let i = 0; i < expenses.length; i++) {
        await expTable.update(expenses[i].id, { sortIndex: i })
      }
      const incTable = tx.table('householdIncomes')
      const incomes = await incTable.toArray()
      for (let i = 0; i < incomes.length; i++) {
        await incTable.update(incomes[i].id, { sortIndex: i })
      }
    })

    // Version 4 — add expenseCategories table
    this.version(4).stores({
      expenseCategories: 'id, sortIndex',
    }).upgrade(async tx => {
      const catTable = tx.table('expenseCategories')
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        await catTable.put({ id: DEFAULT_CATEGORIES[i], name: DEFAULT_CATEGORIES[i], sortIndex: i })
      }
      // Fix Locum Comfort: change from monthly to 5 × oneTime January entries
      const expTable = tx.table('householdExpenses')
      const locum = await expTable.get('exp-14')
      if (locum && locum.frequency === 'monthly') {
        await expTable.delete('exp-14')
        const all = await expTable.toArray()
        const maxIdx = Math.max(...all.map((e: HouseholdExpense) => e.sortIndex ?? 0), 0)
        for (let yr = 0; yr < 5; yr++) {
          await expTable.put({
            id: `exp-14-${2026 + yr}`,
            label: `Ubezpieczenie nieruchomości ${2026 + yr} (Locum Comfort)`,
            category: 'Bank i ubezpieczenia',
            amount: 984,
            frequency: 'oneTime',
            month: `${2026 + yr}-01`,
            isLiability: false,
            sortIndex: maxIdx + 1 + yr,
          })
        }
      }
    })

    // Version 5 — add budgetMonths table; seed current month as open
    this.version(5).stores({
      budgetMonths: 'id',
    }).upgrade(async tx => {
      const now = new Date().toISOString()
      const ym = new Date()
      const monthId = `${ym.getFullYear()}-${String(ym.getMonth() + 1).padStart(2, '0')}`
      await tx.table('budgetMonths').put({ id: monthId, openedAt: now })
    })

    // Version 6 — index month on incomes; materialize recurring entries for base month
    this.version(6).stores({
      householdIncomes: 'id, person, sortIndex, month',
    }).upgrade(async tx => {
      const ym = new Date()
      const baseMonth = `${ym.getFullYear()}-${String(ym.getMonth() + 1).padStart(2, '0')}`
      const expTable = tx.table('householdExpenses')
      const incTable = tx.table('householdIncomes')

      // Materialize recurring expenses → oneTime for base month
      const allExp = await expTable.toArray()
      const baseHasExp = allExp.some((e: HouseholdExpense) => e.frequency === 'oneTime' && e.month === baseMonth)
      if (!baseHasExp) {
        const recurring = allExp.filter((e: HouseholdExpense) => e.frequency !== 'oneTime')
        for (const e of recurring) {
          const amount = e.frequency === 'quarterly' ? e.amount / 3 : e.frequency === 'annual' ? e.amount / 12 : e.amount
          await expTable.put({ ...e, id: `${e.id}-m${baseMonth}`, frequency: 'oneTime', month: baseMonth, amount })
        }
      }

      // Materialize recurring incomes → oneTime for base month
      const allInc = await incTable.toArray()
      const baseHasInc = allInc.some((i: HouseholdIncome) => i.frequency === 'oneTime' && i.month === baseMonth)
      if (!baseHasInc) {
        const recurringInc = allInc.filter((i: HouseholdIncome) => i.frequency !== 'oneTime')
        for (const inc of recurringInc) {
          const amountNet = inc.frequency === 'quarterly' ? inc.amountNet / 3 : inc.frequency === 'annual' ? inc.amountNet / 12 : inc.amountNet
          await incTable.put({ ...inc, id: `${inc.id}-m${baseMonth}`, frequency: 'oneTime', month: baseMonth, amountNet })
        }
      }
    })

    // Version 7 — add savedAmount to BudgetMonth
    this.version(7).stores({}).upgrade(async tx => {
      const months = await tx.table('budgetMonths').toArray()
      for (const m of months) {
        if (m.savedAmount === undefined) {
          await tx.table('budgetMonths').update(m.id, { savedAmount: 0 })
        }
      }
    })

    // Version 8 — add isPaid to HouseholdExpense
    this.version(8).stores({}).upgrade(async tx => {
      const exps = await tx.table('householdExpenses').toArray()
      for (const e of exps) {
        if (e.isPaid === undefined) {
          await tx.table('householdExpenses').update(e.id, { isPaid: false })
        }
      }
    })

    // Version 9 — add isSavingsWithdrawal to HouseholdExpense
    this.version(9).stores({}).upgrade(async tx => {
      const exps = await tx.table('householdExpenses').toArray()
      for (const e of exps) {
        if (e.isSavingsWithdrawal === undefined) {
          await tx.table('householdExpenses').update(e.id, { isSavingsWithdrawal: false })
        }
      }
    })
  }
}

export const db = new KluczeDB()

// ─── REAL DATA SEED (Moja Skawina, March 2026) ────────────────────────────────

async function _seedRealData(tx: KluczeDB) {
  // Seed if property OR expenses are missing
  const propCount = await tx.property.count()
  const expCount = await tx.householdExpenses.count()
  if (propCount > 0 && expCount > 0) return

  await tx.property.put({
    id: 'main',
    investmentName: 'Moja Skawina',
    developer: 'EPOL HOLDING Sp. z o.o.',
    address: 'ul. Feliksa Pachla, Skawina',
    unitNumber: 'M.48, Segment B, Budynek B1',
    area: 89.91,
    rooms: 4,
    floor: 4,
    exposure: 'N',
    extras: { balcony: true, garden: false, terrace: false },
    deliveryDate: '2027-05-31',
    buildingStatus: 'under_construction',
    developerStandard:
      'KONSTRUKCJA I ŚCIANY: Płyta fundamentowa, stropy monolityczne żelbetowe. ' +
      'Ściany zewnętrzne żelbetowe/ceramiczne z izolacją BSO (styropian/wełna), tynk silikonowy na zewnątrz. ' +
      'Ściany działowe wewnątrz lokalu gr. 10 cm z paneli YTONG. ' +
      'Tynk gipsowy w pokojach i korytarzu; tynk cementowo-wapienny w łazience i WC. ' +
      'Sufity: tynk gipsowy (pokoje), cementowo-wapienny (łazienki). ' +
      'Dylatacje tynków pozostawione bez wypełnienia — do uzupełnienia przez nabywcę.\n\n' +
      'PODŁOGI: Wylewka betonowa surowa (poziom gotowy pod wykończenie).\n\n' +
      'OKNA I DRZWI BALKONOWE: PCV 3-szybowe (U≤0,9), białe wewnątrz / grafitowe na zewnątrz. ' +
      'Okucia standardowe, nawiewniki okienne w wybranych oknach. ' +
      'Balkony parterowe: rolety zewnętrzne antracytowe.\n\n' +
      'PARAPETY: Zewnętrzne — blacha stalowa ocynkowana malowana proszkowo. ' +
      'Wewnętrzne — konglomerat (np. Botticino), grubość 3 cm.\n\n' +
      'DRZWI WEJŚCIOWE DO LOKALU: Pełne, jednoskrzydłowe, antywłamaniowe, atestowane. ' +
      'Wyposażone w dwa zamki, okleinowane. Numer lokalu na drzwiach lub nad nimi.\n\n' +
      'DRZWI WEWNĘTRZNE: BRAK — otwory drzwiowe przygotowane do samodzielnego montażu. ' +
      'Uwaga: należy stosować drzwi z kratkami wentylacyjnymi.\n\n' +
      'INSTALACJA C.O.: Miejska sieć ciepłownicza → wymiennikownia w piwnicy → grzejniki panelowe ' +
      'z wbudowanym zestawem termostatycznym. W łazienkach grzejniki drabinkowe. ' +
      'Indywidualny licznik ciepła.\n\n' +
      'INSTALACJA WODNO-KANALIZACYJNA: Rury z tworzywa sztucznego (niskoszumowe). ' +
      'Indywidualne wodomierze zimnej i ciepłej wody. ' +
      'Podejścia do zmywarki, zlewozmywaka, pralki, WC, umywalki, prysznica/wanny — natynkowo. ' +
      'C.w.u. z miejskiej sieci ciepłowniczej.\n\n' +
      'WENTYLACJA: Wywiewna jednorurowa stałociśnieniowa. Nawiew przez nawiewniki okienne. ' +
      'Kratki wywiewne w kuchni i łazienkach. Piony do okapu kuchennego.\n\n' +
      'INSTALACJA ELEKTRYCZNA: Wypusty oświetleniowe we wszystkich pomieszczeniach (min. 1 szt.). ' +
      'Gniazda 230V min. 2 w każdym pomieszczeniu. Zasilanie 3-fazowe do kuchni elektrycznej. ' +
      'Rozdzielnia w przedpokoju (elektryczna + teletechniczna). ' +
      'Skrzynka multimedialna. Gniazda nad blatowe (min. 2 podwójne) i pod blatowe (lodówka, zmywarka, okap).\n\n' +
      'TELETECHNIKA: TV SAT (gniazdo w salonie), RTV, internet RJ45 (salon), ' +
      'telefon RJ45 (przedpokój), wideodomofon przy drzwiach wejściowych, instalacja dzwonkowa.\n\n' +
      'BALKONY: Posadzka impregnowana preparatem bezbarwnym. ' +
      'Balustrady: profile stalowe ocynkowane malowane proszkowo + szkło hartowane bezpieczne (przezierne lub półmatowe). ' +
      'Oddzielenia między balkonami: rama stalowa + szyba laminowana (folia mleczna). ' +
      'Wyposażenie: oprawa oświetleniowa + gniazdo 220V na każdym balkonie.\n\n' +
      'GARAŻ PODZIEMNY: 2 kondygnacje, 187 miejsc (w tym 6 dla niepełnosprawnych). ' +
      'Posadzka betonowa utwardzona i impregnowana. Garaż nieogrzewany. ' +
      'Instalacja detekcji CO i LPG. Miejsca oznakowane numerami.\n\n' +
      'KOMÓRKI LOKATORSKIE: Ściany na poz. -1 z pustaków wapienno-piaskowych, na poz. -2 ażurowe stalowe. ' +
      'Wentylacja automatyczna (czujka ruchu/światło).\n\n' +
      'TEREN ZEWNĘTRZNY: Drogi wewnętrzne z kostki betonowej Behaton, chodniki Via Trio Libet. ' +
      '24 miejsca naziemne (w tym 7 dla niepełnosprawnych). Oświetlenie automatyczne (zmierzchowe). ' +
      'Zieleń: drzewa kolumnowe, trawniki, ogródki ogrodzone siatką panelową 120 cm. ' +
      'Stojaki na rowery, ławki, kosze na śmieci.',
    includedInPrice: [
      'Tynki gipsowe (pokoje, korytarz) i cementowo-wapienne (łazienka, WC)',
      'Wylewka betonowa — posadzka surowa',
      'Okna PCV 3-szybowe (U≤0,9), białe wewnątrz / grafitowe na zewnątrz, z nawiewnikami',
      'Drzwi wejściowe antywłamaniowe z 2 zamkami',
      'Parapety: zewnętrzne blacha, wewnętrzne konglomerat Botticino 3 cm',
      'Grzejniki panelowe z zaworami termostatycznymi we wszystkich pokojach',
      'Grzejniki drabinkowe w łazience/WC',
      'Instalacja elektryczna: wypusty oświetleniowe, gniazda 230V, rozdzielnia, skrzynka multimedialna',
      'Zasilanie 3-fazowe do kuchni elektrycznej',
      'Instalacja wod-kan: podejścia pod zlewozmywak, zmywarkę, pralkę, WC, umywalkę, prysznic/wannę',
      'Indywidualne liczniki: ciepło, zimna woda, ciepła woda',
      'Wentylacja wywiewna z nawiewnikami okiennymi, pion pod okap kuchenny',
      'Instalacje teletechniczne: TV SAT, internet RJ45, telefon RJ45, wideodomofon, dzwonek',
      'Balkony x3 z balustradami stalowymi i szkłem hartowanym, gniazdo + oprawka na każdym',
    ],
    notIncludedInPrice: [
      'Drzwi wewnętrzne — otwory przygotowane, drzwi we własnym zakresie',
      'Podłogi wykończone (płytki, panele, parkiet)',
      'Malowanie i dekoracja ścian (i wypełnienie dylatacji tynków)',
      'Glazura i terakota w łazience/WC',
      'Biały montaż: wanna/prysznic, WC, umywalka, baterie',
      'Zabudowa meblowa kuchni, blat, zlewozmywak, AGD',
      'Oprawy oświetleniowe (tylko wypusty w suficie)',
      'Zmiany lokatorskie (modyfikacje standardu — umowa odrębna, koszt po stronie nabywcy)',
    ],
    floorPlanImageId: null,
    roomNotes: {
      'Pokój dzienny + aneks kuchenny': '30,94 m²',
      'Sypialnia I': '16,35 m²',
      'Sypialnia II': '13,78 m²',
      'Sypialnia III': '11,17 m²',
      'Łazienka': '5,08 m²',
      'WC': '1,80 m²',
      'Garderoba': '3,69 m²',
      'Komunikacja I (korytarz)': '1,87 m²',
      'Komunikacja II (przedpokój)': '5,23 m²',
      'Balkon I': '8,19 m² (nie wliczony w metraż mieszkania)',
      'Balkon II (duży)': '19,96 m² (nie wliczony w metraż mieszkania)',
      'Balkon III': '5,46 m² (nie wliczony w metraż mieszkania)',
    },
    links: [
      { label: 'Moja Skawina — strona inwestycji', url: 'https://mojaskawina.pl' },
      { label: 'EPOL HOLDING — deweloper', url: 'https://epolholding.com' },
    ],
    notes:
      'Lokal M.48, IV piętro, Segment B, Budynek B1. Ekspozycja: Północ.\n' +
      'Metraż: 89,91 m² (wg normy PN-ISO 9836:2022-07). Balkony łącznie: 33,61 m².\n' +
      'Cena lokalu: 849 000 zł (VAT 8% wliczony). Budżet remontowy w kredycie: 130 000 zł.\n' +
      'Garaż podziemny + komórka lokatorska: ceny do uzupełnienia po podpisaniu UD.\n' +
      'Termin zakończenia robót: do 31.10.2026. Odbiór: do 31.05.2027.\n' +
      'Deweloper: EPOL HOLDING Sp. z o.o., ul. Targowa 9A, Łódź. NIP: 7282749467. KRS: 0000357354.\n' +
      'KW: KR3I/00024118/6 (SR Wieliczka, Wydział w Skawinie). Działki: 1398/2, 1402/2, 1404/5, 1405/2.\n' +
      'Pozwolenie na budowę: decyzja nr AB.II-S.1.133.2022 z 05.04.2022 r. (Starosta Krakowski).\n' +
      'Rachunek powierniczy: ING Bank Śląski S.A. (otwarty).',
  })

  await tx.purchaseCosts.bulkPut([
    {
      id: 'cost-1',
      name: 'Cena lokalu mieszkalnego M.48',
      category: 'property',
      amount: 849000,
      status: 'confirmed',
      dueDate: null,
      note: 'Lokal M.48, IV piętro, Segment B. 89,91 m², 4 pokoje, ekspozycja N. VAT 8% wliczony. Płatna w 4 transzach wg harmonogramu dewelopera.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-7',
      name: 'Miejsce postojowe w garażu podziemnym',
      category: 'parking',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'Garaż podziemny, 2 kondygnacje, 187 miejsc. Numer miejsca i cena do uzupełnienia po podpisaniu UD. Cena wliczona do całkowitego kosztu zakupu.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-8',
      name: 'Komórka lokatorska',
      category: 'storage',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'Komórka lokatorska przynależna do M.48. Numer i cena do uzupełnienia po podpisaniu UD.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-5',
      name: 'Koszty notarialne',
      category: 'notary',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'Koszty aktu notarialnego dzielone po połowie z deweloperem (wg UD). Koszty UD (przeniesienia własności) i wpisu KW — po stronie nabywcy. Do wyceny u notariusza.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-9',
      name: 'Wpis do Księgi Wieczystej',
      category: 'court',
      amount: 0,
      status: 'planned',
      dueDate: null,
      note: 'KW: KR3I/00024118/6, SR Wieliczka, Wydział w Skawinie. Koszt po stronie nabywcy wg UD.',
      linkedDocumentIds: [],
    },
    {
      id: 'cost-6',
      name: 'Prowizja bankowa (Santander)',
      category: 'bank',
      amount: 0,
      status: 'confirmed',
      dueDate: null,
      note: '0 zł warunkowo — pod warunkiem utrzymania ubezpieczenia Spokojna Hipoteka przez min. 5 lat. Formularz KS22562797.',
      linkedDocumentIds: [],
    },
  ])

  await tx.mortgage.put({
    id: 'main',
    bankName: 'Santander Bank Polska S.A.',
    amount: 881100,
    interestRate: 3.83,
    margin: 1.55,
    rateType: 'variable',
    periodMonths: 300,
    installmentType: 'equal',
    startDate: '2026-04-30',
    notes:
      'Kwota: 849 000 (zakup) + 130 000 (remont) − 97 900 (wkład własny) = 881 100 zł. ' +
      'Pośrednik: Notus Finanse S.A. RRSO: 5,90%. Rata równa: 5 348,41 zł. ' +
      'Prowizja 0 zł warunkowo (wymagana Spokojna Hipoteka przez min. 5 lat). ' +
      'Całkowita kwota do spłaty: 1 648 238,89 zł.',
    linkedDocumentIds: [],
  })

  await tx.mortgageTranches.bulkPut([
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

  await tx.householdIncomes.bulkPut([
    { id: 'income-1', label: 'Jarek', person: 'me', amountNet: 25200, frequency: 'monthly', activeFrom: '2026-01-01', activeTo: null, sortIndex: 0 },
    { id: 'income-2', label: 'Blanka', person: 'partner', amountNet: 5000, frequency: 'monthly', activeFrom: '2026-01-01', activeTo: null, sortIndex: 1 },
    { id: 'income-3', label: 'Dziecko', person: 'other', amountNet: 800, frequency: 'monthly', activeFrom: '2026-01-01', activeTo: null, sortIndex: 2 },
  ])

  await tx.householdExpenses.bulkPut([
    { id: 'exp-1',  label: 'Wynajem mieszkania',                         category: 'Mieszkanie (wynajem/czynsz)', amount: 1700,   frequency: 'monthly', month: null, isLiability: false, sortIndex: 0 },
    { id: 'exp-2',  label: 'Czynsz administracyjny',                     category: 'Mieszkanie (wynajem/czynsz)', amount: 800,    frequency: 'monthly', month: null, isLiability: false, sortIndex: 1 },
    { id: 'exp-13', label: 'Ubezpieczenie na życie (Spokojna Hipoteka)', category: 'Bank i ubezpieczenia',        amount: 308.39, frequency: 'monthly', month: null, isLiability: false, sortIndex: 2 },
    { id: 'exp-14-2026', label: 'Ubezpieczenie nieruchomości 2026 (Locum Comfort)', category: 'Bank i ubezpieczenia', amount: 984, frequency: 'oneTime', month: '2026-01', isLiability: false, sortIndex: 3 },
    { id: 'exp-14-2027', label: 'Ubezpieczenie nieruchomości 2027 (Locum Comfort)', category: 'Bank i ubezpieczenia', amount: 984, frequency: 'oneTime', month: '2027-01', isLiability: false, sortIndex: 4 },
    { id: 'exp-14-2028', label: 'Ubezpieczenie nieruchomości 2028 (Locum Comfort)', category: 'Bank i ubezpieczenia', amount: 984, frequency: 'oneTime', month: '2028-01', isLiability: false, sortIndex: 5 },
    { id: 'exp-14-2029', label: 'Ubezpieczenie nieruchomości 2029 (Locum Comfort)', category: 'Bank i ubezpieczenia', amount: 984, frequency: 'oneTime', month: '2029-01', isLiability: false, sortIndex: 6 },
    { id: 'exp-14-2030', label: 'Ubezpieczenie nieruchomości 2030 (Locum Comfort)', category: 'Bank i ubezpieczenia', amount: 984, frequency: 'oneTime', month: '2030-01', isLiability: false, sortIndex: 7 },
    { id: 'exp-15', label: 'Konto osobiste Santander',                   category: 'Bank i ubezpieczenia',        amount: 6,      frequency: 'monthly', month: null, isLiability: false, sortIndex: 4 },
    { id: 'exp-16', label: 'Karta Visa Silver (Santander)',               category: 'Bank i ubezpieczenia',        amount: 7.50,   frequency: 'monthly', month: null, isLiability: false, sortIndex: 5 },
    { id: 'exp-7',  label: 'Rata — Telefon',                             category: 'Kredyty/raty',                amount: 580,    frequency: 'monthly', month: null, isLiability: true,  sortIndex: 6 },
    { id: 'exp-8',  label: 'Rata — Leczenie',                            category: 'Kredyty/raty',                amount: 1250,   frequency: 'monthly', month: null, isLiability: true,  sortIndex: 7 },
    { id: 'exp-9',  label: 'Księgowość',                                 category: 'Firma',                       amount: 250,    frequency: 'monthly', month: null, isLiability: false, sortIndex: 8 },
    { id: 'exp-10', label: 'ZUS',                                        category: 'Firma',                       amount: 2757,   frequency: 'monthly', month: null, isLiability: false, sortIndex: 9 },
    { id: 'exp-11', label: 'PIT 28',                                     category: 'Firma',                       amount: 2361,   frequency: 'monthly', month: null, isLiability: false, sortIndex: 10 },
    { id: 'exp-12', label: 'VAT 7',                                      category: 'Firma',                       amount: 4715,   frequency: 'monthly', month: null, isLiability: false, sortIndex: 11 },
    { id: 'exp-3',  label: 'Orange — telefon i internet',                category: 'Rachunki',                    amount: 250,    frequency: 'monthly', month: null, isLiability: false, sortIndex: 12 },
    { id: 'exp-4',  label: 'Netflix',                                    category: 'Subskrypcje',                 amount: 43,     frequency: 'monthly', month: null, isLiability: false, sortIndex: 13 },
    { id: 'exp-5',  label: 'Disney+',                                    category: 'Subskrypcje',                 amount: 30,     frequency: 'monthly', month: null, isLiability: false, sortIndex: 14 },
    { id: 'exp-6',  label: 'Przedszkole',                                category: 'Dziecko',                     amount: 600,    frequency: 'monthly', month: null, isLiability: false, sortIndex: 15 },
  ])

  await tx.expenseCategories.bulkPut(
    DEFAULT_CATEGORIES.map((name, i) => ({ id: name, name, sortIndex: i }))
  )

  // Seed current month as the first open budget month
  const now = new Date()
  const seedMonthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  await tx.budgetMonths.put({ id: seedMonthId, openedAt: now.toISOString(), savedAmount: 0 })

  // Seed oneTime income copies for current month (per-month materialization)
  await tx.householdIncomes.bulkPut([
    { id: `income-1-m${seedMonthId}`, label: 'Jarek', person: 'me', amountNet: 25200, frequency: 'oneTime', month: seedMonthId, activeFrom: '2026-01-01', activeTo: null, sortIndex: 0 },
    { id: `income-2-m${seedMonthId}`, label: 'Blanka', person: 'partner', amountNet: 5000, frequency: 'oneTime', month: seedMonthId, activeFrom: '2026-01-01', activeTo: null, sortIndex: 1 },
    { id: `income-3-m${seedMonthId}`, label: 'Dziecko', person: 'other', amountNet: 800, frequency: 'oneTime', month: seedMonthId, activeFrom: '2026-01-01', activeTo: null, sortIndex: 2 },
  ])

  // Seed oneTime expense copies for recurring expenses for current month
  await tx.householdExpenses.bulkPut([
    { id: `exp-1-m${seedMonthId}`,  label: 'Wynajem mieszkania',                         category: 'Mieszkanie (wynajem/czynsz)', amount: 1700,   frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 0 },
    { id: `exp-2-m${seedMonthId}`,  label: 'Czynsz administracyjny',                     category: 'Mieszkanie (wynajem/czynsz)', amount: 800,    frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 1 },
    { id: `exp-13-m${seedMonthId}`, label: 'Ubezpieczenie na życie (Spokojna Hipoteka)', category: 'Bank i ubezpieczenia',        amount: 308.39, frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 2 },
    { id: `exp-15-m${seedMonthId}`, label: 'Konto osobiste Santander',                   category: 'Bank i ubezpieczenia',        amount: 6,      frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 4 },
    { id: `exp-16-m${seedMonthId}`, label: 'Karta Visa Silver (Santander)',               category: 'Bank i ubezpieczenia',        amount: 7.50,   frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 5 },
    { id: `exp-7-m${seedMonthId}`,  label: 'Rata — Telefon',                             category: 'Kredyty/raty',                amount: 580,    frequency: 'oneTime', month: seedMonthId, isLiability: true,  sortIndex: 6 },
    { id: `exp-8-m${seedMonthId}`,  label: 'Rata — Leczenie',                            category: 'Kredyty/raty',                amount: 1250,   frequency: 'oneTime', month: seedMonthId, isLiability: true,  sortIndex: 7 },
    { id: `exp-9-m${seedMonthId}`,  label: 'Księgowość',                                 category: 'Firma',                       amount: 250,    frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 8 },
    { id: `exp-10-m${seedMonthId}`, label: 'ZUS',                                        category: 'Firma',                       amount: 2757,   frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 9 },
    { id: `exp-11-m${seedMonthId}`, label: 'PIT 28',                                     category: 'Firma',                       amount: 2361,   frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 10 },
    { id: `exp-12-m${seedMonthId}`, label: 'VAT 7',                                      category: 'Firma',                       amount: 4715,   frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 11 },
    { id: `exp-3-m${seedMonthId}`,  label: 'Orange — telefon i internet',                category: 'Rachunki',                    amount: 250,    frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 12 },
    { id: `exp-4-m${seedMonthId}`,  label: 'Netflix',                                    category: 'Subskrypcje',                 amount: 43,     frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 13 },
    { id: `exp-5-m${seedMonthId}`,  label: 'Disney+',                                    category: 'Subskrypcje',                 amount: 30,     frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 14 },
    { id: `exp-6-m${seedMonthId}`,  label: 'Przedszkole',                                category: 'Dziecko',                     amount: 600,    frequency: 'oneTime', month: seedMonthId, isLiability: false, sortIndex: 15 },
  ])

  await tx.savingsPlan.put({
    id: 'main',
    initialSavings: 8000,
    safetyBuffer: 30000,
    currentSavings: 8000,
    lastUpdated: new Date().toISOString(),
  })

  await tx.milestones.bulkPut([
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

  await tx.scenarios.bulkPut([
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
  // Wrap in transaction so the count-check + insert is atomic.
  // This prevents React StrictMode's double-invoke from causing ConstraintError.
  await db.transaction('rw', [
    db.property, db.purchaseCosts, db.mortgage, db.mortgageTranches,
    db.householdIncomes, db.householdExpenses, db.expenseCategories,
    db.budgetMonths, db.savingsPlan, db.milestones, db.scenarios,
  ], async () => {
    await _seedRealData(db as unknown as KluczeDB)
  })
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
    expenseCategories,
    budgetMonths,
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
    db.expenseCategories.toArray(),
    db.budgetMonths.toArray(),
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
      version: 2,
      exportedAt: new Date().toISOString(),
      data: {
        property,
        purchaseCosts,
        mortgage,
        mortgageTranches,
        householdIncomes,
        householdExpenses,
        expenseCategories,
        budgetMonths,
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
      db.expenseCategories,
      db.budgetMonths,
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
        db.expenseCategories.clear(),
        db.budgetMonths.clear(),
        db.savingsPlan.clear(),
        db.fitoutItems.clear(),
        db.scenarios.clear(),
        db.documents.clear(),
        db.milestones.clear(),
        db.checklistItems.clear(),
        db.decisions.clear(),
      ])

      const puts: Promise<unknown>[] = []
      if (data.property?.length)          puts.push(db.property.bulkAdd(data.property))
      if (data.purchaseCosts?.length)     puts.push(db.purchaseCosts.bulkAdd(data.purchaseCosts))
      if (data.mortgage?.length)          puts.push(db.mortgage.bulkAdd(data.mortgage))
      if (data.mortgageTranches?.length)  puts.push(db.mortgageTranches.bulkAdd(data.mortgageTranches))
      if (data.householdIncomes?.length)  puts.push(db.householdIncomes.bulkAdd(data.householdIncomes))
      if (data.householdExpenses?.length) puts.push(db.householdExpenses.bulkAdd(data.householdExpenses))
      if (data.expenseCategories?.length) puts.push(db.expenseCategories.bulkAdd(data.expenseCategories))
      if (data.budgetMonths?.length)      puts.push(db.budgetMonths.bulkAdd(data.budgetMonths))
      if (data.savingsPlan?.length)       puts.push(db.savingsPlan.bulkAdd(data.savingsPlan))
      if (data.fitoutItems?.length)       puts.push(db.fitoutItems.bulkAdd(data.fitoutItems))
      if (data.scenarios?.length)         puts.push(db.scenarios.bulkAdd(data.scenarios))
      if (data.documents?.length)         puts.push(db.documents.bulkAdd(data.documents))
      if (data.milestones?.length)        puts.push(db.milestones.bulkAdd(data.milestones))
      if (data.checklistItems?.length)    puts.push(db.checklistItems.bulkAdd(data.checklistItems))
      if (data.decisions?.length)         puts.push(db.decisions.bulkAdd(data.decisions))
      await Promise.all(puts)
    },
  )
}

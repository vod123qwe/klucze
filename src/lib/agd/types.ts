export type AppliancePart = 'hood' | 'hob' | 'oven' | 'microwave' | 'fridge'

/** Wykończenie frontów — steruje kolorem rysunku urządzenia */
export type Finish = 'black' | 'inox' | 'graphite'

/** Wariant rysunku: rodzaj okapu, typ płyty, drzwi lodówki itp. */
export type IllustrationStyle = 'telescopic' | 'chimney' | 'ceiling' | 'flex' | 'flush' | 'knobs' | 'sliding'

export interface StorePrice {
  store: string
  price: number
}

export interface Appliance {
  category: AppliancePart
  brand: string
  model: string
  name: string
  price: number
  oldPrice: number | null
  /** 'live' — cena potwierdzona w sklepie, 'estimate' — szacunek na podstawie ostatnich ofert */
  priceConfidence: 'live' | 'estimate'
  store: string
  storeUrl: string
  otherStores: StorePrice[]
  promo: string | null
  imageUrl: string
  finish?: Finish
  style?: IllustrationStyle
  specs: Record<string, string>
  features: string[]
  /** Tylko płyta: czy da się ją zamontować na równo z blatem */
  flushMount?: boolean | null
  notes?: string
}

export interface ApplianceSet {
  slug: string
  label: string
  tagline: string
  priceRange: string
  accent: string
  brandSummary: string
  bestFor: string
  products: Appliance[]
  setPromos: string[]
  pros: string[]
  cons: string[]
  /** Krótkie wartości do tabeli porównawczej, klucze wspólne dla wszystkich wariantów */
  compare: Record<string, string>
}

export const PART_LABEL: Record<AppliancePart, string> = {
  hood: 'Okap',
  hob: 'Płyta indukcyjna',
  oven: 'Piekarnik',
  microwave: 'Mikrofalówka',
  fridge: 'Lodówka',
}

export const PART_ORDER: AppliancePart[] = ['hood', 'hob', 'oven', 'microwave', 'fridge']

export function setTotal(set: ApplianceSet) {
  return set.products.reduce((sum, p) => sum + p.price, 0)
}

export function setOldTotal(set: ApplianceSet) {
  return set.products.reduce((sum, p) => sum + (p.oldPrice ?? p.price), 0)
}

export function productFor(set: ApplianceSet, part: AppliancePart) {
  return set.products.find(p => p.category === part)
}

import type { Appliance } from './types'
import { ceneoUrl, storeSearchUrl } from './links'

export interface Offer {
  store: string
  price: number
  url: string
  /** true — bezpośredni link do produktu, false — wyszukiwanie modelu w sklepie */
  direct: boolean
}

export function productQuery(p: Pick<Appliance, 'brand' | 'model'>) {
  return `${p.brand} ${p.model}`
}

/** Wszystkie znane oferty produktu, najtańsza pierwsza, plus porównanie cen na Ceneo */
export function offersFor(p: Appliance): Offer[] {
  const query = productQuery(p)
  const offers: Offer[] = [
    { store: p.store, price: p.price, url: p.storeUrl || storeSearchUrl(p.store, query), direct: !!p.storeUrl },
    ...p.otherStores
      .filter(o => o.store !== p.store)
      .map(o => ({ store: o.store, price: o.price, url: storeSearchUrl(o.store, query), direct: false })),
  ]
  offers.sort((a, b) => a.price - b.price)
  if (!offers.some(o => /ceneo/i.test(o.store))) {
    offers.push({ store: 'Ceneo — porównaj ceny', price: 0, url: ceneoUrl(query), direct: false })
  }
  return offers
}

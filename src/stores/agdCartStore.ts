import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appliance } from '@/lib/agd/types'
import type { Offer } from '@/lib/agd/offers'

export interface CartItem {
  id: string
  /** Z którego wariantu pochodzi produkt (albo jego alternatywa) */
  setSlug: string
  product: Appliance
  offer: Offer
}

interface AgdCartStore {
  items: CartItem[]
  add: (setSlug: string, product: Appliance, offer: Offer) => void
  /** Dodaje produkt, zastępując to, co już jest w koszyku w tej samej kategorii */
  replaceInCategory: (setSlug: string, product: Appliance, offer: Offer) => void
  setOffer: (id: string, offer: Offer) => void
  remove: (id: string) => void
  clear: () => void
}

const itemId = (product: Appliance) => `${product.brand}:${product.model}`

export const useAgdCart = create<AgdCartStore>()(
  persist(
    set => ({
      items: [],
      add: (setSlug, product, offer) =>
        set(s => {
          const id = itemId(product)
          if (s.items.some(i => i.id === id)) {
            return { items: s.items.map(i => (i.id === id ? { ...i, offer } : i)) }
          }
          return { items: [...s.items, { id, setSlug, product, offer }] }
        }),
      replaceInCategory: (setSlug, product, offer) =>
        set(s => ({
          items: [
            ...s.items.filter(i => i.product.category !== product.category),
            { id: itemId(product), setSlug, product, offer },
          ],
        })),
      setOffer: (id, offer) => set(s => ({ items: s.items.map(i => (i.id === id ? { ...i, offer } : i)) })),
      remove: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'klucze-agd-cart' },
  ),
)

export function useIsInCart(product: Appliance) {
  return useAgdCart(s => s.items.some(i => i.id === itemId(product)))
}

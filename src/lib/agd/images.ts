import manifest from '../../../public/agd/img/manifest.json'
import type { Appliance } from './types'

const files = manifest as Record<string, { file: string }>

/** Ten sam klucz co w scripts/agd-images (marka + model, małe litery, myślniki) */
const slug = (p: Pick<Appliance, 'brand' | 'model'>) =>
  `${p.brand} ${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Zdjęcie produktu: jawny imageUrl, pobrany packshot z public/agd/img albo pusty string (rysunek) */
export function imageFor(p: Pick<Appliance, 'brand' | 'model' | 'imageUrl'>) {
  if (p.imageUrl) return p.imageUrl
  const hit = files[slug(p)]
  return hit ? `agd/img/${hit.file}` : ''
}

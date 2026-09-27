'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AppliancePart, Finish, IllustrationStyle } from '@/lib/agd/types'
import { ApplianceIllustration } from './ApplianceIllustration'

interface ProductImageProps {
  src: string
  alt: string
  category: AppliancePart
  finish?: Finish
  style?: IllustrationStyle
  className?: string
}

/**
 * Zdjęcia są ładowane bezpośrednio z CDN producentów/sklepów.
 * Bez zdjęcia albo gdy serwer zablokuje hotlink, pokazujemy rysunek urządzenia.
 */
export function ProductImage({ src, alt, category, finish, style, className }: ProductImageProps) {
  const [failed, setFailed] = useState(!src)

  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden bg-white', className)}>
      {failed ? (
        <ApplianceIllustration category={category} finish={finish} style={style} className="h-full w-full p-2" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-2"
        />
      )}
    </div>
  )
}

'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Hammer } from 'lucide-react'

export default function WykonczeniePage() {
  return (
    <div className="px-6 py-5 max-w-4xl">
      <PageHeader
        title="Wykończenie"
        description="Plan i budżet wykończenia mieszkania — dostępne w Etapie 2"
      />
      <SectionEmptyState
        icon={Hammer}
        title="Sekcja w przygotowaniu"
        description="Moduł wykończenia (itemizowany plan, 3 warianty kosztów, gap analysis) będzie dostępny w kolejnym etapie budowy aplikacji."
      />
    </div>
  )
}

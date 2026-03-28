'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { Layers } from 'lucide-react'

export default function ScenariuszePage() {
  return (
    <div className="px-6 py-5 max-w-4xl">
      <PageHeader
        title="Scenariusze"
        description="Symulacje finansowe — dostępne w Etapie 2"
      />
      <SectionEmptyState
        icon={Layers}
        title="Sekcja w przygotowaniu"
        description="Moduł scenariuszy (optymistyczny, realistyczny, bezpieczny) z edytowalnymi parametrami będzie dostępny w kolejnym etapie."
      />
    </div>
  )
}

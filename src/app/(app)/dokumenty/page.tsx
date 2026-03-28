'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { SectionEmptyState } from '@/components/shared/SectionEmptyState'
import { FileText } from 'lucide-react'

export default function DokumentyPage() {
  return (
    <div className="px-6 py-5 max-w-4xl">
      <PageHeader
        title="Dokumenty"
        description="Archiwum dokumentów i ofert — dostępne w Etapie 3"
      />
      <SectionEmptyState
        icon={FileText}
        title="Sekcja w przygotowaniu"
        description="Moduł dokumentów (upload PDF/obrazów, tagowanie, powiązania z danymi) będzie dostępny w kolejnym etapie."
      />
    </div>
  )
}

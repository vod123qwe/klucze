'use client'

import { Menu, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/appStore'
import { exportAllData, importAllData } from '@/lib/db/db'
import { toast } from 'sonner'

export function TopBar() {
  const { toggleSidebar } = useAppStore()

  async function handleExport() {
    try {
      const json = await exportAllData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `klucze-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Dane wyeksportowane')
    } catch {
      toast.error('Błąd eksportu danych')
    }
  }

  async function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        await importAllData(text)
        toast.success('Dane zaimportowane — odśwież stronę')
        window.location.reload()
      } catch {
        toast.error('Błąd importu — sprawdź plik JSON')
      }
    }
    input.click()
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleImport}>
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Eksport
        </Button>
      </div>
    </header>
  )
}

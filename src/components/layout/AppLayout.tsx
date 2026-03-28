'use client'

import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { seedDefaultData } from '@/lib/db/db'
import { Toaster } from '@/components/ui/sonner'

export function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedDefaultData().catch(console.error)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  )
}

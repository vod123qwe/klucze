'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  Receipt,
  Landmark,
  PiggyBank,
  Calendar,
  Hammer,
  Layers,
  FileText,
  CheckSquare,
  BookOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mieszkanie', label: 'Mieszkanie', icon: Home },
  { href: '/koszty', label: 'Koszty zakupu', icon: Receipt },
  { href: '/kredyt', label: 'Kredyt', icon: Landmark },
  { href: '/budzet', label: 'Budżet', icon: PiggyBank },
  { href: '/harmonogram', label: 'Harmonogram', icon: Calendar },
  { href: '/wykonczenie', label: 'Wykończenie', icon: Hammer },
  { href: '/scenariusze', label: 'Scenariusze', icon: Layers },
  { href: '/dokumenty', label: 'Dokumenty', icon: FileText },
  { href: '/checklista', label: 'Checklista', icon: CheckSquare },
  { href: '/notatki', label: 'Notatki', icon: BookOpen },
]

const SECTION_LABELS: Record<string, string> = {
  '/dashboard': 'Centrum',
  '/mieszkanie': 'Nieruchomość',
  '/koszty': 'Nieruchomość',
  '/kredyt': 'Finansowanie',
  '/budzet': 'Finansowanie',
  '/harmonogram': 'Finansowanie',
  '/wykonczenie': 'Planowanie',
  '/scenariusze': 'Planowanie',
  '/dokumenty': 'Archiwum',
  '/checklista': 'Archiwum',
  '/notatki': 'Archiwum',
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Home className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Klucze
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            const currentSection = SECTION_LABELS[item.href]
            const prevSection = idx > 0 ? SECTION_LABELS[navItems[idx - 1].href] : null
            const showSectionLabel = currentSection !== prevSection

            return (
              <div key={item.href}>
                {showSectionLabel && (
                  <p className="mt-3 mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {currentSection}
                  </p>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'nav-item flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm',
                    isActive
                      ? 'bg-sidebar-accent font-medium text-sidebar-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')} />
                  <span>{item.label}</span>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="text-[10px] text-muted-foreground/50">Klucze · local-first · prywatne</p>
        </div>
      </aside>
    </>
  )
}

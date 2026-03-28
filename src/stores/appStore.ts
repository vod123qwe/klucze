import { create } from 'zustand'

interface AppStore {
  activeScenarioId: string
  setActiveScenario: (id: string) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeScenarioId: 'realistic',
  setActiveScenario: (id) => set({ activeScenarioId: id }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

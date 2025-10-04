'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  currentEntityType: string | null
  setCurrentEntityType: (entityType: string | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers')
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [currentEntityType, setCurrentEntityType] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AppContext.Provider value={{
      currentEntityType,
      setCurrentEntityType,
      sidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  )
}

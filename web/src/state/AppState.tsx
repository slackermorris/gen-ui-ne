import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AppState {
  revenue: string
  activeUsers: string
  conversion: string
  systemStatus: 'healthy' | 'degraded' | 'down'
  activeNav: string
}

const initialState: AppState = {
  revenue: '$124,500',
  activeUsers: '1,284',
  conversion: '3.2%',
  systemStatus: 'healthy',
  activeNav: 'dashboard',
}

interface StateContextValue {
  state: AppState
  setState: <K extends keyof AppState>(key: K, value: AppState[K]) => void
}

const StateContext = createContext<StateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<AppState>(initialState)

  function setState<K extends keyof AppState>(key: K, value: AppState[K]) {
    setStateInternal(prev => ({ ...prev, [key]: value }))
  }

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

import { useAppState, type AppState } from '../state/AppState'
import { cn } from '../utils/cn'

interface StatusBadgeProps {
  label: string
  stateKey: keyof AppState
}

const statusStyles: Record<string, string> = {
  healthy: 'bg-green-50 text-green-700 border-green-200',
  degraded: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  down: 'bg-red-50 text-red-700 border-red-200',
}

const dotStyles: Record<string, string> = {
  healthy: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
}

export function StatusBadge({ label, stateKey }: StatusBadgeProps) {
  const { state } = useAppState()
  const value = String(state[stateKey])

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', statusStyles[value] ?? 'bg-gray-50 text-gray-700 border-gray-200')}>
        <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[value] ?? 'bg-gray-400')} />
        {value}
      </span>
    </div>
  )
}

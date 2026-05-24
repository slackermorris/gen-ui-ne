import { useAppState, type AppState } from '../state/app-state'

interface MetricCardProps {
  label: string
  stateKey: keyof AppState
}

export function MetricCard({ label, stateKey }: MetricCardProps) {
  const { state } = useAppState()
  const value = state[stateKey]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{String(value)}</p>
    </div>
  )
}

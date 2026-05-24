interface AutoInvestCardProps {
  amount: string
  frequency: string
  nextDate: string
}

export function AutoInvestCard({ amount, frequency, nextDate }: AutoInvestCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-gray-500">Auto-invest</p>
      <p className="text-2xl font-bold text-gray-900">{amount}</p>
      <p className="mt-0.5 text-sm text-gray-600">{frequency}</p>
      <div className="mt-3 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">Next investment</p>
        <p className="text-sm font-medium text-gray-900">{nextDate}</p>
      </div>
    </div>
  )
}

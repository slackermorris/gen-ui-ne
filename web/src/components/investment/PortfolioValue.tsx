import { cn } from '../../utils/cn'

interface PortfolioValueProps {
  value: string
  change: string
  changePercent: string
  direction: 'positive' | 'negative' | 'neutral'
}

const changeStyles = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-400',
}

export function PortfolioValue({ value, change, changePercent, direction }: PortfolioValueProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">Portfolio value</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      <p className={cn('mt-1 text-sm font-medium', changeStyles[direction])}>
        {change} ({changePercent})
      </p>
    </div>
  )
}

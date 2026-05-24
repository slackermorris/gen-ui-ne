import { cn } from '../../utils/cn'

interface HoldingRowProps {
  name: string
  code: string
  value: string
  returnPercent: string
  direction: 'positive' | 'negative' | 'neutral'
}

export function HoldingRow({ name, code, value, returnPercent, direction }: HoldingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-400">{code}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{value}</p>
        <p className={cn('text-xs font-medium', {
          'text-green-600': direction === 'positive',
          'text-red-600': direction === 'negative',
          'text-gray-400': direction === 'neutral',
        })}>
          {returnPercent}
        </p>
      </div>
    </div>
  )
}

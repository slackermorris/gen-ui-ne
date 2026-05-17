import { cn } from '../../utils/cn'

interface ReturnBadgeProps {
  value: string
  direction: 'positive' | 'negative' | 'neutral'
  label?: string
}

const badgeStyles = {
  positive: 'bg-green-50 text-green-700 border-green-200',
  negative: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-50 text-gray-600 border-gray-200',
}

const arrow = { positive: '↑', negative: '↓', neutral: '–' }

export function ReturnBadge({ value, direction, label }: ReturnBadgeProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {label && <p className="mb-2 text-sm text-gray-500">{label}</p>}
      <span className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold', badgeStyles[direction])}>
        {arrow[direction]} {value}
      </span>
    </div>
  )
}

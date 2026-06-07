import { cn } from '../../utils/cn'
import { Schema } from 'effect'

// @schema-export-start
export const PortfolioValueProps = Schema.Struct({
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(["positive", "negative", "neutral"]),
}).annotate({
  description: "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
})
// @schema-export-end

type PortfolioValueProps = typeof PortfolioValueProps.Type

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

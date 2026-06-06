import { Schema } from 'effect'

// @schema-export-start
export const AllocationBarProps = Schema.Struct({
  segments: Schema.Array(Schema.Struct({
    label: Schema.String,
    percent: Schema.Number,
  })),
}).annotate({
  description: "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
})
// @schema-export-end

type AllocationBarProps = typeof AllocationBarProps.Type

const COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500']
const DOT_COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500']

export function AllocationBar({ segments }: AllocationBarProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-gray-500">Allocation</p>
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((seg, i) => (
          <div key={seg.label} className={COLORS[i % COLORS.length]} style={{ width: `${seg.percent}%` }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
            <span className="text-xs text-gray-600">{seg.label} {seg.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

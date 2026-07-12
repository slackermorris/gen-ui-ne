import { Schema } from 'effect';

// @schema-export-start
export const AllocationBarProps = Schema.Struct({
  segments: Schema.Array(
    Schema.Struct({
      label: Schema.String,
      percent: Schema.Number,
    }),
  ),
}).annotate({
  description:
    "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
});
// @schema-export-end

type AllocationBarProps = typeof AllocationBarProps.Type;

// No categorical data-viz palette is exposed by the design system, so segments
// rotate through the available semantic hues to stay distinguishable.
const COLORS = ['bg-primary', 'bg-success', 'bg-warning', 'bg-error', 'bg-muted'];
const DOT_COLORS = COLORS;

export function AllocationBar({ segments }: AllocationBarProps) {
  return (
    <div className="border-border bg-surface rounded-lg border p-4 shadow-xs">
      <p className="text-muted-foreground mb-3 text-sm">Allocation</p>
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className={COLORS[i % COLORS.length]}
            style={{ width: `${seg.percent}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
            <span className="text-muted-foreground text-xs">
              {seg.label} {seg.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

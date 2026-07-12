import { Schema } from 'effect';

// @schema-export-start
export const RiskIndicatorProps = Schema.Struct({
  rating: Schema.Number,
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description:
    "Displays the investor's risk rating on a 1–7 scale. Use to surface or reinforce risk profile awareness, especially when recommending funds.",
});
// @schema-export-end

type RiskIndicatorProps = typeof RiskIndicatorProps.Type;

export function RiskIndicator({ rating, label = 'Risk level' }: RiskIndicatorProps) {
  const color = rating <= 2 ? 'bg-success' : rating <= 4 ? 'bg-warning' : 'bg-error';

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-xs">
      <p className="mb-3 text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-xs ${i < rating ? color : 'bg-secondary'}`} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="text-xs text-muted-foreground">Lower risk</span>
        <span className="text-xs text-muted-foreground">Higher risk</span>
      </div>
    </div>
  );
}

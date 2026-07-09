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
  const color = rating <= 2 ? 'bg-green-500' : rating <= 4 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
      <p className="mb-3 text-sm text-gray-500">{label}</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-xs ${i < rating ? color : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="text-xs text-gray-400">Lower risk</span>
        <span className="text-xs text-gray-400">Higher risk</span>
      </div>
    </div>
  );
}

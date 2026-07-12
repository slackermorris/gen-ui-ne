import { Schema } from 'effect';

// @schema-export-start
export const AutoInvestCardProps = Schema.Struct({
  amount: Schema.String,
  frequency: Schema.String,
  nextDate: Schema.String,
}).annotate({
  description:
    "Shows an investor's auto-invest configuration: amount, frequency, and next scheduled date. Use when the investor has an active auto-invest and the context is relevant.",
});
// @schema-export-end

type AutoInvestCardProps = typeof AutoInvestCardProps.Type;

export function AutoInvestCard({ amount, frequency, nextDate }: AutoInvestCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-xs">
      <p className="mb-3 text-sm text-muted-foreground">Auto-invest</p>
      <p className="text-2xl font-bold text-surface-foreground">{amount}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{frequency}</p>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">Next investment</p>
        <p className="text-sm font-medium text-surface-foreground">{nextDate}</p>
      </div>
    </div>
  );
}

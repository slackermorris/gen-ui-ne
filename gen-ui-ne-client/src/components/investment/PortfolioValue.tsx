import { cn } from '../../utils/cn';
import { Schema } from 'effect';

// @schema-export-start
export const PortfolioValueProps = Schema.Struct({
  value: Schema.String,
  change: Schema.String,
  changePercent: Schema.String,
  direction: Schema.Literals(['positive', 'negative', 'neutral']),
}).annotate({
  description:
    "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
});
// @schema-export-end

type PortfolioValueProps = typeof PortfolioValueProps.Type;

const changeStyles = {
  positive: 'text-success',
  negative: 'text-error',
  neutral: 'text-muted-foreground',
};

export function PortfolioValue({ value, change, changePercent, direction }: PortfolioValueProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-xs">
      <p className="text-sm text-muted-foreground">Portfolio value</p>
      <p className="mt-1 text-3xl font-bold text-surface-foreground">{value}</p>
      <p className={cn('mt-1 text-sm font-medium', changeStyles[direction])}>
        {change} ({changePercent})
      </p>
    </div>
  );
}

import { cn } from '../../utils/cn';
import { Schema } from 'effect';

// @schema-export-start
export const ReturnBadgeProps = Schema.Struct({
  value: Schema.String,
  direction: Schema.Literals(['positive', 'negative', 'neutral']),
  label: Schema.optionalKey(Schema.String),
}).annotate({
  description:
    'A small badge showing a return figure with a direction indicator. Use to highlight a specific return metric inline or alongside a holding.',
});
// @schema-export-end

type ReturnBadgeProps = typeof ReturnBadgeProps.Type;

const badgeStyles = {
  positive: 'bg-success/10 text-success border-success/20',
  negative: 'bg-error/10 text-error border-error/20',
  neutral: 'bg-secondary text-secondary-foreground border-border',
};

const arrow = { positive: '↑', negative: '↓', neutral: '–' };

export function ReturnBadge({ value, direction, label }: ReturnBadgeProps) {
  return (
    <div className="border-border bg-surface rounded-lg border p-4 shadow-xs">
      {label && <p className="text-muted-foreground mb-2 text-sm">{label}</p>}
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold',
          badgeStyles[direction],
        )}
      >
        {arrow[direction]} {value}
      </span>
    </div>
  );
}

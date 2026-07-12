import { cn } from '../../utils/cn';
import { Schema } from 'effect';

// @schema-export-start
export const HoldingRowProps = Schema.Struct({
  name: Schema.String,
  code: Schema.String,
  value: Schema.String,
  returnPercent: Schema.String,
  direction: Schema.Literals(['positive', 'negative', 'neutral']),
}).annotate({
  description:
    'A single row showing one holding: name, ticker code, current value, and return percentage. Use inside a list to display multiple holdings.',
});
// @schema-export-end

type HoldingRowProps = typeof HoldingRowProps.Type;

export function HoldingRow({ name, code, value, returnPercent, direction }: HoldingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 shadow-xs">
      <div>
        <p className="text-sm font-medium text-surface-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{code}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-surface-foreground">{value}</p>
        <p
          className={cn('text-xs font-medium', {
            'text-success': direction === 'positive',
            'text-error': direction === 'negative',
            'text-muted-foreground': direction === 'neutral',
          })}
        >
          {returnPercent}
        </p>
      </div>
    </div>
  );
}

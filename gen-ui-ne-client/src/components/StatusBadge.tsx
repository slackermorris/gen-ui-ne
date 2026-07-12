import { useAppState, type AppState } from '../state/app-state';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  label: string;
  stateKey: keyof AppState;
}

const statusStyles: Record<string, string> = {
  healthy: 'bg-success/10 text-success border-success/20',
  degraded: 'bg-warning/10 text-warning border-warning/20',
  down: 'bg-error/10 text-error border-error/20',
};

const dotStyles: Record<string, string> = {
  healthy: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-error',
};

export function StatusBadge({ label, stateKey }: StatusBadgeProps) {
  const { state } = useAppState();
  const value = String(state[stateKey]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
          statusStyles[value] ?? 'bg-secondary text-secondary-foreground border-border',
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[value] ?? 'bg-muted')} />
        {value}
      </span>
    </div>
  );
}

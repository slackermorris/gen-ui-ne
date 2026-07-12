import { useAppState, type AppState } from '../state/app-state';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const variants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: 'p-6',
      compact: 'p-4',
      detailed: 'p-6 space-y-4',
    },
    status: {
      success: 'border border-success/30 bg-success/10',
      warning: 'border border-warning/30 bg-warning/10',
      error: 'border border-error/30 bg-error/10',
      info: 'border border-primary/30 bg-primary/10',
      neutral: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    status: 'neutral',
  },
});

interface Interface
  extends React.HtmlHTMLAttributes<HTMLDivElement>, VariantProps<typeof variants> {
  label: string;
  stateKey: keyof AppState;
  variant?: 'default' | 'compact' | 'detailed';
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export function MetricCard({ label, stateKey, variant, status, ...props }: Interface) {
  const { state } = useAppState();
  const value = state[stateKey];

  return (
    <div className={cn(variants({ variant, status }))} {...props}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{String(value)}</p>
    </div>
  );
}

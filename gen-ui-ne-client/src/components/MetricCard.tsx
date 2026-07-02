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
      success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50',
      warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50',
      error: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50',
      info: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50',
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
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{String(value)}</p>
    </div>
  );
}

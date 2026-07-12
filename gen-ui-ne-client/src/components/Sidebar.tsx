import { useAppState } from '../state/app-state';
import { cn } from '../utils/cn';

interface NavItem {
  key: string;
  label: string;
}

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const { state, setState } = useAppState();

  return (
    <nav className="flex w-48 flex-col gap-1 rounded-lg border border-border bg-surface p-3 shadow-xs">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setState('activeNav', item.key)}
          className={cn(
            'rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
            state.activeNav === item.key
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

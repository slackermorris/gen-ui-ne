import { useAppState } from '../state/app-state'
import { cn } from '../utils/cn'

interface NavItem {
  key: string
  label: string
}

interface SidebarProps {
  items: NavItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const { state, setState } = useAppState()

  return (
    <nav className="flex w-48 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => setState('activeNav', item.key)}
          className={cn(
            'rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
            state.activeNav === item.key
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100',
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

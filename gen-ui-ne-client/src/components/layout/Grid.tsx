import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GridProps {
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const colsClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }
const gapClass = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }

export function Grid({ columns = 1, gap = 'md', children }: GridProps) {
  return (
    <div className={cn('grid', colsClass[columns], gapClass[gap])}>
      {children}
    </div>
  )
}

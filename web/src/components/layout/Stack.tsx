import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface StackProps {
  direction?: 'horizontal' | 'vertical'
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  children?: ReactNode
}

const gapClass = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }
const alignClass = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' }

export function Stack({ direction = 'vertical', gap = 'md', align = 'stretch', children }: StackProps) {
  return (
    <div className={cn(
      'flex',
      direction === 'horizontal' ? 'flex-row' : 'flex-col',
      gapClass[gap],
      alignClass[align],
    )}>
      {children}
    </div>
  )
}

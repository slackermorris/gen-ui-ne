import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Effect, Schema } from 'effect'

// @schema-export-start
export const GridProps = Schema.Struct({
  columns: Schema.Literals([1, 2, 3, 4]).pipe(
    Schema.withDecodingDefault(Effect.succeed(1 as const)),
  ),
  gap: Schema.Literals(["sm", "md", "lg"]).pipe(
    Schema.withDecodingDefault(Effect.succeed("md" as const)),
  ),
  children: Schema.Array(Schema.String),
}).annotate({
  description: "A grid layout container. Use when displaying multiple items side by side, such as fund cards or summary metrics.",
})
// @schema-export-end

type GridProps = Omit<typeof GridProps.Type, 'children'> & { children?: ReactNode }

const colsClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }
const gapClass = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }

export function Grid({ columns = 1, gap = 'md', children }: GridProps) {
  return (
    <div className={cn('grid', colsClass[columns], gapClass[gap])}>
      {children}
    </div>
  )
}

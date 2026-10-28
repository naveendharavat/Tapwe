import type { CSSProperties } from 'react'
import { cn } from '../../../../lib/cn'
import { Box, type BoxProps } from '../Box/Box'

/** Step on the `--space-N` scale (N x 4px; `'1_5'` = 6px). */
export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 18 | 20 | '0_5' | '1_5' | '2_5' | '3_5' | '4_5'

export interface StackProps extends BoxProps {
  direction?: 'column' | 'row'
  gap?: SpaceStep
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
}

/** Lays children out in a row or column with a token gap. */
export function Stack({ direction = 'column', gap = 3, align, justify, wrap, className, style, ...rest }: StackProps) {
  return (
    <Box
      className={cn('stack', direction === 'row' && 'stack--row', wrap && 'stack--wrap', className)}
      style={{ gap: `var(--space-${gap})`, alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  )
}

import { cn } from '../../../../lib/cn'
import { Box, type BoxProps } from '../Box/Box'

export interface GridProps extends BoxProps {
  /** Desktop column count; collapses to fewer columns on small screens. */
  columns: 2 | 3 | 4
}

/** Responsive equal-width grid. */
export function Grid({ columns, className, ...rest }: GridProps) {
  return <Box className={cn(`g${columns}`, className)} {...rest} />
}

import { cn } from '../../../../lib/cn'
import { Box, type BoxProps } from '../Box/Box'

/** Centres content at the site width with the page gutter. */
export function Container({ className, ...rest }: BoxProps) {
  return <Box className={cn('wrap', className)} {...rest} />
}

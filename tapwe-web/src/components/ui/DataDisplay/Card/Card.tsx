import { cn } from '../../../../lib/cn'
import { Box, type BoxProps } from '../../Layout/Box/Box'

export interface CardProps extends BoxProps {
  /** Inner padding: sm 16px, md 24px, lg 32px. Omit when the content sets its own spacing. */
  size?: 'sm' | 'md' | 'lg'
  /** Lifts on hover, for cards that act as links or highlights. */
  interactive?: boolean
}

/** White surface with border, radius and soft shadow. */
export function Card({ size, interactive, className, ...rest }: CardProps) {
  return <Box className={cn('card', size && `card--${size}`, interactive && 'card--interactive', className)} {...rest} />
}

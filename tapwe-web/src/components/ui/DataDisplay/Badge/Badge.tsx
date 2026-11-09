import type { ReactNode } from 'react'
import { cn } from '../../../../lib/cn'

interface BadgeProps {
  tone?: 'ok' | 'warn' | 'brand'
  className?: string
  children: ReactNode
}

export function Badge({ tone, className, children }: BadgeProps) {
  return <span className={cn('badge', tone, className)}>{children}</span>
}

import type { ReactNode } from 'react'

interface BadgeProps {
  tone?: 'ok' | 'warn' | 'brand'
  className?: string
  children: ReactNode
}

export function Badge({ tone, className, children }: BadgeProps) {
  return <span className={['badge', tone, className].filter(Boolean).join(' ')}>{children}</span>
}

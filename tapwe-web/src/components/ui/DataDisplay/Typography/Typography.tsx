import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '../../../../lib/cn'

const VARIANTS = {
  eyebrow: { tag: 'span', className: 'eyebrow' },
  lead: { tag: 'p', className: 'lead' },
  muted: { tag: 'p', className: 'muted' },
  subtle: { tag: 'p', className: 'faint' },
  hint: { tag: 'p', className: 'hint' },
  'heading-sm': { tag: 'h2', className: 'heading-sm' },
  'heading-md': { tag: 'h2', className: 'heading-md' },
} as const

export interface TypographyProps {
  variant: keyof typeof VARIANTS
  as?: ElementType
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** Text styles that are not tied to a heading level. */
export function Typography({ variant, as, className, style, children }: TypographyProps) {
  const { tag, className: base } = VARIANTS[variant]
  const Tag = as ?? tag
  return (
    <Tag className={cn(base, className)} style={style}>
      {children}
    </Tag>
  )
}

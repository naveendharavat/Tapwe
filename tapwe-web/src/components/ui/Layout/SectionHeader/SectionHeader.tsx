import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../../../lib/cn'
import { Typography } from '../../DataDisplay/Typography/Typography'

export interface SectionHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  titleAs?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: CSSProperties
}

/** Centred eyebrow, title and lead that open a section. */
export function SectionHeader({ eyebrow, title, lead, titleAs: Title = 'h2', className, style }: SectionHeaderProps) {
  return (
    <header className={cn('sh rv', className)} style={style}>
      {eyebrow && <Typography variant="eyebrow">{eyebrow}</Typography>}
      <Title>{title}</Title>
      {lead && <p>{lead}</p>}
    </header>
  )
}

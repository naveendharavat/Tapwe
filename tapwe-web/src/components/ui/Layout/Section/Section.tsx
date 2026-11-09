import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../../../lib/cn'
import { Container } from '../Container/Container'

export interface SectionProps {
  id?: string
  /** `alt` paints the white band with top and bottom borders. */
  tone?: 'default' | 'alt'
  /** `flush-top` drops the top padding; `page` is the tighter rhythm under a page header. */
  spacing?: 'default' | 'flush-top' | 'page'
  /** Wraps children in a `Container`; turn off for full-bleed content. */
  contained?: boolean
  containerClassName?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** A page band with the standard vertical rhythm. */
export function Section({ id, tone = 'default', spacing = 'default', contained = true, containerClassName, className, style, children }: SectionProps) {
  return (
    <section id={id} className={cn('s', tone === 'alt' && 'alt', spacing !== 'default' && `s--${spacing}`, className)} style={style}>
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  )
}

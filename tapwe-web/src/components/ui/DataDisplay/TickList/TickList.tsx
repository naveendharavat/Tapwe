import type { ReactNode } from 'react'
import { cn } from '../../../../lib/cn'
import { Icon } from '../Icon/Icon'

/** Bulleted list with a brand check mark per item. */
export function TickList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('ticks', className)}>
      {items.map((item, i) => (
        <li key={i}>
          <Icon name="check" />
          {item}
        </li>
      ))}
    </ul>
  )
}

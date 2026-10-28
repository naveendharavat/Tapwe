import type { ReactNode } from 'react'
import { cn } from '../../../../lib/cn'

/** Bordered, horizontally scrollable frame for a `<table>`. */
export function TableContainer({ children }: { children: ReactNode }) {
  return <div className="twrap">{children}</div>
}

/** One line of text inside a table cell; stack several for primary and secondary details. */
export function CellLine({ tone, strong, className, children }: { tone?: 'faint'; strong?: boolean; className?: string; children: ReactNode }) {
  return <span className={cn('cell-line', tone, strong && 'strong', className)}>{children}</span>
}

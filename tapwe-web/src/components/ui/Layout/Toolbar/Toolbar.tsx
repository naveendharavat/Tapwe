import type { ReactNode } from 'react'

/** Row above a list for filters and search; wraps on narrow screens. */
export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>
}

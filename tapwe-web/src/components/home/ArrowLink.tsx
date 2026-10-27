import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from '../ui/Icon'

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="alink" to={to}>
      {children} <Icon name="arrow" />
    </Link>
  )
}

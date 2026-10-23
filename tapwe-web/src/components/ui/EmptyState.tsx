import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'

interface EmptyStateProps {
  icon: IconName
  title: string
  description: ReactNode
  actions?: ReactNode
}

export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="ico">
        <Icon name={icon} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {actions && <div className="row">{actions}</div>}
    </div>
  )
}

export function Skeleton({ rows = 3, label }: { rows?: number; label: string }) {
  return (
    <div aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skel" />
      ))}
    </div>
  )
}

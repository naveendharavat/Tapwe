import type { ReactNode } from 'react'
import { Icon } from '../../DataDisplay/Icon/Icon'

/** Inline warning callout. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="note" role="note">
      <Icon name="info" />
      <span>{children}</span>
    </p>
  )
}

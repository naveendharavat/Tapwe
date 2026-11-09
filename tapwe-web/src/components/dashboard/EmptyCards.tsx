import type { ReactNode } from 'react'
import { EmptyState, LinkButton } from '../ui'

export function EmptyCards({ extra }: { extra?: ReactNode }) {
  return (
    <EmptyState
      icon="card"
      title="No cards yet"
      description="Request your first card. We configure it and deliver it ready to use."
      actions={
        <>
          <LinkButton variant="p" to="/app/create">
            Request a Card
          </LinkButton>
          {extra}
        </>
      }
    />
  )
}

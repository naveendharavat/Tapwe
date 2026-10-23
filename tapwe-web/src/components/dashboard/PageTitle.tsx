import type { ReactNode } from 'react'
import { LinkButton } from '../ui/Button'
import { Icon } from '../ui/Icon'

interface PageTitleProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="ptitle">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export const RequestCardButton = () => (
  <LinkButton variant="p" to="/app/create">
    <Icon name="plus" />
    Request Card
  </LinkButton>
)

import type { ReactNode } from 'react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { Box, Icon, LinkButton } from '../ui'

interface PageTitleProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageTitle({ title, description, action }: PageTitleProps) {
  usePageMeta(title, description)
  return (
    <Box as="header" className="ptitle">
      <Box>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </Box>
      {action}
    </Box>
  )
}

export const RequestCardButton = () => (
  <LinkButton variant="p" to="/app/create">
    <Icon name="plus" />
    Request Card
  </LinkButton>
)

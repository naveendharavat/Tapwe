import { usePageMeta } from '../../hooks/usePageMeta'
import { Box, Container, Typography } from '../ui'

interface PageHeadProps {
  eyebrow: string
  title: string
  lead: string
}

export function PageHead({ eyebrow, title, lead }: PageHeadProps) {
  usePageMeta(title, lead)
  return (
    <Box as="header" className="pagehead">
      <Container>
        <Typography variant="eyebrow">{eyebrow}</Typography>
        <h1>{title}</h1>
        <p>{lead}</p>
      </Container>
    </Box>
  )
}

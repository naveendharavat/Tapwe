import { EmptyCards } from '../../../components/dashboard/EmptyCards'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { Badge, Box, Card, EmptyState, LinkButton, Skeleton, Stack, Typography } from '../../../components/ui'
import { useCards } from '../../../services/cards/cards.queries'
import { DESTINATION_LABELS } from '../../../services/cards/cards.types'

export default function Destinations() {
  const cards = useCards()

  const renderBody = () => {
    if (cards.isPending) return <Skeleton label="Loading destinations" />
    if (cards.isError) return <EmptyState icon="alert" title="We couldn’t load your cards" description="Check your connection and try again." />
    if (!cards.data.length) return <EmptyCards />
    return (
      <Stack gap={3}>
        {cards.data.map((card) => (
          <Card key={card.code} size="sm" className="row-card">
            <Box className="row-main">
              <b>{card.name}</b>
              <Typography variant="muted">{card.destinationLabel}</Typography>
            </Box>
            <Badge tone="brand">{DESTINATION_LABELS[card.destinationType]}</Badge>
          </Card>
        ))}
      </Stack>
    )
  }

  return (
    <>
      <PageTitle
        title="Destinations"
        description="Where each card sends people. To change one, request it from My Cards."
        action={
          <LinkButton variant="s" to="/app/cards">
            Go to My Cards
          </LinkButton>
        }
      />
      {renderBody()}
    </>
  )
}

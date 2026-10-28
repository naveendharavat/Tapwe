import { SmartCardPreview } from '../../../components/cards/SmartCardPreview'
import { CardsTable } from '../../../components/dashboard/CardsTable'
import { EmptyCards } from '../../../components/dashboard/EmptyCards'
import { PageTitle, RequestCardButton } from '../../../components/dashboard/PageTitle'
import { Box, Card, EmptyState, Icon, IconBox, type IconName, LinkButton, Skeleton, Typography } from '../../../components/ui'
import { useCards } from '../../../services/cards/cards.queries'

const RECENT_LIMIT = 5

export default function Overview() {
  const cards = useCards()
  const list = cards.data ?? []
  const stats: Array<[string, number, IconName]> = [
    ['Total cards', list.length, 'card'],
    ['Active', list.filter((c) => c.status === 'active').length, 'check'],
    ['Drafts', list.filter((c) => c.status === 'draft').length, 'edit'],
  ]

  return (
    <>
      <PageTitle title="Overview" description="A quick look at your cards." action={<RequestCardButton />} />
      <Box className="promo">
        <Box>
          <h2>Need another card?</h2>
          <p>Tell us what you need. Our team configures it, adds the link and QR code, and delivers it to you.</p>
          <LinkButton variant="w" to="/app/create">
            Request a Card <Icon name="arrow" />
          </LinkButton>
        </Box>
        <Box className="pm">
          <SmartCardPreview theme="insta" />
        </Box>
      </Box>
      <Box className="stats">
        {stats.map(([label, value, icon]) => (
          <Card key={label} size="sm">
            <IconBox name={icon} />
            <p>{label}</p>
            <b>{cards.isPending ? '–' : value}</b>
          </Card>
        ))}
      </Box>
      <Typography variant="heading-sm" className="dash-subtitle">
        Recent cards
      </Typography>
      {cards.isPending ? (
        <Skeleton label="Loading cards" />
      ) : cards.isError ? (
        <EmptyState icon="alert" title="We couldn’t load your cards" description="Check your connection and try again." />
      ) : list.length ? (
        <CardsTable cards={list.slice(0, RECENT_LIMIT)} />
      ) : (
        <EmptyCards />
      )}
    </>
  )
}

import { EmptyCards } from '../../components/dashboard/EmptyCards'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { Badge } from '../../components/ui/Badge'
import { LinkButton } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { useCards } from '../../services/cards/cards.queries'
import { DESTINATION_LABELS } from '../../services/cards/cards.types'

export default function Destinations() {
  const cards = useCards()

  const renderBody = () => {
    if (cards.isPending) return <Skeleton label="Loading destinations" />
    if (cards.isError) return <EmptyState icon="alert" title="We couldn’t load your cards" description="Check your connection and try again." />
    if (!cards.data.length) return <EmptyCards />
    return (
      <div className="stack">
        {cards.data.map((card) => (
          <div key={card.code} className="card row-card">
            <div style={{ minWidth: 0 }}>
              <b style={{ fontWeight: 500 }}>{card.name}</b>
              <p className="muted" style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.destinationLabel}
              </p>
            </div>
            <Badge tone="brand">{DESTINATION_LABELS[card.destinationType]}</Badge>
          </div>
        ))}
      </div>
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

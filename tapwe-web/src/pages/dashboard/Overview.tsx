import { SmartCardPreview } from '../../components/cards/SmartCardPreview'
import { CardsTable } from '../../components/dashboard/CardsTable'
import { EmptyCards } from '../../components/dashboard/EmptyCards'
import { PageTitle, RequestCardButton } from '../../components/dashboard/PageTitle'
import { LinkButton } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import type { IconName } from '../../components/ui/icons'
import { useCards } from '../../services/cards/cards.queries'

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
      <div className="promo">
        <div>
          <h2>Need another card?</h2>
          <p>Tell us what you need. Our team configures it, adds the link and QR code, and delivers it to you.</p>
          <LinkButton variant="w" to="/app/create">
            Request a Card <Icon name="arrow" />
          </LinkButton>
        </div>
        <div className="pm">
          <SmartCardPreview theme="insta" />
        </div>
      </div>
      <div className="stats">
        {stats.map(([label, value, icon]) => (
          <div key={label} className="card">
            <span className="ico">
              <Icon name={icon} />
            </span>
            <p>{label}</p>
            <b>{cards.isPending ? '–' : value}</b>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 18, margin: '40px 0 16px' }}>Recent cards</h2>
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

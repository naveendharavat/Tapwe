import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import type { IconName } from '../../components/ui/icons'
import { shortDate } from '../../lib/dates'
import { useAdminCards, useCardRequests, useChangeRequests } from '../../services/admin/admin.queries'

const RECENT_LIMIT = 5

export default function AdminOverview() {
  const cards = useAdminCards()
  const cardRequests = useCardRequests()
  const changeRequests = useChangeRequests()

  const newRequests = cardRequests.data?.filter((r) => r.status === 'new') ?? []
  const openChanges = changeRequests.data?.filter((r) => r.status === 'open') ?? []
  const allCards = cards.data ?? []
  const stats: Array<[label: string, value: number, icon: IconName, loading: boolean]> = [
    ['New card requests', newRequests.length, 'pkg', cardRequests.isPending],
    ['Open change requests', openChanges.length, 'edit', changeRequests.isPending],
    ['Total cards', allCards.length, 'card', cards.isPending],
    ['Active cards', allCards.filter((c) => c.status === 'active').length, 'check', cards.isPending],
  ]

  return (
    <>
      <PageTitle title="Overview" description="What needs your attention today." />
      <div className="stats four">
        {stats.map(([label, value, icon, loading]) => (
          <div key={label} className="card">
            <span className="ico">
              <Icon name={icon} />
            </span>
            <p>{label}</p>
            <b>{loading ? '–' : value}</b>
          </div>
        ))}
      </div>

      <Section title="New card requests" to="/admin/card-requests" isPending={cardRequests.isPending} isError={cardRequests.isError}>
        {newRequests.length ? (
          <ul className="alist">
            {newRequests.slice(0, RECENT_LIMIT).map((r) => (
              <li key={r.id}>
                <b>{r.businessName}</b>
                <span className="faint">
                  {r.destinations.join(', ')} · {shortDate(r.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="pkg" title="No new requests" description="New requests from the website show up here." />
        )}
      </Section>

      <Section title="Open change requests" to="/admin/change-requests" isPending={changeRequests.isPending} isError={changeRequests.isError}>
        {openChanges.length ? (
          <ul className="alist">
            {openChanges.slice(0, RECENT_LIMIT).map((r) => (
              <li key={r.id}>
                <b>{r.cardName ?? r.cardCode}</b>
                <span className="faint">
                  {r.message} · {shortDate(r.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="check" title="Nothing waiting" description="Customers’ requests to change a card show up here." />
        )}
      </Section>
    </>
  )
}

interface SectionProps {
  title: string
  to: string
  isPending: boolean
  isError: boolean
  children: ReactNode
}

function Section({ title, to, isPending, isError, children }: SectionProps) {
  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>{title}</h2>
        <Link to={to}>View all</Link>
      </div>
      {isPending ? (
        <Skeleton label={`Loading ${title.toLowerCase()}`} />
      ) : isError ? (
        <EmptyState icon="alert" title="We couldn’t load this" description="Check your connection and refresh the page." />
      ) : (
        children
      )}
    </section>
  )
}

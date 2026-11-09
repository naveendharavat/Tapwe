import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { Box, Card, EmptyState, IconBox, type IconName, Skeleton, Stack, Typography } from '../../../components/ui'
import { shortDate } from '../../../lib/dates'
import { useAdminCards, useCardRequests, useChangeRequests } from '../../../services/admin/admin.queries'

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
      <Box className="stats four">
        {stats.map(([label, value, icon, loading]) => (
          <Card key={label} size="sm">
            <IconBox name={icon} />
            <p>{label}</p>
            <b>{loading ? '–' : value}</b>
          </Card>
        ))}
      </Box>

      <RecentBlock title="New card requests" to="/admin/card-requests" isPending={cardRequests.isPending} isError={cardRequests.isError}>
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
      </RecentBlock>

      <RecentBlock title="Open change requests" to="/admin/change-requests" isPending={changeRequests.isPending} isError={changeRequests.isError}>
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
      </RecentBlock>
    </>
  )
}

interface RecentBlockProps {
  title: string
  to: string
  isPending: boolean
  isError: boolean
  children: ReactNode
}

function RecentBlock({ title, to, isPending, isError, children }: RecentBlockProps) {
  return (
    <section className="admin-block">
      <Stack direction="row" justify="space-between" align="baseline" gap={0} className="admin-block-head">
        <Typography variant="heading-sm">{title}</Typography>
        <Link to={to}>View all</Link>
      </Stack>
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

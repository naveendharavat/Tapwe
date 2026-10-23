import { useState } from 'react'
import { CardsTable } from '../../components/dashboard/CardsTable'
import { EmptyCards } from '../../components/dashboard/EmptyCards'
import { PageTitle, RequestCardButton } from '../../components/dashboard/PageTitle'
import { Button } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { Tabs } from '../../components/ui/Tabs'
import { useCards } from '../../services/cards/cards.queries'
import type { CardStatus } from '../../services/cards/cards.types'

type Filter = 'all' | CardStatus
const FILTERS: Array<[Filter, string]> = [
  ['all', 'all'],
  ['active', 'active'],
  ['draft', 'draft'],
  ['paused', 'paused'],
]

export default function MyCards() {
  const [filter, setFilter] = useState<Filter>('all')
  const cards = useCards()

  const renderBody = () => {
    if (cards.isPending) return <Skeleton label="Loading cards" />
    if (cards.isError) {
      return (
        <EmptyState
          icon="alert"
          title="We couldn’t load your cards"
          description="Check your connection and try again."
          actions={
            <Button variant="s" onClick={() => void cards.refetch()} loading={cards.isFetching}>
              <Icon name="refresh" />
              Try again
            </Button>
          }
        />
      )
    }
    if (!cards.data.length) return <EmptyCards />
    const visible = filter === 'all' ? cards.data : cards.data.filter((c) => c.status === filter)
    if (!visible.length) return <EmptyState icon="card" title={`No ${filter} cards`} description="Try a different filter." />
    return <CardsTable cards={visible} />
  }

  return (
    <>
      <PageTitle title="My Cards" description="Every card, its permanent ID, and where it points." action={<RequestCardButton />} />
      <Tabs label="Filter cards by status" tabs={FILTERS} value={filter} onChange={setFilter} />
      {renderBody()}
    </>
  )
}

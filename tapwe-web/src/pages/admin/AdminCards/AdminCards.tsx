import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { CardFormDialog } from '../../../components/admin/CardFormDialog'
import { downloadQrSvg } from '../../../components/cards/downloadQr'
import { StatusBadge } from '../../../components/dashboard/CardsTable'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { useCopyCardUrl } from '../../../components/dashboard/useCopyCardUrl'
import { useToast } from '../../../components/toast/toast-context'
import { Badge, Button, CellLine, Dropdown, EmptyState, Icon, Input, Skeleton, TableContainer, Tabs, Toolbar } from '../../../components/ui'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { useAdminCards } from '../../../services/admin/admin.queries'
import type { AdminCard } from '../../../services/admin/admin.types'
import { DESTINATION_LABELS, type CardStatus } from '../../../services/cards/cards.types'

type Filter = 'all' | CardStatus
const FILTERS: Array<[Filter, string]> = [
  ['all', 'all'],
  ['active', 'active'],
  ['draft', 'draft'],
  ['paused', 'paused'],
]

/** `card: null` opens the dialog for a new card. */
type Editing = { card: AdminCard | null } | null

export default function AdminCards() {
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState(params.get('search') ?? '')
  const [editing, setEditing] = useState<Editing>(null)
  const term = useDebouncedValue(search.trim())
  const cards = useAdminCards({ status: filter === 'all' ? undefined : filter, search: term || undefined })

  const renderBody = () => {
    if (cards.isPending) return <Skeleton label="Loading cards" />
    if (cards.isError) {
      return (
        <EmptyState
          icon="alert"
          title="We couldn’t load the cards"
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
    if (!cards.data.length) {
      return filter === 'all' && !term ? (
        <EmptyState
          icon="card"
          title="No cards yet"
          description="Create the first card for a customer."
          actions={
            <Button variant="p" onClick={() => setEditing({ card: null })}>
              <Icon name="plus" />
              New card
            </Button>
          }
        />
      ) : (
        <EmptyState icon="card" title="No matching cards" description="Try a different filter or search." />
      )
    }
    return <AdminCardsTable cards={cards.data} onEdit={(card) => setEditing({ card })} />
  }

  return (
    <>
      <PageTitle
        title="Cards"
        description="Every card, who it belongs to, and where it opens."
        action={
          <Button variant="p" onClick={() => setEditing({ card: null })}>
            <Icon name="plus" />
            New card
          </Button>
        }
      />
      <Toolbar>
        <Tabs label="Filter cards by status" tabs={FILTERS} value={filter} onChange={setFilter} />
        <Input type="search" aria-label="Search cards" placeholder="Search name, card ID or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Toolbar>
      {renderBody()}
      <CardFormDialog open={!!editing} card={editing?.card} onClose={() => setEditing(null)} />
    </>
  )
}

function AdminCardsTable({ cards, onEdit }: { cards: AdminCard[]; onEdit: (card: AdminCard) => void }) {
  const { toast } = useToast()
  const copyUrl = useCopyCardUrl()

  const download = async (card: AdminCard) => {
    try {
      await downloadQrSvg(card.url, card.code)
      toast('QR code downloaded as SVG.')
    } catch {
      toast('Could not create the QR code. Please try again.', 'error')
    }
  }

  return (
    <TableContainer>
      <table>
        <caption className="sr">All cards</caption>
        <thead>
          <tr>
            <th scope="col">Card name</th>
            <th scope="col">Card ID</th>
            <th scope="col">Owner</th>
            <th scope="col">Status</th>
            <th scope="col">Opens</th>
            <th scope="col">
              <span className="sr">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.code}>
              <td className="strong">{card.name}</td>
              <td className="id">{card.code}</td>
              <td>
                {card.ownerEmail ? (
                  <>
                    <CellLine>{card.ownerEmail}</CellLine>
                    {!card.claimed && <Badge tone="warn">Not signed up</Badge>}
                  </>
                ) : (
                  <span className="faint">Unassigned</span>
                )}
              </td>
              <td>
                <StatusBadge status={card.status} />
              </td>
              <td className="dest">
                <CellLine>{DESTINATION_LABELS[card.destinationType]}</CellLine>
                {card.destinationUrl && <CellLine tone="faint">{card.destinationUrl}</CellLine>}
              </td>
              <td className="act">
                <Dropdown
                  trigger={(props) => (
                    <button type="button" className="btn icon btn-g" aria-label={`Actions for ${card.name}`} {...props}>
                      <Icon name="more" />
                    </button>
                  )}
                >
                  {(closeMenu) => (
                    <>
                      <button type="button" role="menuitem" onClick={() => (closeMenu(), onEdit(card))}>
                        <Icon name="edit" />
                        Edit card
                      </button>
                      <button type="button" role="menuitem" onClick={() => (closeMenu(), void copyUrl(card.url))}>
                        <Icon name="copy" />
                        Copy card URL
                      </button>
                      <button type="button" role="menuitem" onClick={() => (closeMenu(), void download(card))}>
                        <Icon name="dl" />
                        Download QR (SVG)
                      </button>
                      <a role="menuitem" href={card.url} target="_blank" rel="noreferrer" onClick={closeMenu}>
                        <Icon name="eye" />
                        Open card
                      </a>
                    </>
                  )}
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}

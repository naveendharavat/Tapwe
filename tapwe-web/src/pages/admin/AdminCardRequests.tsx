import { useState } from 'react'
import { CardFormDialog, type CardDraft } from '../../components/admin/CardFormDialog'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { useToast } from '../../components/toast/toast-context'
import { Button } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { Select } from '../../components/ui/Input'
import { Tabs } from '../../components/ui/Tabs'
import { shortDate } from '../../lib/dates'
import { useCardRequests, useUpdateCardRequestStatus } from '../../services/admin/admin.queries'
import { CARD_REQUEST_STATUS_LABELS, type CardRequest, type CardRequestStatus } from '../../services/admin/admin.types'
import { getErrorMessage } from '../../services/api'

type Filter = 'all' | CardRequestStatus
const FILTERS: Array<[Filter, string]> = [
  ['new', 'new'],
  ['contacted', 'contacted'],
  ['fulfilled', 'fulfilled'],
  ['all', 'all'],
]

export default function AdminCardRequests() {
  const [filter, setFilter] = useState<Filter>('new')
  const [draft, setDraft] = useState<CardDraft | null>(null)
  const requests = useCardRequests()

  const renderBody = () => {
    if (requests.isPending) return <Skeleton label="Loading card requests" />
    if (requests.isError) {
      return (
        <EmptyState
          icon="alert"
          title="We couldn’t load card requests"
          description="Check your connection and try again."
          actions={
            <Button variant="s" onClick={() => void requests.refetch()} loading={requests.isFetching}>
              <Icon name="refresh" />
              Try again
            </Button>
          }
        />
      )
    }
    const visible = filter === 'all' ? requests.data : requests.data.filter((r) => r.status === filter)
    if (!visible.length) {
      return <EmptyState icon="pkg" title={filter === 'all' ? 'No card requests yet' : `No ${filter} requests`} description="Requests from the website’s “Request a card” form show up here." />
    }
    return (
      <CardRequestsTable
        requests={visible}
        onCreateCard={(request) => setDraft({ name: request.businessName, ownerEmail: request.email })}
      />
    )
  }

  return (
    <>
      <PageTitle title="Card requests" description="People who asked for cards through the website. Contact them, then create their cards." />
      <Tabs label="Filter requests by status" tabs={FILTERS} value={filter} onChange={setFilter} />
      {renderBody()}
      <CardFormDialog open={!!draft} draft={draft ?? undefined} onClose={() => setDraft(null)} />
    </>
  )
}

function CardRequestsTable({ requests, onCreateCard }: { requests: CardRequest[]; onCreateCard: (request: CardRequest) => void }) {
  const { toast } = useToast()
  const updateStatus = useUpdateCardRequestStatus()

  const changeStatus = (request: CardRequest, status: CardRequestStatus) =>
    updateStatus.mutate(
      { id: request.id, status },
      {
        onSuccess: () => toast(`Marked as ${CARD_REQUEST_STATUS_LABELS[status].toLowerCase()}.`),
        onError: (error) => toast(getErrorMessage(error), 'error'),
      },
    )

  return (
    <div className="twrap">
      <table>
        <caption className="sr">Card requests</caption>
        <thead>
          <tr>
            <th scope="col">Business</th>
            <th scope="col">Contact</th>
            <th scope="col">Wants</th>
            <th scope="col">Received</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>
                <div style={{ fontWeight: 500 }}>{request.businessName}</div>
                <div className="faint">{request.name}</div>
              </td>
              <td>
                <div>{request.email}</div>
                <div className="faint">{request.phone}</div>
              </td>
              <td>
                <div>{request.destinations.join(', ')}</div>
                <div className="faint">
                  {request.businessType} · {request.quantity} {request.quantity === '1' ? 'card' : 'cards'}
                  {request.city && ` · ${request.city}`}
                </div>
                {request.note && <div className="faint">“{request.note}”</div>}
              </td>
              <td className="faint">{shortDate(request.createdAt)}</td>
              <td>
                <Select
                  aria-label={`Status for ${request.businessName}`}
                  value={request.status}
                  onChange={(e) => changeStatus(request, e.target.value as CardRequestStatus)}
                >
                  {Object.entries(CARD_REQUEST_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="act">
                <Button size="sm" onClick={() => onCreateCard(request)}>
                  <Icon name="plus" />
                  Create card
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

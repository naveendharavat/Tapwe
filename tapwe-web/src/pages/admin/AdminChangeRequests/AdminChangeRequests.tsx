import { useState } from 'react'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { useToast } from '../../../components/toast/toast-context'
import { Badge, Button, CellLine, EmptyState, Icon, LinkButton, Skeleton, Stack, TableContainer, Tabs } from '../../../components/ui'
import { shortDate } from '../../../lib/dates'
import { useChangeRequests, useUpdateChangeRequestStatus } from '../../../services/admin/admin.queries'
import type { ChangeRequest, ChangeRequestStatus } from '../../../services/admin/admin.types'
import { getErrorMessage } from '../../../services/supabase'

type Filter = 'all' | ChangeRequestStatus
const FILTERS: Array<[Filter, string]> = [
  ['open', 'open'],
  ['done', 'done'],
  ['all', 'all'],
]

export default function AdminChangeRequests() {
  const [filter, setFilter] = useState<Filter>('open')
  const requests = useChangeRequests()

  const renderBody = () => {
    if (requests.isPending) return <Skeleton label="Loading change requests" />
    if (requests.isError) {
      return (
        <EmptyState
          icon="alert"
          title="We couldn’t load change requests"
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
      return <EmptyState icon="check" title={filter === 'open' ? 'Nothing waiting' : 'No change requests'} description="When a customer asks to change where a card opens, it shows up here." />
    }
    return <ChangeRequestsTable requests={visible} />
  }

  return (
    <>
      <PageTitle title="Change requests" description="Customers asking to change where a card opens. Edit the card, then mark the request done." />
      <Tabs label="Filter change requests by status" tabs={FILTERS} value={filter} onChange={setFilter} />
      {renderBody()}
    </>
  )
}

function ChangeRequestsTable({ requests }: { requests: ChangeRequest[] }) {
  const { toast } = useToast()
  const updateStatus = useUpdateChangeRequestStatus()

  const setStatus = (request: ChangeRequest, status: ChangeRequestStatus) =>
    updateStatus.mutate(
      { id: request.id, status },
      {
        onSuccess: () => toast(status === 'done' ? 'Marked as done.' : 'Reopened.'),
        onError: (error) => toast(getErrorMessage(error), 'error'),
      },
    )

  return (
    <TableContainer>
      <table>
        <caption className="sr">Change requests</caption>
        <thead>
          <tr>
            <th scope="col">Card</th>
            <th scope="col">Request</th>
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
                <CellLine strong>{request.cardName ?? 'Deleted card'}</CellLine>
                <CellLine className="id">{request.cardCode}</CellLine>
              </td>
              <td>{request.message}</td>
              <td className="faint">{shortDate(request.createdAt)}</td>
              <td>
                <Badge tone={request.status === 'done' ? 'ok' : 'warn'}>{request.status === 'done' ? 'Done' : 'Open'}</Badge>
              </td>
              <td className="act">
                <Stack direction="row" gap={2} justify="flex-end">
                  <LinkButton size="sm" to={`/admin/cards?search=${request.cardCode}`}>
                    <Icon name="edit" />
                    Edit card
                  </LinkButton>
                  {request.status === 'open' ? (
                    <Button size="sm" variant="p" onClick={() => setStatus(request, 'done')}>
                      <Icon name="check" />
                      Mark done
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setStatus(request, 'open')}>
                      Reopen
                    </Button>
                  )}
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}

import { useState } from 'react'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { Badge, Button, EmptyState, Icon, Input, Skeleton, TableContainer, Toolbar, Typography } from '../../../components/ui'
import { mailHref, telHref, whatsappHref } from '../../../content/contact'
import { shortDate } from '../../../lib/dates'
import { useAdminUsers } from '../../../services/admin/admin.queries'
import type { AdminUser } from '../../../services/admin/admin.types'

const matches = (user: AdminUser, term: string) =>
  [user.name, user.email, user.businessName, user.phone].some((value) => value?.toLowerCase().includes(term))

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const users = useAdminUsers()
  const term = search.trim().toLowerCase()

  const renderBody = () => {
    if (users.isPending) return <Skeleton label="Loading users" />
    if (users.isError) {
      return (
        <EmptyState
          icon="alert"
          title="We couldn’t load users"
          description="Check your connection and try again."
          actions={
            <Button variant="s" onClick={() => void users.refetch()} loading={users.isFetching}>
              <Icon name="refresh" />
              Try again
            </Button>
          }
        />
      )
    }
    const visible = term ? users.data.filter((u) => matches(u, term)) : users.data
    if (!visible.length) {
      return <EmptyState icon="user" title={term ? 'No matching users' : 'No users yet'} description={term ? 'Try a different search.' : 'People who sign up on the website show up here.'} />
    }
    return <UsersTable users={visible} />
  }

  return (
    <>
      <PageTitle title="Users" description="Everyone with an account: who they are, how to reach them, and how many cards they have." />
      <Toolbar>
        <Typography variant="subtle" as="span" className="toolbar-note">
          {users.data ? `${users.data.length} ${users.data.length === 1 ? 'account' : 'accounts'}` : ''}
        </Typography>
        <Input type="search" aria-label="Search users" placeholder="Search name, email, business or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Toolbar>
      {renderBody()}
    </>
  )
}

function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <TableContainer>
      <table>
        <caption className="sr">Users</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Business</th>
            <th scope="col">Phone</th>
            <th scope="col">Role</th>
            <th scope="col">Cards</th>
            <th scope="col">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="strong">{user.name}</td>
              <td>
                <a href={mailHref(user.email)}>{user.email}</a>
              </td>
              <td>{user.businessName ?? <span className="faint">—</span>}</td>
              <td className="nowrap">
                {user.phone ? (
                  <>
                    <a href={telHref(user.phone)}>{user.phone}</a>
                    {' · '}
                    <a href={whatsappHref(user.phone)} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </>
                ) : (
                  <span className="faint">—</span>
                )}
              </td>
              <td>
                <Badge tone={user.role === 'admin' ? 'brand' : undefined}>{user.role === 'admin' ? 'Admin' : 'Customer'}</Badge>
              </td>
              <td>{user.cardCount}</td>
              <td className="faint nowrap">{shortDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  )
}

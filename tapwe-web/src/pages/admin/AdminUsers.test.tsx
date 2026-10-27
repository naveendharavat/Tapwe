import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import type { AdminUser } from '../../services/admin/admin.types'
import { api } from '../../services/api'
import { renderApp } from '../../test/render'
import AdminUsers from './AdminUsers'

const user = (over: Partial<AdminUser>): AdminUser => ({
  id: 5,
  name: 'Asha',
  email: 'asha@cafe.in',
  role: 'owner',
  businessName: 'Asha Café',
  phone: '9876543210',
  cardCount: 2,
  createdAt: '2026-10-24T10:00:00Z',
  ...over,
})

describe('Admin users', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('lists every account with its details', async () => {
    mock.onGet('/admin/users').reply(200, [
      user({}),
      user({ id: 1, name: 'Tapwe Admin', email: 'admin01@tapwe.in', role: 'admin', businessName: null, phone: null, cardCount: 0 }),
    ])
    renderApp(<AdminUsers />)

    const asha = (await screen.findByText('asha@cafe.in')).closest('tr')!
    expect(within(asha).getByText('Asha Café')).toBeInTheDocument()
    expect(within(asha).getByRole('link', { name: '9876543210' })).toHaveAttribute('href', 'tel:+919876543210')
    expect(within(asha).getByText('Customer')).toBeInTheDocument()
    expect(within(asha).getByText('2')).toBeInTheDocument()
    expect(within(screen.getByText('admin01@tapwe.in').closest('tr')!).getByText('Admin')).toBeInTheDocument()
  })

  it('searches by name, email, business or phone', async () => {
    mock.onGet('/admin/users').reply(200, [user({}), user({ id: 6, name: 'Ravi', email: 'ravi@salon.in', businessName: 'Ravi Salon', phone: '9123456780' })])
    renderApp(<AdminUsers />)
    await screen.findByText('asha@cafe.in')

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search users' }), '91234')
    expect(screen.queryByText('asha@cafe.in')).not.toBeInTheDocument()
    expect(screen.getByText('ravi@salon.in')).toBeInTheDocument()
  })
})

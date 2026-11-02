import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminService } from '../../services/admin/admin.service'
import type { CardRequest, ChangeRequest } from '../../services/admin/admin.types'
import { renderApp } from '../../test/render'
import AdminCardRequests from './AdminCardRequests/AdminCardRequests'
import AdminChangeRequests from './AdminChangeRequests/AdminChangeRequests'

const cardRequest: CardRequest = {
  id: 7,
  name: 'Asha',
  businessName: 'Asha Café',
  email: 'asha@cafe.in',
  phone: '9876543210',
  businessType: 'Restaurant or café',
  quantity: '2 to 5',
  destinations: ['Menu', 'Feedback form'],
  city: 'Hyderabad',
  note: null,
  agreed: true,
  status: 'new',
  createdAt: '2026-10-23T00:00:00Z',
}

const changeRequest: ChangeRequest = {
  id: 3,
  cardCode: 'k9f2xq',
  cardName: 'Table menu',
  message: 'Point it to our new menu',
  status: 'open',
  createdAt: '2026-10-23T00:00:00Z',
}

describe('Admin requests', () => {
  it('shows a card request and moves it to contacted', async () => {
    vi.spyOn(AdminService, 'listCardRequests').mockResolvedValue([cardRequest])
    const update = vi.spyOn(AdminService, 'updateCardRequestStatus').mockResolvedValue({ ...cardRequest, status: 'contacted' })
    renderApp(<AdminCardRequests />)

    const row = (await screen.findByText('Asha Café')).closest('tr')!
    expect(within(row).getByText('9876543210')).toBeInTheDocument()
    expect(within(row).getByText('Menu, Feedback form')).toBeInTheDocument()

    await userEvent.selectOptions(within(row).getByLabelText('Status for Asha Café'), 'contacted')
    await vi.waitFor(() => expect(update).toHaveBeenCalledExactlyOnceWith(7, 'contacted'))
  })

  it('marks an open change request as done', async () => {
    vi.spyOn(AdminService, 'listChangeRequests').mockResolvedValue([changeRequest])
    const update = vi.spyOn(AdminService, 'updateChangeRequestStatus').mockResolvedValue({ ...changeRequest, status: 'done' })
    renderApp(<AdminChangeRequests />)

    const row = (await screen.findByText('Point it to our new menu')).closest('tr')!
    expect(within(row).getByText('Table menu')).toBeInTheDocument()
    await userEvent.click(within(row).getByRole('button', { name: 'Mark done' }))

    await vi.waitFor(() => expect(update).toHaveBeenCalledExactlyOnceWith(3, 'done'))
  })
})

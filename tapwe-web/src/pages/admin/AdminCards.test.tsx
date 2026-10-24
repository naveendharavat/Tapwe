import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import type { AdminCard } from '../../services/admin/admin.types'
import { api } from '../../services/api'
import { renderApp } from '../../test/render'
import AdminCards from './AdminCards'

const card = (over: Partial<AdminCard>): AdminCard => ({
  code: 'k9f2xq',
  name: 'Table menu',
  ownerEmail: 'owner@cafe.in',
  claimed: true,
  status: 'active',
  destinationType: 'menu',
  destinationUrl: 'https://cafe.in/menu',
  url: 'http://localhost:5173/c/k9f2xq',
  createdAt: '2026-10-23T00:00:00Z',
  updatedAt: '2026-10-23T00:00:00Z',
  ...over,
})

describe('Admin cards', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('lists every card with its owner and whether they have signed up', async () => {
    mock.onGet('/admin/cards').reply(200, [
      card({}),
      card({ code: 'ab12cd', name: 'Salon desk', ownerEmail: 'new@salon.in', claimed: false, status: 'draft', destinationType: 'profile', destinationUrl: null }),
      card({ code: 'zz11yy', name: 'Spare', ownerEmail: null, claimed: false }),
    ])
    renderApp(<AdminCards />)

    const table = await screen.findByRole('table')
    const salon = within(table).getByText('Salon desk').closest('tr')!
    expect(within(salon).getByText('new@salon.in')).toBeInTheDocument()
    expect(within(salon).getByText('Not signed up')).toBeInTheDocument()
    expect(within(within(table).getByText('Spare').closest('tr')!).getByText('Unassigned')).toBeInTheDocument()
  })

  it('sends the status tab and search text to the server', async () => {
    mock.onGet('/admin/cards').reply(200, [card({})])
    renderApp(<AdminCards />)
    await screen.findByText('Table menu')

    await userEvent.click(screen.getByRole('tab', { name: 'paused' }))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search cards' }), 'cafe')

    await vi.waitFor(() => expect(mock.history.get.at(-1)?.params).toEqual({ status: 'paused', search: 'cafe' }))
  })

  it('requires a link for non-profile cards, then creates the card', async () => {
    mock.onGet('/admin/cards').reply(200, [])
    mock.onPost('/admin/cards').reply(201, card({ code: 'n3w111', name: 'Feedback' }))
    renderApp(<AdminCards />)

    await userEvent.click(await screen.findByRole('button', { name: /New card/ }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText(/Card name/), 'Feedback')
    await userEvent.type(within(dialog).getByLabelText(/Owner email/), 'Owner@Cafe.in')
    await userEvent.selectOptions(within(dialog).getByLabelText(/Opens/), 'form')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Create card' }))
    expect(await within(dialog).findByText('Enter a full link starting with https://')).toBeInTheDocument()
    expect(mock.history.post).toHaveLength(0)

    await userEvent.type(within(dialog).getByLabelText(/Link/), 'https://forms.cafe.in')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Create card' }))

    await vi.waitFor(() => expect(mock.history.post).toHaveLength(1))
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      name: 'Feedback',
      ownerEmail: 'Owner@Cafe.in',
      status: 'draft',
      destinationType: 'form',
      destinationUrl: 'https://forms.cafe.in',
    })
  })

  it('edits a card with its current values filled in', async () => {
    mock.onGet('/admin/cards').reply(200, [card({})])
    mock.onPatch('/admin/cards/k9f2xq').reply(200, card({ status: 'paused' }))
    renderApp(<AdminCards />)

    await userEvent.click(await screen.findByRole('button', { name: 'Actions for Table menu' }))
    await userEvent.click(screen.getByRole('menuitem', { name: /Edit card/ }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByLabelText(/Link/)).toHaveValue('https://cafe.in/menu')

    await userEvent.selectOptions(within(dialog).getByLabelText(/Status/), 'paused')
    await userEvent.selectOptions(within(dialog).getByLabelText(/Opens/), 'profile')
    await userEvent.clear(within(dialog).getByLabelText(/Owner email/))
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    await vi.waitFor(() => expect(mock.history.patch).toHaveLength(1))
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({
      name: 'Table menu',
      ownerEmail: null,
      status: 'paused',
      destinationType: 'profile',
      destinationUrl: null,
    })
  })
})

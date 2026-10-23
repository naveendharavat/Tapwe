import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../services/api'
import type { Card } from '../../services/cards/cards.types'
import { renderApp } from '../../test/render'
import MyCards from './MyCards'

const card = (over: Partial<Card>): Card => ({
  code: 'ab12cd',
  name: 'Front desk card',
  status: 'active',
  destinationType: 'profile',
  destinationUrl: null,
  destinationLabel: 'Profile: Your Business',
  url: 'http://localhost:5173/c/ab12cd',
  createdAt: '2026-10-23T00:00:00Z',
  ...over,
})

describe('My Cards', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('shows the error state with a retry when cards fail to load', async () => {
    mock.onGet('/cards').replyOnce(500).onGet('/cards').reply(200, [card({})])
    renderApp(<MyCards />)
    expect(await screen.findByText('We couldn’t load your cards')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Try again/ }))
    expect(await screen.findByText('Front desk card')).toBeInTheDocument()
  })

  it('shows the empty state when there are no cards', async () => {
    mock.onGet('/cards').reply(200, [])
    renderApp(<MyCards />)
    expect(await screen.findByText('No cards yet')).toBeInTheDocument()
  })

  it('filters by status tab', async () => {
    mock.onGet('/cards').reply(200, [card({}), card({ code: 'm4t8zr', name: 'Feedback card', status: 'draft' })])
    renderApp(<MyCards />)
    await screen.findByText('Front desk card')

    await userEvent.click(screen.getByRole('tab', { name: 'draft' }))
    const table = screen.getByRole('table')
    expect(within(table).queryByText('Front desk card')).not.toBeInTheDocument()
    expect(within(table).getByText('Feedback card')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: 'paused' }))
    expect(screen.getByText('No paused cards')).toBeInTheDocument()
  })

  it('deletes a card after confirming', async () => {
    mock.onGet('/cards').replyOnce(200, [card({})]).onGet('/cards').reply(200, [])
    mock.onDelete('/cards/ab12cd').reply(204)
    renderApp(<MyCards />)

    await userEvent.click(await screen.findByRole('button', { name: 'Actions for Front desk card' }))
    await userEvent.click(screen.getByRole('menuitem', { name: /Delete card/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Delete card' }))

    expect(await screen.findByText('No cards yet')).toBeInTheDocument()
    expect(mock.history.delete).toHaveLength(1)
  })
})

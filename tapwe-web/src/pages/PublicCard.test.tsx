import { screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { Route, Routes } from 'react-router'
import { api } from '../services/api'
import { renderApp } from '../test/render'
import PublicCard from './PublicCard'

const renderCard = (code: string) =>
  renderApp(
    <Routes>
      <Route path="/c/:code" element={<PublicCard />} />
    </Routes>,
    { route: `/c/${code}` },
  )

describe('Public card page', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('shows the business profile and hides actions for missing fields', async () => {
    mock.onGet('/public/cards/ab12cd').reply(200, {
      state: 'profile',
      profile: { businessName: 'Blue Tokai Café', description: 'Open until 10 pm', phone: null, website: 'https://cafe.in' },
    })
    renderCard('ab12cd')

    expect(await screen.findByRole('heading', { name: 'Blue Tokai Café' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Call/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Website/ })).toHaveAttribute('href', 'https://cafe.in')
    expect(screen.getByRole('button', { name: /Save contact/ })).toBeInTheDocument()
  })

  it('shows a call action when a phone is set', async () => {
    mock.onGet('/public/cards/ab12cd').reply(200, {
      state: 'profile',
      profile: { businessName: 'Shop', description: null, phone: '9876543210', website: null },
    })
    renderCard('ab12cd')
    expect(await screen.findByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+919876543210')
  })

  it('explains an inactive card', async () => {
    mock.onGet('/public/cards/m4t8zr').reply(200, { state: 'inactive' })
    renderCard('m4t8zr')
    expect(await screen.findByText('This card isn’t active yet')).toBeInTheDocument()
  })

  it('shows card not found for an unknown code', async () => {
    mock.onGet('/public/cards/zzzzzz').reply(404, { message: 'Card not found.' })
    renderCard('zzzzzz')
    expect(await screen.findByText('Card not found')).toBeInTheDocument()
  })

  it('redirects a link card', async () => {
    const replace = vi.fn()
    vi.stubGlobal('location', { ...window.location, replace })
    mock.onGet('/public/cards/k9f2xq').reply(200, { state: 'redirect', url: 'https://example.com/menu' })
    renderCard('k9f2xq')
    expect(await screen.findByText(/Opening/)).toBeInTheDocument()
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('https://example.com/menu'))
    vi.unstubAllGlobals()
  })
})

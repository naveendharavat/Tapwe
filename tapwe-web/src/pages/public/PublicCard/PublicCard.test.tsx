import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { PublicCardsService } from '../../../services/public/public.service'
import { renderApp } from '../../../test/render'
import PublicCard from './PublicCard'

const renderCard = (code: string) =>
  renderApp(
    <Routes>
      <Route path="/c/:code" element={<PublicCard />} />
    </Routes>,
    { route: `/c/${code}` },
  )

describe('Public card page', () => {
  it('shows the business profile and hides actions for missing fields', async () => {
    vi.spyOn(PublicCardsService, 'resolve').mockResolvedValue({
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
    vi.spyOn(PublicCardsService, 'resolve').mockResolvedValue({
      state: 'profile',
      profile: { businessName: 'Shop', description: null, phone: '9876543210', website: null },
    })
    renderCard('ab12cd')
    expect(await screen.findByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+919876543210')
  })

  it('explains an inactive card', async () => {
    vi.spyOn(PublicCardsService, 'resolve').mockResolvedValue({ state: 'inactive' })
    renderCard('m4t8zr')
    expect(await screen.findByText('This card isn’t active yet')).toBeInTheDocument()
  })

  it('shows card not found for an unknown code', async () => {
    vi.spyOn(PublicCardsService, 'resolve').mockResolvedValue({ state: 'not-found' })
    renderCard('zzzzzz')
    expect(await screen.findByText('Card not found')).toBeInTheDocument()
  })

  it('redirects a link card', async () => {
    const replace = vi.fn()
    vi.stubGlobal('location', { ...window.location, replace })
    vi.spyOn(PublicCardsService, 'resolve').mockResolvedValue({ state: 'redirect', url: 'https://example.com/menu' })
    renderCard('k9f2xq')
    expect(await screen.findByText(/Opening/)).toBeInTheDocument()
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('https://example.com/menu'))
    vi.unstubAllGlobals()
  })
})

import { render, screen } from '@testing-library/react'
import { QRCodePreview } from './QRCodePreview'
import { SmartCardPreview } from './SmartCardPreview'

describe('SmartCardPreview', () => {
  it('renders the menu theme heading', () => {
    render(<SmartCardPreview theme="menu" />)
    expect(screen.getByText('OUR')).toBeInTheDocument()
    expect(screen.getByText('MENU')).toBeInTheDocument()
    expect(screen.getByText('SCAN TO EXPLORE')).toBeInTheDocument()
  })

  it('labels the card for assistive tech', () => {
    render(<SmartCardPreview theme="review" />)
    expect(screen.getByRole('img', { name: /Leave us your review on Google/ })).toBeInTheDocument()
  })
})

describe('QRCodePreview', () => {
  it('renders a real QR code for a value', async () => {
    render(<QRCodePreview value="https://tapwe.in/c/ab12cd" />)
    const qr = await screen.findByRole('img', { name: 'QR code for https://tapwe.in/c/ab12cd' })
    expect(qr.querySelector('svg path')).not.toBeNull()
  })

  it('renders the decorative placeholder without a value', () => {
    render(<QRCodePreview seed="ab12cd" />)
    expect(screen.getByRole('img', { name: 'QR code preview (design placeholder)' })).toBeInTheDocument()
  })
})

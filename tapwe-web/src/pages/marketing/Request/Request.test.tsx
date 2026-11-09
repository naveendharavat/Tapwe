import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardRequestsService } from '../../../services/card-requests/card-requests.service'
import { renderApp } from '../../../test/render'
import Request from './Request'

describe('Request page', () => {
  it('shows design-copy errors and focuses the first invalid field on an empty submit', async () => {
    renderApp(<Request />)
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(await screen.findByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Choose at least one option.')).toBeInTheDocument()
    expect(screen.getByText('Please confirm to continue.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full name/)).toHaveFocus()
  })

  it('submits a valid request and shows the confirmation summary', async () => {
    const submit = vi.spyOn(CardRequestsService, 'submit').mockResolvedValue()
    renderApp(<Request />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Full name/), 'Asha Rao')
    await user.type(screen.getByLabelText(/Business name/), 'Blue Tokai Café')
    await user.type(screen.getByLabelText(/^Email/), 'asha@cafe.in')
    await user.type(screen.getByLabelText(/Phone or WhatsApp/), '98765 43210')
    await user.selectOptions(screen.getByLabelText(/Business type/), 'Restaurant or café')
    await user.click(screen.getByLabelText('Menu'))
    await user.click(screen.getByLabelText(/I agree to be contacted/))
    await user.click(screen.getByRole('button', { name: 'Send request' }))

    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument()
    expect(screen.getByText('Blue Tokai Café')).toBeInTheDocument()
    expect(submit.mock.calls[0][0]).toMatchObject({ phone: '9876543210', destinations: ['Menu'], agreed: true })
  })
})

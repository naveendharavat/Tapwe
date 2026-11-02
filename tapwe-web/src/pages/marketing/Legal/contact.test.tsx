import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Footer } from '../../../components/layout/Footer'
import { AuthService } from '../../../services/auth/auth.service'
import { renderApp } from '../../../test/render'
import Legal from './Legal'
import SignUp from '../../auth/SignUp/SignUp'

describe('Contact numbers', () => {
  it('shows both support numbers as tap-to-call links in the footer and on the support page', () => {
    renderApp(
      <>
        <Footer />
        <Legal page="support" />
      </>,
    )
    expect(screen.getAllByRole('link', { name: '+91 77949 28975' }).map((a) => a.getAttribute('href'))).toEqual(['tel:+917794928975', 'tel:+917794928975'])
    expect(screen.getAllByRole('link', { name: '+91 75699 60755' }).map((a) => a.getAttribute('href'))).toEqual(['tel:+917569960755', 'tel:+917569960755'])
  })
})

describe('Sign up while signed in', () => {
  it('says who is signed in and lets them sign out to create a new account', async () => {
    vi.spyOn(AuthService, 'me').mockResolvedValue({ id: 'u-4', name: 'Tapwe Admin', email: 'admin01@tapwe.in', role: 'admin' })
    vi.spyOn(AuthService, 'signOut').mockResolvedValue()
    renderApp(<SignUp />, { route: '/sign-up' })

    expect(await screen.findByText(/admin01@tapwe\.in/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(await screen.findByLabelText(/Full name/)).toBeInTheDocument()
  })
})

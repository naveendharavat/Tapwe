import { screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { Route, Routes } from 'react-router'
import { api } from '../services/api'
import { renderApp } from '../test/render'
import { RequireAuth } from './RequireAuth'
import { getToken, setToken } from './token'

const user = { id: 1, name: 'Demo User', email: 'demo@tapwe.in', role: 'owner' }

function Protected() {
  return (
    <Routes>
      <Route path="/sign-in" element={<p>Sign in page</p>} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <button onClick={() => api.get('/cards').catch(() => undefined)}>Load cards</button>
          </RequireAuth>
        }
      />
    </Routes>
  )
}

function RoleRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<p>Sign in page</p>} />
      <Route
        path="/app"
        element={
          <RequireAuth role="owner">
            <p>Owner dashboard</p>
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <p>Admin dashboard</p>
          </RequireAuth>
        }
      />
    </Routes>
  )
}

describe('RequireAuth', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('redirects to sign-in when there is no session', async () => {
    renderApp(<Protected />, { route: '/app' })
    expect(await screen.findByText('Sign in page')).toBeInTheDocument()
  })

  it('shows the page for a valid session, then redirects once the API says it expired', async () => {
    setToken('valid-then-expired')
    mock.onGet('/auth/me').reply(200, user)
    mock.onGet('/cards').reply(401, { message: 'Your session has expired. Please sign in again.' })

    renderApp(<Protected />, { route: '/app' })
    const button = await screen.findByRole('button', { name: 'Load cards' })
    button.click()

    expect(await screen.findByText('Sign in page')).toBeInTheDocument()
    expect(getToken()).toBeNull()
  })

  it('sends an owner who opens the admin area to their own dashboard', async () => {
    setToken('owner-token')
    mock.onGet('/auth/me').reply(200, user)
    renderApp(<RoleRoutes />, { route: '/admin' })
    expect(await screen.findByText('Owner dashboard')).toBeInTheDocument()
  })

  it('sends an admin who opens the owner dashboard to the admin area', async () => {
    setToken('admin-token')
    mock.onGet('/auth/me').reply(200, { ...user, role: 'admin' })
    renderApp(<RoleRoutes />, { route: '/app' })
    expect(await screen.findByText('Admin dashboard')).toBeInTheDocument()
  })
})

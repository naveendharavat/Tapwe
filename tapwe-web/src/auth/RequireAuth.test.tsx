import { act, screen } from '@testing-library/react'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { Route, Routes } from 'react-router'
import { AuthService } from '../services/auth/auth.service'
import type { User } from '../services/auth/auth.types'
import { supabase } from '../services/supabase'
import { renderApp } from '../test/render'
import { RequireAuth } from './RequireAuth'

const user: User = { id: 'u-1', name: 'Demo User', email: 'demo@tapwe.in', role: 'owner' }

function Protected() {
  return (
    <Routes>
      <Route path="/sign-in" element={<p>Sign in page</p>} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <p>Dashboard</p>
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

/** Captures the auth listener so a test can end the session the way Supabase would. */
function captureAuthEvents() {
  let listener: ((event: AuthChangeEvent) => void) | undefined
  vi.spyOn(supabase.auth, 'onAuthStateChange').mockImplementation((callback) => {
    listener = (event) => void callback(event, null)
    return { data: { subscription: { id: 'test', callback, unsubscribe: () => undefined } } }
  })
  return (event: AuthChangeEvent) => act(() => listener?.(event))
}

describe('RequireAuth', () => {
  it('redirects to sign-in when there is no session', async () => {
    vi.spyOn(AuthService, 'me').mockResolvedValue(null)
    renderApp(<Protected />, { route: '/app' })
    expect(await screen.findByText('Sign in page')).toBeInTheDocument()
  })

  it('shows the page for a valid session, then redirects once the session ends', async () => {
    vi.spyOn(AuthService, 'me').mockResolvedValue(user)
    const emit = captureAuthEvents()

    renderApp(<Protected />, { route: '/app' })
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()

    emit('SIGNED_OUT')
    expect(await screen.findByText('Sign in page')).toBeInTheDocument()
  })

  it('sends an owner who opens the admin area to their own dashboard', async () => {
    vi.spyOn(AuthService, 'me').mockResolvedValue(user)
    renderApp(<RoleRoutes />, { route: '/admin' })
    expect(await screen.findByText('Owner dashboard')).toBeInTheDocument()
  })

  it('sends an admin who opens the owner dashboard to the admin area', async () => {
    vi.spyOn(AuthService, 'me').mockResolvedValue({ ...user, role: 'admin' })
    renderApp(<RoleRoutes />, { route: '/app' })
    expect(await screen.findByText('Admin dashboard')).toBeInTheDocument()
  })
})

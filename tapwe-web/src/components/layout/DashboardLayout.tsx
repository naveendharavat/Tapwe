import { Suspense, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../auth/auth-context'
import { initials } from '../../lib/initials'
import { Dropdown } from '../ui/Dropdown'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { Logo } from '../ui/Logo'
import { Skeleton } from '../ui/EmptyState'

const NAV: Array<[to: string, label: string, icon: IconName]> = [
  ['/app', 'Overview', 'dash'],
  ['/app/cards', 'My Cards', 'card'],
  ['/app/create', 'Request a Card', 'plusc'],
  ['/app/qr', 'QR Code', 'qr'],
  ['/app/profile', 'Digital Profile', 'user'],
  ['/app/destinations', 'Destinations', 'link'],
  ['/app/analytics', 'Analytics', 'chart'],
  ['/app/settings', 'Account Settings', 'gear'],
]

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard">
      {NAV.map(([to, label, icon]) => (
        <NavLink key={to} to={to} end={to === '/app'} className={({ isActive }) => (isActive ? 'on' : '')} onClick={onNavigate}>
          <Icon name={icon} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="app page">
      <aside className="side">
        <Logo />
        <SideNav />
      </aside>
      <div className="apmain">
        <header className="atop">
          <button type="button" className="btn icon btn-g menu-btn" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}>
            <Icon name="burger" />
          </button>
          <span className="faint" style={{ fontSize: 14 }}>
            Dashboard
          </span>
          <Dropdown
            menuStyle={{ right: 0 }}
            trigger={(props) => (
              <button type="button" className="user" {...props}>
                <i>{initials(user?.name ?? '')}</i>
                {user?.name}
              </button>
            )}
          >
            {(close) => (
              <>
                <NavLink role="menuitem" to="/app/settings" onClick={close}>
                  <Icon name="gear" />
                  Account Settings
                </NavLink>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close()
                    signOut()
                    navigate('/', { replace: true })
                  }}
                >
                  <Icon name="logout" />
                  Sign out
                </button>
              </>
            )}
          </Dropdown>
        </header>

        <div className={`drawer ${drawerOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="sc" onClick={closeDrawer} />
          <div className="pn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Logo />
              <button type="button" className="btn icon btn-g" aria-label="Close navigation" onClick={closeDrawer}>
                <Icon name="x" />
              </button>
            </div>
            <div style={{ marginTop: 24 }}>
              <SideNav onNavigate={closeDrawer} />
            </div>
          </div>
        </div>

        <main className="acontent" id="main">
          <Suspense fallback={<Skeleton label="Loading page" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

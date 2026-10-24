import { Suspense, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../auth/auth-context'
import { initials } from '../../lib/initials'
import { Dropdown } from '../ui/Dropdown'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { Skeleton } from '../ui/EmptyState'
import type { NavItem } from './nav'

function SideNav({ nav, onNavigate }: { nav: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard">
      {nav.map(([to, label, icon], i) => (
        <NavLink key={to} to={to} end={i === 0} className={({ isActive }) => (isActive ? 'on' : '')} onClick={onNavigate}>
          <Icon name={icon} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

interface DashboardLayoutProps {
  nav: NavItem[]
  label: string
  settingsPath?: string
}

export function DashboardLayout({ nav, label, settingsPath }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="app page">
      <aside className="side">
        <Logo />
        <SideNav nav={nav} />
      </aside>
      <div className="apmain">
        <header className="atop">
          <button type="button" className="btn icon btn-g menu-btn" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}>
            <Icon name="burger" />
          </button>
          <span className="faint" style={{ fontSize: 14 }}>
            {label}
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
                {settingsPath && (
                  <NavLink role="menuitem" to={settingsPath} onClick={close}>
                    <Icon name="gear" />
                    Account Settings
                  </NavLink>
                )}
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
              <SideNav nav={nav} onNavigate={closeDrawer} />
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

import { Suspense, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../auth/auth-context'
import { initials } from '../../lib/initials'
import { Box, Dropdown, Icon, Logo, Skeleton, Stack } from '../ui'
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
    <Box className="app page">
      <aside className="side">
        <Logo />
        <SideNav nav={nav} />
      </aside>
      <Box className="apmain">
        <header className="atop">
          <button type="button" className="btn icon btn-g menu-btn" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}>
            <Icon name="burger" />
          </button>
          <span className="faint atop-label">{label}</span>
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

        <Box className={`drawer ${drawerOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
          <Box className="sc" onClick={closeDrawer} />
          <Box className="pn">
            <Stack direction="row" justify="space-between" align="center" gap={0}>
              <Logo />
              <button type="button" className="btn icon btn-g" aria-label="Close navigation" onClick={closeDrawer}>
                <Icon name="x" />
              </button>
            </Stack>
            <Box className="drawer-nav">
              <SideNav nav={nav} onNavigate={closeDrawer} />
            </Box>
          </Box>
        </Box>

        <main className="acontent" id="main">
          <Suspense fallback={<Skeleton label="Loading page" />}>
            <Outlet />
          </Suspense>
        </main>
      </Box>
    </Box>
  )
}

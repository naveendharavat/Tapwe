import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Box, Container, Icon, LinkButton, Logo } from '../ui'

const MARKETING_LINKS: Array<[label: string, to: string]> = [
  ['Home', '/'],
  ['Features', '/features'],
  ['How It Works', '/how-it-works'],
  ['Team', '/team'],
  ['Pricing', '/pricing'],
]

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="top">
      <Container>
        <Box className="bar">
          <Logo />
          <nav className="main" aria-label="Main">
            {MARKETING_LINKS.map(([label, to]) => (
              <Link key={to} to={to} className={to === pathname ? 'on' : ''}>
                {label}
              </Link>
            ))}
          </nav>
          <Box className="actions">
            <LinkButton variant="p" to="/request">
              Request a Card
            </LinkButton>
          </Box>
          <button
            type="button"
            className="burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'x' : 'burger'} />
          </button>
        </Box>
      </Container>
      <Box id="mnav" className={open ? 'open' : ''}>
        <nav aria-label="Mobile">
          {MARKETING_LINKS.map(([label, to]) => (
            <Link key={to} className="l" to={to} onClick={close}>
              {label}
            </Link>
          ))}
        </nav>
        <Box className="two">
          <LinkButton variant="p" size="lg" to="/request" onClick={close}>
            Request a Card
          </LinkButton>
        </Box>
      </Box>
    </header>
  )
}

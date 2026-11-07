import { useEffect, useRef, useState } from 'react'
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
  // The menu remembers the page it was opened on, so navigating anywhere closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const header = useRef<HTMLElement>(null)
  const burger = useRef<HTMLButtonElement>(null)
  const close = () => setOpenOn(null)

  // While the mobile menu is open: Escape and taps outside close it, and the page behind it stays put.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenOn(null)
      burger.current?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpenOn(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <header className="top" ref={header}>
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
            ref={burger}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpenOn(open ? null : pathname)}
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
      </Box>
    </header>
  )
}

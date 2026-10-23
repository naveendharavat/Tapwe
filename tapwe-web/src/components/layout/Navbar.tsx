import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { LinkButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

const MARKETING_LINKS: Array<[label: string, to: string]> = [
  ['Features', '/features'],
  ['How It Works', '/how-it-works'],
  ['Use Cases', '/#use-cases'],
  ['Pricing', '/pricing'],
  ['Request Card', '/request'],
]

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="top">
      <div className="wrap">
        <div className="bar">
          <Logo />
          <nav className="main" aria-label="Main">
            {MARKETING_LINKS.map(([label, to]) => (
              <Link key={to} to={to} className={to === pathname ? 'on' : ''}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="actions">
            <LinkButton variant="g" to="/sign-in">
              Sign In
            </LinkButton>
            <LinkButton variant="p" to="/sign-up">
              Get Started
            </LinkButton>
          </div>
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
        </div>
      </div>
      <div id="mnav" className={open ? 'open' : ''}>
        <nav aria-label="Mobile">
          {MARKETING_LINKS.map(([label, to]) => (
            <Link key={to} className="l" to={to} onClick={close}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="two">
          <LinkButton variant="s" size="lg" to="/sign-in" onClick={close}>
            Sign In
          </LinkButton>
          <LinkButton variant="p" size="lg" to="/sign-up" onClick={close}>
            Get Started
          </LinkButton>
        </div>
      </div>
    </header>
  )
}

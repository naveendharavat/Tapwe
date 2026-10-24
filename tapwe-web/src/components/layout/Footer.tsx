import { Link } from 'react-router'
import { Logo } from '../ui/Logo'

const COLUMNS: Array<[heading: string, links: Array<[label: string, to: string]>]> = [
  [
    'Product',
    [
      ['Features', '/features'],
      ['How It Works', '/how-it-works'],
      ['Pricing', '/pricing'],
      ['Request a Card', '/request'],
      ['Team', '/#team'],
      ['Dashboard', '/app'],
    ],
  ],
  [
    'Use cases',
    [
      ['Restaurants and cafés', '/#use-cases'],
      ['Retail stores', '/#use-cases'],
      ['Salons and clinics', '/#use-cases'],
      ['Professionals and creators', '/#use-cases'],
    ],
  ],
  [
    'Support',
    [
      ['Contact (coming soon)', '/support'],
      ['Privacy Policy', '/privacy'],
      ['Terms and Conditions', '/terms'],
    ],
  ],
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fgrid">
          <div style={{ maxWidth: 300 }}>
            <Logo />
            <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
              Smart NFC and QR cards that connect your business to the digital world with a simple tap.
            </p>
          </div>
          {COLUMNS.map(([heading, links]) => (
            <div key={heading}>
              <h3>{heading}</h3>
              <ul>
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="copy">© {YEAR} Tapwe. All rights reserved.</div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router'
import { Box, Container, Logo } from '../ui'
import { SupportPhones } from './SupportPhones'

const COLUMNS: Array<[heading: string, links: Array<[label: string, to: string]>]> = [
  [
    'Product',
    [
      ['Features', '/features'],
      ['How It Works', '/how-it-works'],
      ['Pricing', '/pricing'],
      ['Request a Card', '/request'],
      ['Team', '/team'],
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
      ['Contact us', '/support'],
      ['Privacy Policy', '/privacy'],
      ['Terms and Conditions', '/terms'],
    ],
  ],
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="foot">
      <Container>
        <Box className="fgrid">
          <Box className="fbrand">
            <Logo />
            <p className="muted">Smart NFC and QR cards that connect your business to the digital world with a simple tap.</p>
            <p className="muted">
              Questions? Call <SupportPhones />
            </p>
          </Box>
          {COLUMNS.map(([heading, links]) => (
            <Box key={heading}>
              <h3>{heading}</h3>
              <ul>
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
        <p className="copy">© {YEAR} Tapwe. All rights reserved.</p>
      </Container>
    </footer>
  )
}

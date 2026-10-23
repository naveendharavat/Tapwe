import type { CSSProperties, ReactNode } from 'react'
import { cssVars } from '../../lib/cssVars'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { QRCodePreview } from './QRCodePreview'

export type CardTheme = 'brand' | 'insta' | 'menu' | 'review'

const Wave = () => (
  <svg className="pc-wave" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 28C30 6 60 6 100 26s70 22 100 0v34H0z" fill="#fff" fillOpacity=".1" />
    <path d="M0 40C40 22 70 24 110 38s60 8 90-6v28H0z" fill="#fff" fillOpacity=".1" />
  </svg>
)

const LEAVES: Array<[number, number, number, number]> = [
  [18, 40, -30, 1], [40, 90, -60, 0.8], [10, 150, -20, 0.9], [30, 215, -50, 0.7],
  [170, 30, 200, 0.9], [186, 100, 230, 0.8], [165, 170, 205, 1], [182, 240, 235, 0.7],
]
const Leaves = () => (
  <svg className="pc-leaves" viewBox="0 0 200 320" aria-hidden="true">
    <g fill="#6f8f4e" opacity=".55">
      {LEAVES.map(([x, y, r, k]) => (
        <path key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} d="M0 0C14-18 34-18 46 0 34 18 14 18 0 0Z" />
      ))}
    </g>
  </svg>
)

const ChefHat = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 30v-2a8 8 0 0 1 2-15 9 9 0 0 1 16 0 8 8 0 0 1 2 15v2" />
    <path d="M14 30h20v8a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2zM20 34v2M24 34v2M28 34v2" />
  </svg>
)

const BrandBadge = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <path d="M9.5 11.5h13M16 11.5V22" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M20.5 18.2a4.2 4.2 0 0 1 2.4 3.8" stroke="#fff" strokeOpacity=".55" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
)

const NfcTap = () => (
  <svg className="pc-nfc" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="14" y="24" width="20" height="21" rx="4" />
    <path d="M20 30h8" />
    <path d="M17 17a10 10 0 0 1 14 0M12.5 12.5a16.5 16.5 0 0 1 23 0M8 8a23 23 0 0 1 32 0" />
  </svg>
)

const floatIcon = (name: IconName, style: CSSProperties) => (
  <i key={name} className="pc-ic" style={style}>
    <Icon name={name} />
  </i>
)

const THEMES: Record<CardTheme, { heading: string[]; badge: ReactNode; tap: string; decor: ReactNode }> = {
  brand: { heading: ['Tap or scan', 'to connect'], badge: <BrandBadge />, tap: 'TAP YOUR PHONE', decor: <Wave /> },
  insta: {
    heading: ['Follow us', 'on Instagram'],
    badge: <Icon name="at" />,
    tap: 'TAP YOUR PHONE',
    decor: (
      <>
        <Wave />
        {floatIcon('heart', cssVars({ '--r': '-12deg' }, { left: '9%', top: '27%' }))}
        {floatIcon('send', cssVars({ '--r': '14deg' }, { right: '8%', top: '30%' }))}
        {floatIcon('user', cssVars({ '--r': '8deg' }, { right: '12%', bottom: '26%' }))}
      </>
    ),
  },
  menu: { heading: ['OUR', 'MENU'], badge: <ChefHat />, tap: 'SCAN TO EXPLORE', decor: <Leaves /> },
  review: { heading: ['Leave us', 'your review', 'on Google'], badge: <Icon name="star" />, tap: 'TAP YOUR PHONE', decor: <Wave /> },
}

interface SmartCardPreviewProps {
  theme?: CardTheme
  /** Seed for the decorative QR, so each mock card looks different. */
  seed?: string
}

/** The printed Tapwe card mockup used across marketing pages. */
export function SmartCardPreview({ theme = 'brand', seed }: SmartCardPreviewProps) {
  const t = THEMES[theme]
  return (
    <div className={`pc pc-${theme}`} role="img" aria-label={`Tapwe smart card preview: ${t.heading.join(' ')}, with QR code and NFC tap`}>
      <div className="pc-d" aria-hidden="true">
        {t.decor}
      </div>
      <div className="pc-top">
        <span className="pc-badge">{t.badge}</span>
        <h4 className="pc-h">
          {t.heading.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h4>
      </div>
      <div className="pc-body">
        <div className="pc-qr">
          <QRCodePreview seed={seed ?? `ab12cd${theme}`} />
        </div>
      </div>
      <div className="pc-foot">
        <span className="pc-tap">{t.tap}</span>
        <NfcTap />
        <span className="pc-by">
          powered by <b>Tapwe</b>
        </span>
      </div>
    </div>
  )
}

/** The three-card fan from the design's showcase and request page. */
export function CardFan() {
  const fan: Array<[CardTheme, string]> = [
    ['insta', 'Social'],
    ['menu', 'Menu'],
    ['review', 'Reviews'],
  ]
  return (
    <div className="fan3">
      {fan.map(([theme, label], i) => (
        <figure key={theme} className={`f f${i + 1}`}>
          <SmartCardPreview theme={theme} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

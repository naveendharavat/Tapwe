import type { CSSProperties } from 'react'
import { Link } from 'react-router'

export function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#4a3fc4" />
      <path d="M9.5 11.5h13M16 11.5V22" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20.5 18.2a4.2 4.2 0 0 1 2.4 3.8" stroke="#fff" strokeOpacity=".55" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Logo({ to = '/', style }: { to?: string; style?: CSSProperties }) {
  return (
    <Link className="logo" to={to} aria-label="Tapwe home" style={style}>
      <BrandMark />
      <span>Tapwe</span>
    </Link>
  )
}

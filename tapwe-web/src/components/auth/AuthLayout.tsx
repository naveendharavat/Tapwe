import type { ReactNode } from 'react'
import { SmartCardPreview } from '../cards/SmartCardPreview'
import { Logo } from '../ui/Logo'

interface AuthLayoutProps {
  asideTitle: string
  asideText: string
  title: string
  subtitle: string
  footer: ReactNode
  children: ReactNode
}

/** The design's split auth screen: branded panel with floating cards, form on the right. */
export function AuthLayout({ asideTitle, asideText, title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="authw page">
      <aside className="authl">
        <Logo />
        <div>
          <h2>{asideTitle}</h2>
          <p>{asideText}</p>
          <div className="authv">
            <div className="a1">
              <SmartCardPreview theme="insta" />
            </div>
            <div className="a3">
              <SmartCardPreview theme="brand" />
            </div>
            <div className="a2">
              <SmartCardPreview theme="menu" />
            </div>
          </div>
        </div>
        <span className="faint" style={{ color: 'rgb(255 255 255/.55)', fontSize: 13 }}>
          One Tap. Endless Possibilities.
        </span>
      </aside>
      <div className="authr auth">
        <Logo />
        <div className="box">
          <h1>{title}</h1>
          <p className="sub">{subtitle}</p>
          {children}
          <p className="alt">{footer}</p>
        </div>
      </div>
    </div>
  )
}

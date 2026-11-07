import type { ReactNode } from 'react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { SmartCardPreview } from '../cards/SmartCardPreview'
import { Box, Logo } from '../ui'

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
  usePageMeta(title, subtitle)
  return (
    <Box className="authw page">
      <aside className="authl">
        <Logo />
        <Box>
          <h2>{asideTitle}</h2>
          <p>{asideText}</p>
          <Box className="authv">
            <Box className="a1">
              <SmartCardPreview theme="insta" />
            </Box>
            <Box className="a3">
              <SmartCardPreview theme="brand" />
            </Box>
            <Box className="a2">
              <SmartCardPreview theme="menu" />
            </Box>
          </Box>
        </Box>
        <span className="tagline">One Tap. Endless Possibilities.</span>
      </aside>
      <Box className="authr auth">
        <Logo />
        <Box className="box">
          <h1>{title}</h1>
          <p className="sub">{subtitle}</p>
          {children}
          <p className="alt">{footer}</p>
        </Box>
      </Box>
    </Box>
  )
}

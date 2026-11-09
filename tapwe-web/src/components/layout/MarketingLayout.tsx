import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Box } from '../ui'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function MarketingLayout() {
  const { pathname } = useLocation()
  return (
    <>
      <a href="#main" className="sr skip">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="page" key={pathname}>
        <Suspense fallback={<Box className="page-fallback" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

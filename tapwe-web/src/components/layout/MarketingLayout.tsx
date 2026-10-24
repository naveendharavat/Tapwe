import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
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
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

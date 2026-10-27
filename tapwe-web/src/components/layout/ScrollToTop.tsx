import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Scrolls to `#hash` targets (e.g. /#use-cases) or to the top on page change, like the design's router. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // Lazy pages mount a frame later; retry briefly until the anchor exists.
    let tries = 0
    const timer = window.setInterval(() => {
      const target = document.getElementById(hash.slice(1))
      if (target || ++tries > 20) {
        window.clearInterval(timer)
        target?.scrollIntoView()
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [pathname, hash])

  return null
}

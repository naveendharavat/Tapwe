import { useEffect } from 'react'

/** Fades `.rv` elements in as they scroll into view, as the design does; instant under reduced motion. */
export function useReveal(): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.rv:not(.in)'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || reduced) {
      elements.forEach((el) => el.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

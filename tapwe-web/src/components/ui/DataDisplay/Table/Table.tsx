import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../../../lib/cn'

/** Bordered, horizontally scrollable frame for a `<table>`; shades the edges that hide more columns. */
export function TableContainer({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => {
      const left = el.scrollLeft > 1
      const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }))
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={cn('twrap', edges.left && 'more-left', edges.right && 'more-right')}>
      <div className="tscroll" ref={scroller}>
        {children}
      </div>
    </div>
  )
}

/** One line of text inside a table cell; stack several for primary and secondary details. */
export function CellLine({ tone, strong, className, children }: { tone?: 'faint'; strong?: boolean; className?: string; children: ReactNode }) {
  return <span className={cn('cell-line', tone, strong && 'strong', className)}>{children}</span>
}

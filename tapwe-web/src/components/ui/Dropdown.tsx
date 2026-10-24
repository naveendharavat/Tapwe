import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface DropdownProps {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-haspopup': 'menu' }) => ReactNode
  menuStyle?: CSSProperties
  children: (close: () => void) => ReactNode
}

/** A trigger plus the design's `.menu` popover; closes on outside click and Escape. */
export function Dropdown({ trigger, menuStyle, children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)
  return (
    <div ref={root} style={{ position: 'relative', display: 'inline-block' }}>
      {trigger({ onClick: () => setOpen((o) => !o), 'aria-expanded': open, 'aria-haspopup': 'menu' })}
      {open && (
        <div className="menu" role="menu" style={{ top: 44, ...menuStyle }}>
          {children(close)}
        </div>
      )}
    </div>
  )
}

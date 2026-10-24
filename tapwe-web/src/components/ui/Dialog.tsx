import { useEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
}

/** Native `<dialog>` as in the design: focus trap, Escape and backdrop come from the browser. */
export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    if (!open && dialog.open) dialog.close?.()
  }, [open])

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title">
      {open && (
        <>
          <h2 id="dlg-title">{title}</h2>
          {description && <p>{description}</p>}
          {children}
        </>
      )}
    </dialog>
  )
}

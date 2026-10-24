import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../ui/Icon'
import { ToastContext, type ToastTone } from './toast-context'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

const TOAST_MS = 3600

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (message: string, tone: ToastTone = 'ok') => {
      const id = nextId.current++
      setToasts((all) => [...all, { id, message, tone }])
      window.setTimeout(() => dismiss(id), TOAST_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div id="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone === 'error' ? 'error' : ''}`} role="status">
            <Icon name={t.tone === 'ok' ? 'check' : 'alert'} />
            <span>{t.message}</span>
            <button
              type="button"
              className="btn icon btn-g sm"
              aria-label="Dismiss notification"
              style={{ width: 28, height: 28 }}
              onClick={() => dismiss(t.id)}
            >
              <Icon name="x" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

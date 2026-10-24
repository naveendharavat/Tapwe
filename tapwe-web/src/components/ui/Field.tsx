import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: ReactNode
  required?: boolean
  optional?: boolean
  hint?: ReactNode
  error?: string
  children: ReactNode
}

export const RequiredMark = () => (
  <>
    {' '}
    <span className="req" aria-hidden="true">
      *
    </span>
  </>
)

/** Label + control + hint/error, matching the design's `.field` block. */
export function Field({ id, label, required, optional, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <RequiredMark />}
        {optional && (
          <span className="faint" style={{ fontWeight: 400 }}>
            {' '}
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <div className="hint" id={`${id}-h`}>
          {hint}
        </div>
      )}
      <FieldError id={`${id}-e`} message={error} />
    </div>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <div className="err" id={id} role="alert">
      {message}
    </div>
  )
}

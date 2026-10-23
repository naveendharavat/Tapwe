import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

export type ButtonVariant = 'p' | 's' | 'g' | 'd' | 'w' | 'o'

interface CommonProps {
  variant?: ButtonVariant
  size?: 'sm' | 'lg'
  iconOnly?: boolean
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
  }

type LinkButtonProps = CommonProps & {
  to: string
  onClick?: () => void
}

function buttonClass({ variant = 's', size, iconOnly, className }: Omit<CommonProps, 'children'>): string {
  return ['btn', `btn-${variant}`, size, iconOnly && 'icon', className].filter(Boolean).join(' ')
}

export function Button({ variant, size, iconOnly, className, loading, disabled, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, iconOnly, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function LinkButton({ variant, size, iconOnly, className, to, onClick, children }: LinkButtonProps) {
  return (
    <Link to={to} onClick={onClick} className={buttonClass({ variant, size, iconOnly, className })}>
      {children}
    </Link>
  )
}

import type { InputHTMLAttributes, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../../../lib/cn'

type WithInvalid = { invalid?: boolean }
const cls = (invalid?: boolean, className?: string) => cn('input', invalid && 'bad', className)

export function Input({ invalid, className, ref, ...rest }: InputHTMLAttributes<HTMLInputElement> & WithInvalid & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} className={cls(invalid, className)} {...rest} />
}

export function Select({ invalid, className, ref, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & WithInvalid & { ref?: Ref<HTMLSelectElement> }) {
  return <select ref={ref} className={cls(invalid, className)} {...rest} />
}

export function Textarea({ invalid, className, ref, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & WithInvalid & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} className={cls(invalid, className)} {...rest} />
}

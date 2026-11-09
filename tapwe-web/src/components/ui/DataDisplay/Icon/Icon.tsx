import { ICON_PATHS, type IconName } from './icons'

interface IconProps {
  name: IconName
  className?: string
}

export function Icon({ name, className = '' }: IconProps) {
  return (
    <svg
      className={`i ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      // Static, trusted path data from icons.ts — never user input.
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  )
}

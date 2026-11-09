import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react'

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  ref?: Ref<HTMLElement>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Plain block element for a styled region that has no dedicated component. */
export function Box({ as: Tag = 'div', ...rest }: BoxProps) {
  return <Tag {...rest} />
}

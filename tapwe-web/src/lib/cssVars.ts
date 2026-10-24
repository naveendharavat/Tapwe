import type { CSSProperties } from 'react'

/** Inline style with CSS custom properties (e.g. `--d` reveal delay, `--r` rotation) the design relies on. */
export function cssVars(vars: Record<`--${string}`, string | number>, style: CSSProperties = {}): CSSProperties {
  return { ...style, ...vars } as CSSProperties
}

/** Staggers a `.rv` scroll-reveal by `seconds`. */
export const revealDelay = (seconds: number): CSSProperties => cssVars({ '--d': `${seconds}s` })

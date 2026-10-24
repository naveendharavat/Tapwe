/** Props that wire a control to its Field's error/hint for assistive tech. */
export function describedBy(id: string, error?: string, hint?: boolean) {
  return {
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? `${id}-e` : hint ? `${id}-h` : undefined,
  }
}

import type { CSSProperties } from 'react'

interface TabsProps<T extends string> {
  label: string
  tabs: ReadonlyArray<readonly [value: T, label: string]>
  value: T
  onChange: (value: T) => void
  style?: CSSProperties
}

export function Tabs<T extends string>({ label, tabs, value, onChange, style }: TabsProps<T>) {
  return (
    <div className="tabs" role="tablist" aria-label={label} style={style}>
      {tabs.map(([key, text]) => (
        <button key={key} type="button" role="tab" aria-selected={value === key} onClick={() => onChange(key)}>
          {text}
        </button>
      ))}
    </div>
  )
}

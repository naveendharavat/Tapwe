import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'

export function Pills({ items }: { items: Array<[IconName, string]> }) {
  return (
    <div className="pills rv">
      {items.map(([icon, label]) => (
        <span key={label}>
          <Icon name={icon} />
          {label}
        </span>
      ))}
    </div>
  )
}

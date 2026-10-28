import { cn } from '../../../../lib/cn'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/icons'

/** Icon on a soft brand tile. */
export function IconBox({ name, size = 'md', className }: { name: IconName; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span className={cn('ico', size === 'sm' && 'ico--sm', className)}>
      <Icon name={name} />
    </span>
  )
}

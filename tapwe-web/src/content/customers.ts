import type { IconName } from '../components/ui/icons'

export interface Customer {
  name: string
  /** What they use Tapwe for. */
  usage: string
  icon: IconName
  /** Logo URL; the tile shows initials when it is empty. */
  logo?: string
}

export const CUSTOMERS: Customer[] = [{ name: 'Sri Harsha Eye Hospital', usage: 'Google review cards', icon: 'star' }]

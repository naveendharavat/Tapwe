import type { IconName } from '../ui/icons'

export type NavItem = [to: string, label: string, icon: IconName]

export const OWNER_NAV: NavItem[] = [
  ['/app', 'Overview', 'dash'],
  ['/app/cards', 'My Cards', 'card'],
  ['/app/create', 'Request a Card', 'plusc'],
  ['/app/qr', 'QR Code', 'qr'],
  ['/app/profile', 'Digital Profile', 'user'],
  ['/app/destinations', 'Destinations', 'link'],
  ['/app/analytics', 'Analytics', 'chart'],
  ['/app/settings', 'Account Settings', 'gear'],
]

export const ADMIN_NAV: NavItem[] = [
  ['/admin', 'Overview', 'dash'],
  ['/admin/cards', 'Cards', 'card'],
  ['/admin/card-requests', 'Card requests', 'pkg'],
  ['/admin/change-requests', 'Change requests', 'edit'],
]

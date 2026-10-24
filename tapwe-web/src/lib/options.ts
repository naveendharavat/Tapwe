import type { IconName } from '../components/ui/icons'

export const BUSINESS_TYPES = [
  'Restaurant or café',
  'Hotel',
  'Retail shop',
  'Salon',
  'Clinic',
  'Freelancer or professional',
  'Creator',
  'Other',
] as const

export const CARD_QUANTITIES = ['1', '2 to 5', '6 to 10', '11 to 25', '26 to 50', 'More than 50'] as const

export const REQUEST_DESTINATIONS: ReadonlyArray<readonly [label: string, icon: IconName]> = [
  ['Menu', 'menu'],
  ['Social links', 'at'],
  ['Feedback form', 'star'],
  ['Business profile', 'user'],
  ['Website or link', 'globe'],
]

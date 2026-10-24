import type { IconName } from '../ui/icons'
import type { CardTheme } from '../cards/SmartCardPreview'

export type DemoKey = 'menu' | 'social' | 'feedback' | 'profile'

export const DEMO_TABS: Array<[key: DemoKey, label: string, icon: IconName, description: string]> = [
  ['menu', 'Menu', 'menu', 'Show your menu the moment a customer taps.'],
  ['social', 'Social', 'at', 'Send people to Instagram or any social page.'],
  ['feedback', 'Feedback', 'star', 'Open a feedback form while the visit is fresh.'],
  ['profile', 'Profile', 'user', 'Share contact details and links.'],
]

export const DEMO_THEME: Record<DemoKey, CardTheme> = {
  menu: 'menu',
  social: 'insta',
  feedback: 'review',
  profile: 'brand',
}


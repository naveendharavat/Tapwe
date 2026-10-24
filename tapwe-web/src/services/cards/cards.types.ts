export type CardStatus = 'draft' | 'active' | 'paused'
export type DestinationType = 'profile' | 'url' | 'menu' | 'form'

export interface Card {
  code: string
  name: string
  status: CardStatus
  destinationType: DestinationType
  destinationUrl: string | null
  destinationLabel: string
  url: string
  createdAt: string
}

export const DESTINATION_LABELS: Record<DestinationType, string> = {
  profile: 'Digital profile',
  url: 'Website or link',
  menu: 'Menu',
  form: 'Feedback form',
}

export const STATUS_LABELS: Record<CardStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  paused: 'Paused',
}

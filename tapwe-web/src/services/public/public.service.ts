import { api } from '../api'
import type { BusinessProfile } from '../profile/profile.types'

export type PublicCard =
  | { state: 'redirect'; url: string }
  | { state: 'profile'; profile: BusinessProfile }
  | { state: 'inactive' }

export class PublicCardsService {
  static async resolve(code: string): Promise<PublicCard> {
    const { data } = await api.get<PublicCard>(`/public/cards/${encodeURIComponent(code)}`)
    return data
  }
}

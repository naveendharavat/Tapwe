import type { BusinessProfile } from '../profile/profile.types'
import { supabase, unwrap } from '../supabase'

export type PublicCard =
  | { state: 'redirect'; url: string }
  | { state: 'profile'; profile: BusinessProfile }
  | { state: 'inactive' }
  | { state: 'not-found' }

export class PublicCardsService {
  /** Resolves what the card opens; a resolvable card also records a tap. */
  static async resolve(code: string): Promise<PublicCard> {
    return unwrap<PublicCard>(await supabase.rpc('resolve_card', { p_code: code, p_user_agent: navigator.userAgent }))
  }
}

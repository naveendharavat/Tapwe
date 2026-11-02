import { normalizePhone } from '../../lib/validation'
import { currentUserId, supabase, unwrap } from '../supabase'
import type { BusinessProfile } from './profile.types'

interface ProfileRow {
  business_name: string | null
  description: string | null
  phone: string | null
  website: string | null
}

const PROFILE_COLUMNS = 'business_name, description, phone, website'

const toProfile = (row: ProfileRow | null): BusinessProfile => ({
  businessName: row?.business_name ?? null,
  description: row?.description ?? null,
  phone: row?.phone ?? null,
  website: row?.website ?? null,
})

const trimToNull = (value: string | undefined) => value?.trim() || null

export class ProfileService {
  static async get(): Promise<BusinessProfile> {
    const userId = await currentUserId()
    const row = unwrap<ProfileRow | null>(await supabase.from('profiles').select(PROFILE_COLUMNS).eq('user_id', userId).maybeSingle())
    return toProfile(row)
  }

  /** Saves only the fields given; blank fields are cleared. */
  static async update(body: Partial<Record<keyof BusinessProfile, string>>): Promise<BusinessProfile> {
    const userId = await currentUserId()
    const changes: Partial<ProfileRow> = {}
    if ('businessName' in body) changes.business_name = trimToNull(body.businessName)
    if ('description' in body) changes.description = trimToNull(body.description)
    if ('phone' in body) changes.phone = trimToNull(body.phone) && normalizePhone(body.phone)
    if ('website' in body) changes.website = trimToNull(body.website)
    const row = unwrap<ProfileRow>(
      await supabase
        .from('profiles')
        .upsert({ user_id: userId, ...changes }, { onConflict: 'user_id' })
        .select(PROFILE_COLUMNS)
        .single(),
    )
    return toProfile(row)
  }
}

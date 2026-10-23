import { api } from '../api'
import type { BusinessProfile } from './profile.types'

export class ProfileService {
  static async get(): Promise<BusinessProfile> {
    const { data } = await api.get<BusinessProfile>('/profile')
    return data
  }

  static async update(body: Partial<Record<keyof BusinessProfile, string>>): Promise<BusinessProfile> {
    const { data } = await api.put<BusinessProfile>('/profile', body)
    return data
  }
}

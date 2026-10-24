import { Profile } from './entities/profile.entity.js';
import { ProfileFields } from './profiles.repository.js';

export type ProfileResponse = ProfileFields;

export function toProfileResponse(profile: Profile | null): ProfileResponse {
  return {
    businessName: profile?.businessName ?? null,
    description: profile?.description ?? null,
    phone: profile?.phone ?? null,
    website: profile?.website ?? null,
  };
}

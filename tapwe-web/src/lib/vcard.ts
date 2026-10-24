import type { BusinessProfile } from '../services/profile/profile.types'

const escape = (value: string) => value.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')

/** A vCard 3.0 contact for "Save contact" on the public profile page. */
export function profileVCard(profile: BusinessProfile): string {
  const name = profile.businessName || 'Business'
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escape(name)}`, `ORG:${escape(name)}`]
  if (profile.phone) lines.push(`TEL;TYPE=WORK,VOICE:+91${profile.phone}`)
  if (profile.website) lines.push(`URL:${profile.website}`)
  if (profile.description) lines.push(`NOTE:${escape(profile.description)}`)
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

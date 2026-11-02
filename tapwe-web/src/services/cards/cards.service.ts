import { currentUserId, cardUrl, supabase, unwrap } from '../supabase'
import type { Card, CardStatus, DestinationType } from './cards.types'

interface CardRow {
  code: string
  name: string
  status: CardStatus
  destination_type: DestinationType
  destination_url: string | null
  created_at: string
}

function destinationLabel(row: CardRow, businessName: string | null): string {
  if (row.destination_type !== 'profile') return row.destination_url ?? 'Not set yet'
  return businessName ? `Profile: ${businessName}` : 'Digital profile'
}

export class CardsService {
  static async list(): Promise<Card[]> {
    const userId = await currentUserId()
    const [cards, profile] = await Promise.all([
      supabase
        .from('cards')
        .select('code, name, status, destination_type, destination_url, created_at')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .order('code'),
      supabase.from('profiles').select('business_name').eq('user_id', userId).maybeSingle(),
    ])
    const businessName = unwrap<{ business_name: string | null } | null>(profile)?.business_name ?? null
    return unwrap<CardRow[]>(cards).map((row) => ({
      code: row.code,
      name: row.name,
      status: row.status,
      destinationType: row.destination_type,
      destinationUrl: row.destination_url,
      destinationLabel: destinationLabel(row, businessName),
      url: cardUrl(row.code),
      createdAt: row.created_at,
    }))
  }

  static async remove(code: string): Promise<void> {
    unwrap(await supabase.rpc('delete_my_card', { p_code: code }))
  }

  static async requestChange(code: string, message: string): Promise<void> {
    unwrap(await supabase.from('change_requests').insert({ card_code: code, message: message.trim() }))
  }
}

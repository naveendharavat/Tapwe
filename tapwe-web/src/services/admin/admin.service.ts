import type { UserRole } from '../auth/auth.types'
import type { CardStatus, DestinationType } from '../cards/cards.types'
import { cardUrl, supabase, unwrap } from '../supabase'
import type {
  AdminCard,
  AdminUser,
  CardFilter,
  CardInput,
  CardRequest,
  CardRequestStatus,
  ChangeRequest,
  ChangeRequestStatus,
} from './admin.types'

interface AdminCardRow {
  code: string
  name: string
  owner_email: string | null
  user_id: string | null
  status: CardStatus
  destination_type: DestinationType
  destination_url: string | null
  created_at: string
  updated_at: string
}

interface AdminUserRow {
  id: string
  name: string
  email: string
  role: UserRole
  business_name: string | null
  phone: string | null
  card_count: number
  created_at: string
}

interface CardRequestRow {
  id: number
  name: string
  business_name: string
  email: string
  phone: string
  business_type: string
  quantity: string
  destinations: string[]
  city: string | null
  note: string | null
  agreed: boolean
  status: CardRequestStatus
  created_at: string
}

interface ChangeRequestRow {
  id: number
  card_code: string
  message: string
  status: ChangeRequestStatus
  created_at: string
  cards: { name: string } | null
}

const CHANGE_REQUEST_COLUMNS = 'id, card_code, message, status, created_at, cards(name)'

const toAdminCard = (row: AdminCardRow): AdminCard => ({
  code: row.code,
  name: row.name,
  ownerEmail: row.owner_email,
  claimed: row.user_id !== null,
  status: row.status,
  destinationType: row.destination_type,
  destinationUrl: row.destination_url,
  url: cardUrl(row.code),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const toCardRow = (body: CardInput) => ({
  name: body.name,
  owner_email: body.ownerEmail,
  status: body.status,
  destination_type: body.destinationType,
  destination_url: body.destinationUrl,
})

const toAdminUser = (row: AdminUserRow): AdminUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  businessName: row.business_name,
  phone: row.phone,
  cardCount: row.card_count,
  createdAt: row.created_at,
})

const toCardRequest = (row: CardRequestRow): CardRequest => ({
  id: row.id,
  name: row.name,
  businessName: row.business_name,
  email: row.email,
  phone: row.phone,
  businessType: row.business_type,
  quantity: row.quantity,
  destinations: row.destinations,
  city: row.city,
  note: row.note,
  agreed: row.agreed,
  status: row.status,
  createdAt: row.created_at,
})

const toChangeRequest = (row: ChangeRequestRow): ChangeRequest => ({
  id: row.id,
  cardCode: row.card_code,
  cardName: row.cards?.name ?? null,
  message: row.message,
  status: row.status,
  createdAt: row.created_at,
})

export class AdminService {
  static async listCards(filter: CardFilter): Promise<AdminCard[]> {
    const rows = unwrap<AdminCardRow[]>(
      await supabase
        .rpc('search_cards', { p_status: filter.status ?? null, p_search: filter.search ?? null })
    )
    return rows.map(toAdminCard)
  }

  static async createCard(body: CardInput): Promise<AdminCard> {
    return toAdminCard(unwrap<AdminCardRow>(await supabase.from('cards').insert(toCardRow(body)).select().single()))
  }

  static async updateCard(code: string, body: CardInput): Promise<AdminCard> {
    return toAdminCard(unwrap<AdminCardRow>(await supabase.from('cards').update(toCardRow(body)).eq('code', code).select().single()))
  }

  static async listUsers(): Promise<AdminUser[]> {
    const rows = unwrap<AdminUserRow[]>(
      await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
    )
    return rows.map(toAdminUser)
  }

  static async listCardRequests(): Promise<CardRequest[]> {
    const rows = unwrap<CardRequestRow[]>(
      await supabase
        .from('card_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
    )
    return rows.map(toCardRequest)
  }

  static async updateCardRequestStatus(id: number, status: CardRequestStatus): Promise<CardRequest> {
    return toCardRequest(unwrap<CardRequestRow>(await supabase.from('card_requests').update({ status }).eq('id', id).select().single()))
  }

  static async listChangeRequests(): Promise<ChangeRequest[]> {
    const rows = unwrap<ChangeRequestRow[]>(
      await supabase
        .from('change_requests')
        .select(CHANGE_REQUEST_COLUMNS)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
    )
    return rows.map(toChangeRequest)
  }

  static async updateChangeRequestStatus(id: number, status: ChangeRequestStatus): Promise<ChangeRequest> {
    const row = unwrap<ChangeRequestRow>(
      await supabase.from('change_requests').update({ status }).eq('id', id).select(CHANGE_REQUEST_COLUMNS).single(),
    )
    return toChangeRequest(row)
  }
}

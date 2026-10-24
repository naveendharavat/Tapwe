import { api } from '../api'
import type {
  AdminCard,
  CardFilter,
  CardInput,
  CardRequest,
  CardRequestStatus,
  ChangeRequest,
  ChangeRequestStatus,
} from './admin.types'

export class AdminService {
  static async listCards(filter: CardFilter): Promise<AdminCard[]> {
    const { data } = await api.get<AdminCard[]>('/admin/cards', { params: filter })
    return data
  }

  static async createCard(body: CardInput): Promise<AdminCard> {
    const { data } = await api.post<AdminCard>('/admin/cards', body)
    return data
  }

  static async updateCard(code: string, body: CardInput): Promise<AdminCard> {
    const { data } = await api.patch<AdminCard>(`/admin/cards/${code}`, body)
    return data
  }

  static async listCardRequests(): Promise<CardRequest[]> {
    const { data } = await api.get<CardRequest[]>('/admin/card-requests')
    return data
  }

  static async updateCardRequestStatus(id: number, status: CardRequestStatus): Promise<CardRequest> {
    const { data } = await api.patch<CardRequest>(`/admin/card-requests/${id}`, { status })
    return data
  }

  static async listChangeRequests(): Promise<ChangeRequest[]> {
    const { data } = await api.get<ChangeRequest[]>('/admin/change-requests')
    return data
  }

  static async updateChangeRequestStatus(id: number, status: ChangeRequestStatus): Promise<ChangeRequest> {
    const { data } = await api.patch<ChangeRequest>(`/admin/change-requests/${id}`, { status })
    return data
  }
}

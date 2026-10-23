import { api } from '../api'
import type { CreateCardRequest } from './card-requests.types'

export class CardRequestsService {
  static async submit(body: CreateCardRequest): Promise<{ id: number }> {
    const { data } = await api.post<{ id: number }>('/card-requests', body)
    return data
  }
}

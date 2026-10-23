import { api } from '../api'
import type { Card } from './cards.types'

export class CardsService {
  static async list(): Promise<Card[]> {
    const { data } = await api.get<Card[]>('/cards')
    return data
  }

  static async remove(code: string): Promise<void> {
    await api.delete(`/cards/${code}`)
  }

  static async requestChange(code: string, message: string): Promise<void> {
    await api.post(`/cards/${code}/change-requests`, { message })
  }
}

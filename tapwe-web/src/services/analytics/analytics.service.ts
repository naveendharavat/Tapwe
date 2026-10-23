import { api } from '../api'
import type { AnalyticsSummary } from './analytics.types'

export class AnalyticsService {
  static async summary(): Promise<AnalyticsSummary> {
    const { data } = await api.get<AnalyticsSummary>('/analytics/summary')
    return data
  }
}

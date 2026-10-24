import { useQuery } from '@tanstack/react-query'
import { AnalyticsService } from './analytics.service'

export const analyticsKeys = {
  summary: ['analytics', 'summary'] as const,
}

export function useAnalyticsSummary() {
  return useQuery({ queryKey: analyticsKeys.summary, queryFn: AnalyticsService.summary })
}

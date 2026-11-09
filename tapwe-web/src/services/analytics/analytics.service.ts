import { supabase, unwrap } from '../supabase'
import type { AnalyticsSummary } from './analytics.types'

export class AnalyticsService {
  static async summary(): Promise<AnalyticsSummary> {
    return unwrap<AnalyticsSummary>(await supabase.rpc('my_analytics'))
  }
}

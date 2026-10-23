export interface DailyCount {
  date: string
  count: number
}

export interface AnalyticsSummary {
  perDay: DailyCount[]
  totals: { cards: number; active: number; drafts: number; taps: number }
}

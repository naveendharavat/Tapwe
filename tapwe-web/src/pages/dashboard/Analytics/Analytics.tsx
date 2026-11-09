import { PageTitle } from '../../../components/dashboard/PageTitle'
import { Card, EmptyState, Skeleton, Typography } from '../../../components/ui'
import { useAnalyticsSummary } from '../../../services/analytics/analytics.queries'
import type { DailyCount } from '../../../services/analytics/analytics.types'

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' })

function Bars({ days }: { days: DailyCount[] }) {
  const max = Math.max(...days.map((d) => d.count))
  return (
    <ul className="bars" aria-label="Opens per day">
      {days.map((d) => (
        <li key={d.date}>
          <span>{d.count}</span>
          <i data-testid="bar" style={{ height: `${max ? (d.count / max) * 100 : 0}%` }} />
          {weekday(d.date)}
        </li>
      ))}
    </ul>
  )
}

export default function Analytics() {
  const summary = useAnalyticsSummary()

  return (
    <>
      <PageTitle title="Analytics" description="Taps and scans per day." />
      {summary.isPending ? (
        <Skeleton label="Loading analytics" />
      ) : summary.isError ? (
        <EmptyState icon="alert" title="We couldn’t load analytics" description="Check your connection and try again." />
      ) : (
        <Card size="md">
          <b className="card-label">Opens this week</b>
          <Bars days={summary.data.perDay} />
          <Typography variant="subtle" className="card-foot">
            {summary.data.totals.taps} opens in the last 7 days
          </Typography>
        </Card>
      )}
    </>
  )
}

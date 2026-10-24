import { PageTitle } from '../../components/dashboard/PageTitle'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { useAnalyticsSummary } from '../../services/analytics/analytics.queries'
import type { DailyCount } from '../../services/analytics/analytics.types'

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
        <div className="card" style={{ padding: 24 }}>
          <b style={{ fontSize: 14, fontWeight: 500 }}>Opens this week</b>
          <Bars days={summary.data.perDay} />
          <p className="faint" style={{ fontSize: 14, marginTop: 24 }}>
            {summary.data.totals.taps} opens in the last 7 days
          </p>
        </div>
      )}
    </>
  )
}

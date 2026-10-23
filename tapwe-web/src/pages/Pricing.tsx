import { PageHead } from '../components/layout/PageHead'
import { Badge } from '../components/ui/Badge'
import { LinkButton } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'

// Placeholder plans until pricing is announced (spec: no real pricing in v1).
const PLANS: Array<[name: string, blurb: string, features: number, featured?: boolean]> = [
  ['Plan A', 'Placeholder for a starter plan.', 3],
  ['Plan B', 'Placeholder for a growing business.', 4, true],
  ['Plan C', 'Placeholder for multi-location teams.', 3],
]

export default function Pricing() {
  return (
    <>
      <PageHead
        eyebrow="Pricing"
        title="Simple plans, coming soon"
        lead="Pricing has not been announced yet. This layout is ready for plans once they are defined."
      />
      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div className="note" role="note">
          <Icon name="info" />
          <span>Placeholder content. Plan names, prices, and features are editable examples, and no plan is currently available.</span>
        </div>
        <div className="g3">
          {PLANS.map(([name, blurb, features, featured]) => (
            <div key={name} className={`card plan ${featured ? 'f' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 18 }}>{name}</h2>
                {featured && <Badge tone="brand">Placeholder highlight</Badge>}
              </div>
              <div className="price">
                ₹ — <small>/ editable</small>
              </div>
              <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
                {blurb}
              </p>
              <ul>
                {Array.from({ length: features }, (_, i) => (
                  <li key={i}>
                    <Icon name="check" />
                    Feature placeholder
                  </li>
                ))}
              </ul>
              <LinkButton variant={featured ? 'p' : 's'} to="/sign-up" className="full">
                Get Started
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

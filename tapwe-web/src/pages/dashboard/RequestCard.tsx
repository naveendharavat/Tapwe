import { PageTitle } from '../../components/dashboard/PageTitle'
import { LinkButton } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import type { IconName } from '../../components/ui/icons'

const STEPS: Array<[IconName, string, string]> = [
  ['msg', '1. Tell us what you need', 'Share your business details and what the card should open, such as a menu, social page or review link.'],
  ['sliders', '2. We configure it', 'Our team sets up the destination, your page and the QR code. You do not need to configure anything.'],
  ['card', '3. We deliver it', 'Your finished card is handed over ready to tap. Ask us any time to change where it points.'],
]

export default function RequestCard() {
  return (
    <>
      <PageTitle title="Request a Card" description="You tell us what you need. We do the configuration." />
      <div className="card" style={{ padding: 32, maxWidth: 760 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {STEPS.map(([icon, title, text]) => (
            <div key={title} style={{ display: 'flex', gap: 14 }}>
              <span className="ico" style={{ flex: 'none', width: 40, height: 40 }}>
                <Icon name={icon} />
              </span>
              <div>
                <h3 style={{ fontSize: 16 }}>{title}</h3>
                <p className="muted" style={{ marginTop: 4 }}>
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <LinkButton variant="p" to="/request">
            Request a Card <Icon name="arrow" />
          </LinkButton>
        </div>
      </div>
    </>
  )
}

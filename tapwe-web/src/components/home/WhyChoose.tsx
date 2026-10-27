import { revealDelay } from '../../lib/cssVars'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'

const REASONS: Array<[IconName, string, string]> = [
  ['sliders', 'We do the setup', 'No dashboards to learn. We configure and update your card.'],
  ['phone', 'Nothing for customers to install', 'The page opens in the phone’s browser.'],
  ['refresh', 'Change it, never reprint', 'The card keeps its link while the destination changes.'],
]

export function WhyChoose() {
  return (
    <section className="s alt">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">Why businesses choose Tapwe</div>
          <h2>Simple for you. Effortless for them.</h2>
        </div>
        <div className="g3">
          {REASONS.map(([icon, title, text], n) => (
            <div key={title} className="card why rv" style={revealDelay(n * 0.08)}>
              <span className="ico">
                <Icon name={icon} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

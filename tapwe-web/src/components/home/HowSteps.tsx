import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { revealDelay } from '../../lib/cssVars'

const STEPS: Array<[IconName, string, string]> = [
  ['card', 'Choose Your Card', 'Get your smart card with NFC and QR.'],
  ['scan', 'Tap or Scan', 'Customers use their phones to open your digital destination.'],
  ['trend', 'Connect and Grow', 'Share business information, menus, and links.'],
]

export function HowSteps() {
  return (
    <section className="s" id="how">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">How it works</div>
          <h2>Three steps from card to connection</h2>
        </div>
        <ol className="how">
          {STEPS.map(([icon, title, text], n) => (
            <li key={title} className="rv" style={revealDelay(n * 0.1)}>
              <div className="n">
                <Icon name={icon} />
              </div>
              <span className="k">STEP 0{n + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

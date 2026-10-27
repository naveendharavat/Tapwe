import { Fragment } from 'react'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { revealDelay } from '../../lib/cssVars'

const STEPS: Array<[IconName, string, string, string]> = [
  ['msg', 'Request', 'Tell us about your business and what to show.', 'You share the details'],
  ['sliders', 'Configure', 'We set up your page, link and QR code.', 'We do the setup'],
  ['nfc', 'Tap', 'Customers tap or scan. Your page opens.', 'They connect'],
]

export function HowSteps() {
  return (
    <section className="s alt" id="how">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">How it works</div>
          <h2>
            From request to <span className="gt">tap</span>
          </h2>
          <p>We handle the setup. You hand over the card.</p>
        </div>
        <div className="arc">
          {STEPS.map(([icon, title, text, who], n) => (
            <Fragment key={title}>
              {n > 0 && (
                <div className="ar" aria-hidden="true">
                  <Icon name="arrow" />
                </div>
              )}
              <div className="a rv" style={revealDelay(n * 0.1)}>
                <span className="ico">
                  <Icon name={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                <b>{who}</b>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

import { revealDelay } from '../../lib/cssVars'
import { SmartCardPreview } from '../cards/SmartCardPreview'
import { Icon } from '../ui/Icon'
import { ArrowLink } from './ArrowLink'

export function WaysIn() {
  return (
    <section className="s" id="journeys">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">One card, two ways in</div>
          <h2>Tap it. Or scan it.</h2>
        </div>
        <div className="g2 jr">
          <div className="jc rv">
            <div className="jv">
              <div className="vc">
                <SmartCardPreview theme="brand" />
              </div>
              <div className="ripl">
                <i />
                <i />
                <b>
                  <Icon name="nfc" />
                </b>
              </div>
            </div>
            <h3>NFC tap</h3>
            <p>Hold a phone near the card and your page opens. Nothing to install.</p>
            <ArrowLink to="/features">Learn about NFC</ArrowLink>
          </div>
          <div className="jc rv" style={revealDelay(0.1)}>
            <div className="jv">
              <div className="vc">
                <SmartCardPreview theme="review" />
              </div>
            </div>
            <h3>QR code</h3>
            <p>Every card has a QR code to the same link, so any phone camera works.</p>
            <ArrowLink to="/features">Learn about QR</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}

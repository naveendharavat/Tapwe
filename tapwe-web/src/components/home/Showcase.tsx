import { revealDelay } from '../../lib/cssVars'
import { PhoneMockup, ProfileScreen } from '../cards/PhoneMockup'
import { CardFan } from '../cards/SmartCardPreview'
import { Icon } from '../ui/Icon'

const TICKS = [
  'NFC tap and QR scan open the same link',
  'We configure it and update it for you, no reprinting',
  'Ready-made styles for social, menu and review cards',
]

export function Showcase() {
  return (
    <section className="s alt">
      <div className="wrap showcase">
        <div className="rv">
          <div className="eyebrow">The card</div>
          <h2>
            A premium card with a <span className="gt">permanent link</span> inside
          </h2>
          <p className="lead">
            Every Tapwe card is a printed PVC card with an NFC chip and a QR code. Both open the same permanent card URL,
            so you choose the destination once and change it whenever you need.
          </p>
          <ul className="ticks">
            {TICKS.map((t) => (
              <li key={t}>
                <Icon name="check" />
                {t}
              </li>
            ))}
          </ul>
          <div className="chip">
            <Icon name="qr" />
            tapwe.example/c/ab12cd
          </div>
          <p className="hint" style={{ marginTop: 8, fontSize: 12 }}>
            Example link, for illustration only.
          </p>
        </div>
        <div className="panel rv" style={revealDelay(0.1)}>
          <div className="sc2" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 24, alignItems: 'center' }}>
            <CardFan />
            <div style={{ maxWidth: 220, width: '100%', margin: 'auto' }}>
              <PhoneMockup>
                <ProfileScreen />
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

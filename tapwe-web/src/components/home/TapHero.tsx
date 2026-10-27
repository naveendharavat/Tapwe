import { SmartCardPreview } from '../cards/SmartCardPreview'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { MenuScreen } from './DemoScreens'

const APPS: Array<[IconName, string]> = [
  ['msg', '#4a3fc4'],
  ['pin', '#16a34a'],
  ['star', '#e11d48'],
  ['at', '#f59e0b'],
  ['globe', '#0ea5e9'],
  ['user', '#7c3aed'],
  ['chart', '#ea580c'],
  ['phone', '#0d9488'],
]
const DOCK: IconName[] = ['phone', 'msg', 'globe', 'user']
const STEPS = ['Tap the card', 'Link opens', 'Menu appears']

/** Looping hero animation: the phone taps the menu card, the link loads, the menu appears. */
export function TapHero() {
  return (
    <div className="thw">
      <div
        className="th"
        role="img"
        aria-label="Animation: a customer holds their phone to the card, the link opens, and your menu appears on the phone"
      >
        <div className="th-bg" aria-hidden="true" />
        <div className="th-card" aria-hidden="true">
          <SmartCardPreview theme="menu" />
        </div>
        <div className="th-rip" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="th-ph" aria-hidden="true">
          <div className="phone">
            <div className="notch" />
            <div className="scr" style={{ position: 'relative', padding: 0 }}>
              <div className="th-lock">
                <div className="tm">9:41</div>
                <div className="dt">Tuesday</div>
                <div className="apps">
                  {APPS.map(([icon, color]) => (
                    <span key={icon} className="ap" style={{ background: color }}>
                      <Icon name={icon} />
                    </span>
                  ))}
                </div>
                <div className="dock">
                  {DOCK.map((icon) => (
                    <span key={icon} className="ap" style={{ background: 'rgb(255 255 255/.22)' }}>
                      <Icon name={icon} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="th-page">
                <div className="addr">
                  <Icon name="link" />
                  <span>tapwe.example/c/ab12cd</span>
                </div>
                <MenuScreen />
              </div>
            </div>
          </div>
        </div>
        <div className="th-steps" aria-hidden="true">
          {STEPS.map((step, i) => (
            <span key={step} className={`s${i + 1}`}>
              <b>{i + 1}</b>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

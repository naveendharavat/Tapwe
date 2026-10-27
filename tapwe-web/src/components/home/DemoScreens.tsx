import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { ProfileScreen } from '../cards/PhoneMockup'
import type { DemoKey } from './demo-content'

const MENU_ITEMS: Array<[name: string, detail: string, price: string]> = [
  ['Filter coffee', 'Fresh South Indian brew', '₹80'],
  ['Paneer wrap', 'Grilled, with mint chutney', '₹180'],
  ['Veg sandwich', 'Toasted, with fries', '₹140'],
  ['Cold coffee', 'Iced, with cream', '₹150'],
]
const MENU_TABS = ['Popular', 'Mains', 'Drinks', 'Sweets']
const SOCIAL_LINKS: Array<[IconName, string]> = [
  ['at', 'Instagram'],
  ['globe', 'Website'],
  ['pin', 'Google Maps'],
]

export function MenuScreen() {
  return (
    <>
      <div className="mh">
        <b>Sample Café</b>
        <span>Sample menu</span>
      </div>
      <div className="mt">
        {MENU_TABS.map((tab, i) => (
          <i key={tab} className={i === 0 ? 'on' : ''}>
            {tab}
          </i>
        ))}
      </div>
      <div className="mlist">
        {MENU_ITEMS.map(([name, detail, price]) => (
          <div key={name} className="mrow">
            <span>
              <b>{name}</b>
              <small>{detail}</small>
            </span>
            <em>{price}</em>
          </div>
        ))}
      </div>
      <div className="pbtn" style={{ background: '#fff', color: 'var(--ink)', border: '1px solid var(--line)' }}>
        View full menu
      </div>
    </>
  )
}

/** What the phone shows for each destination in the design's demo. */
export function DemoScreen({ demo }: { demo: DemoKey }) {
  if (demo === 'menu') return <MenuScreen />
  if (demo === 'social') {
    return (
      <>
        <div className="av">YB</div>
        <div className="nm">Follow Your Business</div>
        <div className="sb">Find us online</div>
        <div style={{ marginTop: 14 }}>
          {SOCIAL_LINKS.map(([icon, label]) => (
            <div key={label} className="fb">
              <Icon name={icon} />
              {label}
              <span style={{ marginLeft: 'auto' }}>
                <Icon name="chev" />
              </span>
            </div>
          ))}
        </div>
      </>
    )
  }
  if (demo === 'feedback') {
    return (
      <>
        <div className="big" style={{ marginTop: 28 }}>
          How was your visit?
        </div>
        <div className="sb">Tap a star to rate</div>
        <div className="stars">
          {[1, 2, 3, 4].map((n) => (
            <Icon key={n} name="star" className="f" />
          ))}
          <Icon name="star" />
        </div>
        <div className="fb" style={{ marginTop: 12, color: 'var(--ink3)' }}>
          Tell us more (optional)
        </div>
        <div className="pbtn">Submit feedback</div>
      </>
    )
  }
  return <ProfileScreen />
}

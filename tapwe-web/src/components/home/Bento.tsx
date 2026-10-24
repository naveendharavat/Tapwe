import type { ReactNode } from 'react'
import { revealDelay } from '../../lib/cssVars'
import { QRCodePreview } from '../cards/QRCodePreview'
import { Badge } from '../ui/Badge'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'

function Tile({ icon, title, text, wide, delay, children }: { icon: IconName; title: string; text: string; wide?: boolean; delay?: number; children: ReactNode }) {
  return (
    <div className={`bc rv ${wide ? 'c3' : ''}`} style={delay ? revealDelay(delay) : undefined}>
      <div className="bt">
        <span className="ico">
          <Icon name={icon} />
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="bv">{children}</div>
    </div>
  )
}

const MANAGED: Array<[string, string]> = [
  ['Front desk', 'Active'],
  ['Table menu', 'Active'],
  ['Feedback', 'Draft'],
]

export function Bento() {
  return (
    <div className="bento">
      <Tile wide icon="nfc" title="NFC Tap Technology" text="Customers tap the card on a compatible phone to open your page. No app needed.">
        <div className="rip">
          <i />
          <i />
          <i />
          <b>
            <Icon name="nfc" />
          </b>
        </div>
      </Tile>
      <Tile wide delay={0.08} icon="qr" title="QR Code Access" text="Every card also carries a QR code for phones without NFC or for scanning at a distance.">
        <div className="qrs">
          <QRCodePreview seed="tapwe-qr" />
          <u />
        </div>
      </Tile>
      <Tile icon="user" title="Digital Business Profile" text="Share contact details, hours, and links from one clean, mobile-friendly page.">
        <div className="mini">
          <div><Icon name="phone" />Call<span className="sp faint">Contact</span></div>
          <div><Icon name="pin" />Map<span className="sp faint">Location</span></div>
          <div><Icon name="at" />Social<span className="sp faint">Links</span></div>
        </div>
      </Tile>
      <Tile delay={0.08} icon="link" title="Smart Links and Destinations" text="Point a card to your website, Instagram, a form, or any link you choose.">
        <div className="mini">
          <div><Icon name="globe" />Website</div>
          <div><Icon name="at" />Instagram</div>
          <div><Icon name="msg" />Google Form</div>
        </div>
      </Tile>
      <Tile delay={0.16} icon="menu" title="Menus and Feedback" text="Show a menu or open a feedback form right when the customer is there.">
        <div className="mini">
          <div><Icon name="menu" />Menu<span className="sp"><Icon name="chev" /></span></div>
          <div>
            <Icon name="star" className="f" />
            <Icon name="star" className="f" />
            <Icon name="star" className="f" />
            <Icon name="star" className="f" />
            <Icon name="star" />
          </div>
        </div>
      </Tile>
      <Tile wide delay={0.08} icon="grid" title="Easy Card Management" text="Name, organise, and review all your cards from one simple dashboard.">
        <div className="mini">
          {MANAGED.map(([name, status]) => (
            <div key={name}>
              {name}
              <Badge tone={status === 'Active' ? 'ok' : undefined} className="sp">
                {status}
              </Badge>
            </div>
          ))}
        </div>
      </Tile>
      <Tile wide delay={0.16} icon="refresh" title="We Handle the Setup" text="Our team configures your card and updates where it points whenever you ask. No reprinting required.">
        <div className="swap">
          <span>Menu</span>
          <Icon name="arrow" />
          <span className="on">Festival offer</span>
          <span className="faint" style={{ width: '100%', textAlign: 'center', border: 0, background: 'none', boxShadow: 'none', padding: 0 }}>
            Same card, new destination
          </span>
        </div>
      </Tile>
    </div>
  )
}

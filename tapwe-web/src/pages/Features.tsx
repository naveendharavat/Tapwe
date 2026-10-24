import type { ReactNode } from 'react'
import { PhoneMockup, ProfileScreen } from '../components/cards/PhoneMockup'
import { SmartCardPreview } from '../components/cards/SmartCardPreview'
import { CtaBand } from '../components/home/CtaBand'
import { PageHead } from '../components/layout/PageHead'
import { Badge } from '../components/ui/Badge'
import { Icon } from '../components/ui/Icon'
import type { IconName } from '../components/ui/icons'
import { useReveal } from '../hooks/useReveal'

const SAMPLE_DESTINATIONS: Array<[string, string]> = [
  ['Digital profile', 'Active'],
  ['Menu link', 'Active'],
  ['Feedback form', 'Draft'],
]

const statusBadge = (status: string) => <Badge tone={status === 'Active' ? 'ok' : undefined}>{status}</Badge>

interface FeatureRow {
  icon: IconName
  title: string
  text: string
  points: string[]
  visual: ReactNode
}

const ROWS: FeatureRow[] = [
  {
    icon: 'nfc',
    title: 'NFC tap',
    text: 'Hold a compatible phone near the card and your page opens. There is nothing to install and nothing to pair.',
    points: ['Works with NFC-enabled phones', 'Opens in the phone’s browser', 'Chip holds the card’s permanent link'],
    visual: (
      <div style={{ maxWidth: 270, margin: 'auto' }}>
        <SmartCardPreview theme="brand" />
      </div>
    ),
  },
  {
    icon: 'qr',
    title: 'QR codes',
    text: 'Each card carries a QR code that leads to the same permanent link as the NFC chip, so every phone can connect.',
    points: ['Scan with the regular camera app', 'Same link as the NFC chip', 'Download the QR from your dashboard'],
    visual: (
      <div style={{ maxWidth: 270, margin: 'auto' }}>
        <SmartCardPreview theme="review" />
      </div>
    ),
  },
  {
    icon: 'user',
    title: 'Digital profiles',
    text: 'Build a simple mobile page with your contact details, hours, social links, and the actions customers use most.',
    points: ['Contact and location actions', 'Social and website links', 'Feedback and review links'],
    visual: (
      <div style={{ width: 190, margin: 'auto' }}>
        <PhoneMockup>
          <ProfileScreen />
        </PhoneMockup>
      </div>
    ),
  },
  {
    icon: 'link',
    title: 'Smart destinations',
    text: 'Decide what a tap opens: a profile, a menu, a form, or a website. Switch it any time.',
    points: ['Profile, URL, menu, or form', 'Change without reprinting', 'One permanent card URL'],
    visual: (
      <div style={{ display: 'grid', gap: 10, maxWidth: 340, margin: 'auto' }}>
        {SAMPLE_DESTINATIONS.map(([name, status]) => (
          <div
            key={name}
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontSize: 14 }}
          >
            <span>{name}</span>
            {statusBadge(status)}
          </div>
        ))}
        <div className="chip" style={{ margin: 0, justifySelf: 'center' }}>
          <Icon name="link" />
          tapwe.example/c/ab12cd
        </div>
      </div>
    ),
  },
  {
    icon: 'grid',
    title: 'Card management',
    text: 'See all of your cards in one place, check their status, and request a change whenever you need one.',
    points: ['Clear status for every card', 'Request changes in a few clicks', 'Organised by card name'],
    visual: (
      <div className="card" style={{ padding: 16, maxWidth: 360, margin: 'auto' }}>
        <b style={{ fontSize: 14 }}>My Cards</b>
        {[
          ['Front desk', 'Active'],
          ['Table menu', 'Active'],
          ['Feedback', 'Draft'],
        ].map(([name, status]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderTop: '1px solid var(--line)',
              marginTop: 10,
              fontSize: 14,
            }}
          >
            <span>{name}</span>
            {statusBadge(status)}
          </div>
        ))}
        <p className="hint" style={{ fontSize: 12, marginTop: 8 }}>
          Example cards
        </p>
      </div>
    ),
  },
]

export default function Features() {
  useReveal()
  return (
    <>
      <PageHead
        eyebrow="Features"
        title="One card. A few simple tools."
        lead="Tapwe keeps things plain: a physical card, a permanent link, and a dashboard to decide where it goes."
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 40 }}>
        {ROWS.map(({ icon, title, text, points, visual }, n) => (
          <section key={title} className={`frow rv ${n % 2 ? 'rev' : ''}`}>
            <div className="txt">
              <span className="ico">
                <Icon name={icon} />
              </span>
              <h2>{title}</h2>
              <p className="lead">{text}</p>
              <ul className="ticks">
                {points.map((p) => (
                  <li key={p}>
                    <Icon name="check" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel">{visual}</div>
          </section>
        ))}
      </div>
      <CtaBand />
    </>
  )
}

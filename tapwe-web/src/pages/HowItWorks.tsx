import { CtaBand } from '../components/home/CtaBand'
import { PageHead } from '../components/layout/PageHead'
import { Icon } from '../components/ui/Icon'
import type { IconName } from '../components/ui/icons'
import { useReveal } from '../hooks/useReveal'

const FLOW: Array<[IconName, string, string]> = [
  ['pkg', 'Receive your card', 'Your Tapwe card arrives with an NFC chip and a QR code, both tied to its own permanent link.'],
  ['sliders', 'Choose a destination', 'In your dashboard, pick what the card opens: a profile, menu, form, or website.'],
  ['nfc', 'Customer taps', 'They hold their phone near the card. NFC-enabled phones open the link right away.'],
  ['scan', 'Or scans the QR', 'No NFC? They point the camera at the QR code and get the same page.'],
  ['monitor', 'Your page opens', 'The configured destination loads in their browser. Change it later and the same card follows.'],
]

export default function HowItWorks() {
  useReveal()
  return (
    <>
      <PageHead
        eyebrow="How it works"
        title="From card to connection, step by step"
        lead="No apps, no accounts for your customers. Just a tap or a scan."
      />
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <ol className="flow" style={{ listStyle: 'none', padding: 0 }}>
          {FLOW.map(([icon, title, text], n) => (
            <li key={title} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="ico">
                  <Icon name={icon} />
                </span>
                <span className="faint" style={{ fontSize: 14, fontWeight: 500 }}>
                  0{n + 1}
                </span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="card" style={{ padding: 32, marginTop: 56 }}>
          <h2 style={{ fontSize: 20 }}>One permanent link</h2>
          <p className="muted" style={{ marginTop: 8, maxWidth: 680 }}>
            The NFC chip and the QR code both point to the same card URL. That URL never changes, so the printed card
            stays valid even when you point it somewhere new.
          </p>
        </div>
      </div>
      <CtaBand />
    </>
  )
}

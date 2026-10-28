import { CtaBand } from '../../../components/marketing/CtaBand'
import { PageHead } from '../../../components/layout/PageHead'
import { Card, IconBox, Section, Stack, Typography, type IconName } from '../../../components/ui'
import { useReveal } from '../../../hooks/useReveal'

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
      <Section spacing="page">
        <ol className="flow">
          {FLOW.map(([icon, title, text], n) => (
            <Card as="li" key={title} size="sm">
              <Stack direction="row" justify="space-between" align="center">
                <IconBox name={icon} />
                <span className="faint step-no">0{n + 1}</span>
              </Stack>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </ol>
        <Card size="lg" className="flow-note">
          <Stack gap={2}>
            <Typography variant="heading-md">One permanent link</Typography>
            <Typography variant="muted">
              The NFC chip and the QR code both point to the same card URL. That URL never changes, so the printed card
              stays valid even when you point it somewhere new.
            </Typography>
          </Stack>
        </Card>
      </Section>
      <CtaBand />
    </>
  )
}

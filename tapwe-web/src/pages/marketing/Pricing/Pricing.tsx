import { PageHead } from '../../../components/layout/PageHead'
import { CtaBand } from '../../../components/marketing/CtaBand'
import { Card, Grid, IconBox, Section, type IconName } from '../../../components/ui'
import { useReveal } from '../../../hooks/useReveal'
import { revealDelay } from '../../../lib/cssVars'

const INCLUDED: Array<[IconName, string, string]> = [
  ['card', 'The card', 'A durable PVC card with an NFC chip and a printed QR code, both tied to one permanent link.'],
  ['sliders', 'Setup by our team', 'Tell us what the card should open. We configure the page, link and QR code before it reaches you.'],
  ['refresh', 'Changes any time', 'Point the same card at a new menu, form or page later. No reprint needed.'],
]

export default function Pricing() {
  useReveal()
  return (
    <>
      <PageHead
        eyebrow="Pricing"
        title="Pricing on request"
        lead="Every Tapwe card is set up for your business, so the price depends on how many cards you need and what they open. Send a request and we will get back to you with a quote."
      />
      <Section spacing="page">
        <Grid columns={3}>
          {INCLUDED.map(([icon, title, text], n) => (
            <Card key={title} size="lg" className="why rv" style={revealDelay(n * 0.08)}>
              <IconBox name={icon} />
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </Grid>
      </Section>
      <CtaBand />
    </>
  )
}

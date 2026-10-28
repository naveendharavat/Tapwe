import { Card, Section, SectionHeader } from '../../../../components/ui'
import { revealDelay } from '../../../../lib/cssVars'

const STAGES: Array<[title: string, text: string]> = [
  ['Request', 'Fill in the short request form.'],
  ['Configure', 'We set up your page, link and QR.'],
  ['Deliver', 'Your finished card is handed over.'],
  ['Tap', 'Customers connect in one tap.'],
]

export function CardJourney() {
  return (
    <Section id="journey" tone="alt">
      <SectionHeader eyebrow="The journey" title="How a card gets to you" />
      <ol className="tl">
        {STAGES.map(([title, text], n) => (
          <Card as="li" size="md" key={title} className="rv" style={revealDelay(n * 0.08)}>
            <span className="tn">{n + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </ol>
    </Section>
  )
}

import { Card, Grid, IconBox, Section, SectionHeader, type IconName } from '../../../../components/ui'
import { revealDelay } from '../../../../lib/cssVars'

const REASONS: Array<[IconName, string, string]> = [
  ['sliders', 'We do the setup', 'No dashboards to learn. We configure and update your card.'],
  ['phone', 'Nothing for customers to install', 'The page opens in the phone’s browser.'],
  ['refresh', 'Change it, never reprint', 'The card keeps its link while the destination changes.'],
]

export function WhyChoose() {
  return (
    <Section tone="alt">
      <SectionHeader eyebrow="Why businesses choose Tapwe" title="Simple for you. Effortless for them." />
      <Grid columns={3}>
        {REASONS.map(([icon, title, text], n) => (
          <Card key={title} size="lg" className="why rv" style={revealDelay(n * 0.08)}>
            <IconBox name={icon} />
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

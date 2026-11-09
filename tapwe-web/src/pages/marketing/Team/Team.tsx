import { CtaBand } from '../../../components/marketing/CtaBand'
import { TeamSection } from '../../../components/marketing/TeamSection'
import { Card, Grid, IconBox, Section, SectionHeader, type IconName } from '../../../components/ui'
import { usePageMeta } from '../../../hooks/usePageMeta'
import { useReveal } from '../../../hooks/useReveal'
import { revealDelay } from '../../../lib/cssVars'

const VALUES: Array<[IconName, string, string]> = [
  ['sliders', 'We do the setup', 'Businesses should not have to configure anything. We set up every card and keep it updated.'],
  ['phone', 'Simple for customers', 'One tap or scan opens the page. No app and no typing.'],
  ['star', 'Built for in-person businesses', 'Restaurants, shops, salons and professionals who meet people face to face.'],
]

export default function Team() {
  usePageMeta('Team', 'The people behind Tapwe: a small team helping businesses turn every in-person visit into a lasting connection.')
  useReveal()
  return (
    <>
      <TeamSection />
      <Section tone="alt">
        <SectionHeader eyebrow="How we work" title="What we care about" />
        <Grid columns={3}>
          {VALUES.map(([icon, title, text], n) => (
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

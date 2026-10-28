import { Card, Grid, IconBox, Section, SectionHeader, type IconName } from '../../../../components/ui'
import { cssVars } from '../../../../lib/cssVars'

const CASES: Array<[IconName, string, string, color: string, tint: string]> = [
  ['menu', 'Restaurants and cafés', 'Menus and feedback.', '#c2410c', '#fff0e6'],
  ['store', 'Retail stores', 'Business information and social links.', '#0e7490', '#e3f5f9'],
  ['hotel', 'Hotels and hospitality', 'Guest information and feedback.', '#6d28d9', '#efe8ff'],
  ['scissors', 'Salons and clinics', 'Contact details and appointment links.', '#be185d', '#fde7f1'],
  ['brief', 'Professionals', 'Digital business profiles and contact sharing.', '#1d4ed8', '#e6eeff'],
  ['spark', 'Creators', 'Social media and portfolio links.', '#15803d', '#e4f5ea'],
]

export function UseCases() {
  return (
    <Section id="use-cases">
      <SectionHeader eyebrow="Use cases" title="Made for businesses that meet customers in person" />
      <Grid columns={3}>
        {CASES.map(([icon, title, text, color, tint], n) => (
          <Card key={title} size="md" interactive className="uc rv" style={cssVars({ '--c': color, '--cb': tint, '--d': `${(n % 3) * 0.08}s` })}>
            <IconBox name={icon} />
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

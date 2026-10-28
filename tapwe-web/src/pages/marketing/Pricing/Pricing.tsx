import { PageHead } from '../../../components/layout/PageHead'
import { Badge, Card, Grid, Icon, LinkButton, Note, Section, Stack, Typography } from '../../../components/ui'

// Placeholder plans until pricing is announced (spec: no real pricing in v1).
const PLANS: Array<[name: string, blurb: string, features: number, featured?: boolean]> = [
  ['Plan A', 'Placeholder for a starter plan.', 3],
  ['Plan B', 'Placeholder for a growing business.', 4, true],
  ['Plan C', 'Placeholder for multi-location teams.', 3],
]

export default function Pricing() {
  return (
    <>
      <PageHead
        eyebrow="Pricing"
        title="Simple plans, coming soon"
        lead="Pricing has not been announced yet. This layout is ready for plans once they are defined."
      />
      <Section spacing="page">
        <Note>Placeholder content. Plan names, prices, and features are editable examples, and no plan is currently available.</Note>
        <Grid columns={3}>
          {PLANS.map(([name, blurb, features, featured]) => (
            <Card key={name} size="md" className={featured ? 'plan f' : 'plan'}>
              <Stack direction="row" justify="space-between" align="center">
                <Typography variant="heading-sm">{name}</Typography>
                {featured && <Badge tone="brand">Placeholder highlight</Badge>}
              </Stack>
              <p className="price">
                ₹ — <small>/ editable</small>
              </p>
              <Typography variant="muted" className="blurb">
                {blurb}
              </Typography>
              <ul>
                {Array.from({ length: features }, (_, i) => (
                  <li key={i}>
                    <Icon name="check" />
                    Feature placeholder
                  </li>
                ))}
              </ul>
              <LinkButton variant={featured ? 'p' : 's'} to="/sign-up" className="full">
                Get Started
              </LinkButton>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  )
}

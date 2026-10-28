import { PageTitle } from '../../../components/dashboard/PageTitle'
import { Box, Card, Icon, IconBox, type IconName, LinkButton, Stack, Typography } from '../../../components/ui'

const STEPS: Array<[IconName, string, string]> = [
  ['msg', '1. Tell us what you need', 'Share your business details and what the card should open, such as a menu, social page or review link.'],
  ['sliders', '2. We configure it', 'Our team sets up the destination, your page and the QR code. You do not need to configure anything.'],
  ['card', '3. We deliver it', 'Your finished card is handed over ready to tap. Ask us any time to change where it points.'],
]

export default function RequestCard() {
  return (
    <>
      <PageTitle title="Request a Card" description="You tell us what you need. We do the configuration." />
      <Card size="lg" className="request-steps">
        <Stack gap={5}>
          {STEPS.map(([icon, title, text]) => (
            <Stack key={title} direction="row" gap="3_5">
              <IconBox name={icon} size="sm" />
              <Stack gap={1}>
                <h3>{title}</h3>
                <Typography variant="muted">{text}</Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Box className="request-steps-cta">
          <LinkButton variant="p" to="/request">
            Request a Card <Icon name="arrow" />
          </LinkButton>
        </Box>
      </Card>
    </>
  )
}

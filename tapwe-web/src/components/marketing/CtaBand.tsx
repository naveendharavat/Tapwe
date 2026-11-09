import { Box, LinkButton, Section } from '../ui'

export function CtaBand() {
  return (
    <Section spacing="flush-top">
      <Box className="band rv">
        <h2>Make Every Connection Count.</h2>
        <p>Bring your business card, digital presence, and customer connections together with Tapwe.</p>
        <Box className="row2">
          <LinkButton variant="w" size="lg" to="/request">
            Request a Card
          </LinkButton>
          <LinkButton variant="o" size="lg" to="/how-it-works">
            See How It Works
          </LinkButton>
        </Box>
      </Box>
    </Section>
  )
}

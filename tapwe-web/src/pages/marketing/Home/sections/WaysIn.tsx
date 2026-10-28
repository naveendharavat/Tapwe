import { Box, Card, Grid, Icon, Section, SectionHeader } from '../../../../components/ui'
import { SmartCardPreview } from '../../../../components/cards/SmartCardPreview'
import { ArrowLink } from '../../../../components/marketing/ArrowLink'
import { revealDelay } from '../../../../lib/cssVars'

export function WaysIn() {
  return (
    <Section id="journeys">
      <SectionHeader eyebrow="One card, two ways in" title="Tap it. Or scan it." />
      <Grid columns={2} className="jr">
        <Card size="lg" className="jc rv">
          <Box className="jv">
            <Box className="vc">
              <SmartCardPreview theme="brand" />
            </Box>
            <span className="ripl">
              <i />
              <i />
              <b>
                <Icon name="nfc" />
              </b>
            </span>
          </Box>
          <h3>NFC tap</h3>
          <p>Hold a phone near the card and your page opens. Nothing to install.</p>
          <ArrowLink to="/features">Learn about NFC</ArrowLink>
        </Card>
        <Card size="lg" className="jc rv" style={revealDelay(0.1)}>
          <Box className="jv">
            <Box className="vc">
              <SmartCardPreview theme="review" />
            </Box>
          </Box>
          <h3>QR code</h3>
          <p>Every card has a QR code to the same link, so any phone camera works.</p>
          <ArrowLink to="/features">Learn about QR</ArrowLink>
        </Card>
      </Grid>
    </Section>
  )
}

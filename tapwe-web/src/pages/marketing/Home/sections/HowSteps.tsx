import { Fragment } from 'react'
import { Box, Card, Icon, IconBox, Section, SectionHeader, type IconName } from '../../../../components/ui'
import { revealDelay } from '../../../../lib/cssVars'

const STEPS: Array<[IconName, string, string, string]> = [
  ['msg', 'Request', 'Tell us about your business and what to show.', 'You share the details'],
  ['sliders', 'Configure', 'We set up your page, link and QR code.', 'We do the setup'],
  ['nfc', 'Tap', 'Customers tap or scan. Your page opens.', 'They connect'],
]

export function HowSteps() {
  return (
    <Section id="how" tone="alt">
      <SectionHeader
        eyebrow="How it works"
        title={
          <>
            From request to <span className="gt">tap</span>
          </>
        }
        lead="We handle the setup. You hand over the card."
      />
      <Box className="arc">
        {STEPS.map(([icon, title, text, who], n) => (
          <Fragment key={title}>
            {n > 0 && (
              <span className="ar" aria-hidden="true">
                <Icon name="arrow" />
              </span>
            )}
            <Card size="lg" className="a rv" style={revealDelay(n * 0.1)}>
              <IconBox name={icon} />
              <h3>{title}</h3>
              <p>{text}</p>
              <b>{who}</b>
            </Card>
          </Fragment>
        ))}
      </Box>
    </Section>
  )
}

import { formatPhone, SUPPORT_PHONES, telHref, whatsappHref } from '../../content/contact'
import { revealDelay } from '../../lib/cssVars'
import { Box, Card, Grid, Icon, Section, SectionHeader } from '../ui'

const LEAD = 'Call or WhatsApp us to order a card or ask anything.'

export function ContactSection({ titleAs }: { titleAs?: 'h1' | 'h2' }) {
  return (
    <Section id="contact">
      <SectionHeader eyebrow="Contact us" title="Talk to us directly" lead={LEAD} titleAs={titleAs} />
      <Grid columns={2} className="contact-grid">
        {SUPPORT_PHONES.map((phone, n) => (
          <Card key={phone} size="md" className="contact-card rv" style={revealDelay(n * 0.08)}>
            <a href={telHref(phone)} className="contact-number">
              {formatPhone(phone)}
            </a>
            <Box className="contact-actions">
              <a href={telHref(phone)} className="btn btn-p">
                <Icon name="phone" />
                Call
              </a>
              <a href={whatsappHref(phone)} target="_blank" rel="noreferrer" className="btn btn-s">
                <Icon name="msg" />
                WhatsApp
              </a>
            </Box>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

import type { ReactNode } from 'react'
import googleReviewCard from '../../../assets/google-review-card.jpg'
import { PhoneMockup, ProfileScreen } from '../../../components/cards/PhoneMockup'
import { SmartCardPreview } from '../../../components/cards/SmartCardPreview'
import { CtaBand } from '../../../components/marketing/CtaBand'
import { PageHead } from '../../../components/layout/PageHead'
import { Badge, Box, Card, Container, Icon, IconBox, TickList, Typography, type IconName } from '../../../components/ui'
import { useReveal } from '../../../hooks/useReveal'

const SAMPLE_DESTINATIONS: Array<[string, string]> = [
  ['Digital profile', 'Active'],
  ['Menu link', 'Active'],
  ['Feedback form', 'Draft'],
]

const statusBadge = (status: string) => <Badge tone={status === 'Active' ? 'ok' : undefined}>{status}</Badge>

interface FeatureRow {
  icon: IconName
  title: string
  text: string
  points: string[]
  visual: ReactNode
}

const ROWS: FeatureRow[] = [
  {
    icon: 'nfc',
    title: 'NFC tap',
    text: 'Hold a compatible phone near the card and your page opens. There is nothing to install and nothing to pair.',
    points: ['Works with NFC-enabled phones', 'Opens in the phone’s browser', 'Chip holds the card’s permanent link'],
    visual: (
      <Box className="fv-card">
        <SmartCardPreview theme="brand" />
      </Box>
    ),
  },
  {
    icon: 'qr',
    title: 'QR codes',
    text: 'Each card carries a QR code that leads to the same permanent link as the NFC chip, so every phone can connect.',
    points: ['Scan with the regular camera app', 'Same link as the NFC chip', 'Download the QR from your dashboard'],
    visual: (
      <img
        className="fv-photo"
        src={googleReviewCard}
        alt="Tapwe review card with a QR code and NFC tap area, asking customers to leave a Google review"
        width={1024}
        height={1024}
        loading="lazy"
      />
    ),
  },
  {
    icon: 'user',
    title: 'Digital profiles',
    text: 'Build a simple mobile page with your contact details, hours, social links, and the actions customers use most.',
    points: ['Contact and location actions', 'Social and website links', 'Feedback and review links'],
    visual: (
      <Box className="fv-phone">
        <PhoneMockup>
          <ProfileScreen />
        </PhoneMockup>
      </Box>
    ),
  },
  {
    icon: 'link',
    title: 'Smart destinations',
    text: 'Decide what a tap opens: a profile, a menu, a form, or a website. Switch it any time.',
    points: ['Profile, URL, menu, or form', 'Change without reprinting', 'One permanent card URL'],
    visual: (
      <Box className="fv-dest">
        {SAMPLE_DESTINATIONS.map(([name, status]) => (
          <Card key={name} className="fv-row">
            <span>{name}</span>
            {statusBadge(status)}
          </Card>
        ))}
        <span className="chip">
          <Icon name="link" />
          tapwe.example/c/ab12cd
        </span>
      </Box>
    ),
  },
  {
    icon: 'grid',
    title: 'Card management',
    text: 'See all of your cards in one place, check their status, and request a change whenever you need one.',
    points: ['Clear status for every card', 'Request changes in a few clicks', 'Organised by card name'],
    visual: (
      <Card size="sm" className="fv-list">
        <b>My Cards</b>
        <ul>
          {[
            ['Front desk', 'Active'],
            ['Table menu', 'Active'],
            ['Feedback', 'Draft'],
          ].map(([name, status]) => (
            <li key={name}>
              <span>{name}</span>
              {statusBadge(status)}
            </li>
          ))}
        </ul>
        <Typography variant="hint">Example cards</Typography>
      </Card>
    ),
  },
]

export default function Features() {
  useReveal()
  return (
    <>
      <PageHead
        eyebrow="Features"
        title="One card. A few simple tools."
        lead="Tapwe keeps things plain: a physical card, a permanent link, and a dashboard to decide where it goes."
      />
      <Container className="features-body">
        {ROWS.map(({ icon, title, text, points, visual }, n) => (
          <section key={title} className={`frow rv ${n % 2 ? 'rev' : ''}`}>
            <Box className="txt">
              <IconBox name={icon} />
              <h2>{title}</h2>
              <Typography variant="lead">{text}</Typography>
              <TickList items={points} />
            </Box>
            <Box className="panel">{visual}</Box>
          </section>
        ))}
      </Container>
      <CtaBand />
    </>
  )
}

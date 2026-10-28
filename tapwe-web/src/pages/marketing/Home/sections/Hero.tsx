import { Box, Container, Icon, LinkButton, Typography } from '../../../../components/ui'
import { TapHero } from '../../../../components/marketing/TapHero'

const TICKS: Array<[title: string, text: string]> = [
  ['Works on any phone', 'NFC tap or QR scan.'],
  ['Opens instantly', 'No app and no typing.'],
  ['Set up for you', 'Tell us what to show.'],
]

export function Hero() {
  return (
    <Box className="hero-wrap">
      <Container>
        <section className="hero">
          <Box className="hl">
            <Box className="pillb">
              <b>NFC + QR</b>Smart business cards
            </Box>
            <h1>
              One Tap. <span className="gt">Endless Possibilities.</span>
            </h1>
            <Typography variant="lead">
              A smart card that opens your menu, social page or review link with one tap. No app needed. We set it up
              for you.
            </Typography>
            <Box className="cta">
              <LinkButton variant="p" size="lg" to="/request">
                Request a Card <Icon name="arrow" />
              </LinkButton>
              <LinkButton variant="s" size="lg" to="/how-it-works">
                See How It Works
              </LinkButton>
            </Box>
            <ul className="tk">
              {TICKS.map(([title, text]) => (
                <li key={title}>
                  <span className="ck">
                    <Icon name="check" />
                  </span>
                  <span>
                    <b>{title}.</b> {text}
                  </span>
                </li>
              ))}
            </ul>
          </Box>
          <TapHero />
        </section>
      </Container>
    </Box>
  )
}

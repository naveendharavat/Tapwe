import { LinkButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { TapHero } from './TapHero'

const TICKS: Array<[title: string, text: string]> = [
  ['Works on any phone', 'NFC tap or QR scan.'],
  ['Opens instantly', 'No app and no typing.'],
  ['Set up for you', 'Tell us what to show.'],
]

export function Hero() {
  return (
    <div className="hero-wrap">
      <div className="wrap">
        <section className="hero">
          <div className="hl">
            <div className="pillb">
              <b>NFC + QR</b>Smart business cards
            </div>
            <h1>
              One Tap. <span className="gt">Endless Possibilities.</span>
            </h1>
            <p className="lead">
              A smart card that opens your menu, social page or review link with one tap. No app needed. We set it up
              for you.
            </p>
            <div className="cta">
              <LinkButton variant="p" size="lg" to="/request">
                Request a Card <Icon name="arrow" />
              </LinkButton>
              <LinkButton variant="s" size="lg" to="/how-it-works">
                See How It Works
              </LinkButton>
            </div>
            <ul className="tk">
              {TICKS.map(([title, text]) => (
                <li key={title}>
                  <span className="ck">
                    <Icon name="check" />
                  </span>
                  <span>
                    <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{title}.</b> {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <TapHero />
        </section>
      </div>
    </div>
  )
}

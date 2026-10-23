import { PhoneMockup } from '../cards/PhoneMockup'
import { SmartCardPreview } from '../cards/SmartCardPreview'
import { LinkButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { DemoScreen } from './DemoScreens'

const TRUST = ['No app needed for customers', 'One permanent link per card', 'Change destinations anytime']

function HeroMock() {
  return (
    <div className="hm">
      <div className="bg" />
      <div className="ph">
        <PhoneMockup>
          <DemoScreen demo="menu" />
        </PhoneMockup>
      </div>
      <div className="cd c1">
        <SmartCardPreview theme="brand" />
      </div>
      <div className="cd c2">
        <SmartCardPreview theme="menu" />
      </div>
      <div className="fchip ok" style={{ top: '2%', left: 0 }}>
        <i>
          <Icon name="check" />
        </i>
        Menu opened
      </div>
      <div className="fchip hm2" style={{ top: '27%', left: '3%', animationDelay: '-2s' }}>
        <i>
          <Icon name="nfc" />
        </i>
        Tap detected
      </div>
      <div className="fchip ok hm2" style={{ bottom: 0, right: '8%', animationDelay: '-3.5s' }}>
        <i>
          <Icon name="user" />
        </i>
        Scanned at table
      </div>
      <div className="tap" aria-hidden="true">
        <i />
        <b>
          <Icon name="nfc" />
        </b>
      </div>
    </div>
  )
}

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
              Connect your business to the digital world with smart NFC and QR cards. Share your profile, menu, social
              links, and feedback forms with a simple tap or scan.
            </p>
            <div className="cta">
              <LinkButton variant="p" size="lg" to="/sign-up">
                Get Started <Icon name="arrow" />
              </LinkButton>
              <LinkButton variant="s" size="lg" to="/how-it-works">
                See How It Works
              </LinkButton>
            </div>
            <ul className="trust">
              {TRUST.map((t) => (
                <li key={t}>
                  <Icon name="check" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroMock />
        </section>
      </div>
    </div>
  )
}

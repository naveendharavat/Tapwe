import { PhoneMockup } from '../cards/PhoneMockup'
import { SmartCardPreview, type CardTheme } from '../cards/SmartCardPreview'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import type { DemoKey } from './demo-content'
import { DemoScreen } from './DemoScreens'
import { Pills } from './Pills'

type Experience = { title: string; text: string; points: string[]; theme: CardTheme; demo: DemoKey }

const EXPERIENCES: Experience[] = [
  {
    title: 'Menu cards for restaurants',
    text: 'Put your full menu one tap away. Guests see it on their own phone, and you change it whenever the menu does.',
    points: ['Cream card style made for tables', 'Scan to explore, no printed menus to replace', 'Update dishes without reprinting'],
    theme: 'menu',
    demo: 'menu',
  },
  {
    title: 'Social cards for growth',
    text: 'Turn every customer into a follower. One tap opens your Instagram or any social page.',
    points: ['Follow-us style card', 'Link to Instagram, website and maps', 'Change the link for every campaign'],
    theme: 'insta',
    demo: 'social',
  },
  {
    title: 'Review cards for reputation',
    text: 'Ask for feedback while the visit is fresh. Customers tap and land on your review or feedback page.',
    points: ['Review style card with a clear prompt', 'Opens a review link or feedback form', 'Perfect for the counter or table'],
    theme: 'review',
    demo: 'feedback',
  },
]

const DESTINATIONS: Array<[IconName, string]> = [
  ['menu', 'Menu'],
  ['at', 'Social links'],
  ['star', 'Feedback form'],
  ['user', 'Business profile'],
  ['globe', 'Website'],
  ['pin', 'Google Maps'],
  ['phone', 'Contact details'],
]

export function CardExperiences() {
  return (
    <section className="s" id="features">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">Card experiences</div>
          <h2>
            One card. <span className="gt">Three popular ways</span> to use it.
          </h2>
          <p>Ready-made card styles for the moments that matter most to in-person businesses.</p>
        </div>
        {EXPERIENCES.map(({ title, text, points, theme, demo }, i) => (
          <div key={title} className={`dd ${i % 2 ? 'rev' : ''} rv`}>
            <div className="tx">
              <span className="no">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <ul className="ticks">
                {points.map((point) => (
                  <li key={point}>
                    <Icon name="check" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="vis">
              <div className="vc">
                <SmartCardPreview theme={theme} />
              </div>
              <PhoneMockup>
                <DemoScreen demo={demo} />
              </PhoneMockup>
            </div>
          </div>
        ))}
        <div className="sh rv" style={{ margin: '48px auto 24px' }}>
          <div className="eyebrow">Destinations</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>Point it wherever you need</h3>
        </div>
        <Pills items={DESTINATIONS} />
      </div>
    </section>
  )
}

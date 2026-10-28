import { PhoneMockup } from '../../../../components/cards/PhoneMockup'
import { SmartCardPreview, type CardTheme } from '../../../../components/cards/SmartCardPreview'
import { Box, Section, SectionHeader, TickList, type IconName } from '../../../../components/ui'
import type { DemoKey } from '../../../../components/marketing/demo-content'
import { DemoScreen } from '../../../../components/marketing/DemoScreens'
import { Pills } from '../../../../components/marketing/Pills'

type Experience = { title: string; text: string; points: string[]; theme: CardTheme; demo: DemoKey }

const EXPERIENCES: Experience[] = [
  {
    title: 'Menu cards for restaurants',
    text: 'Put your full menu one tap away on every guest’s phone.',
    points: ['Card style made for tables', 'No printed menus to replace', 'Update dishes without reprinting'],
    theme: 'menu',
    demo: 'menu',
  },
  {
    title: 'Social cards for growth',
    text: 'Turn customers into followers. One tap opens your Instagram or social page.',
    points: ['Follow-us card style', 'Link to Instagram, website or maps', 'Change the link for any campaign'],
    theme: 'insta',
    demo: 'social',
  },
  {
    title: 'Review cards for reputation',
    text: 'Ask for feedback while the visit is fresh. One tap opens your review page.',
    points: ['Clear review prompt', 'Opens a review link or feedback form', 'Ideal for the counter or table'],
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
    <Section id="features">
      <SectionHeader
        eyebrow="Card experiences"
        title={
          <>
            One card. <span className="gt">Three popular ways</span> to use it.
          </>
        }
        lead="Ready-made card styles for the moments that matter."
      />
      {EXPERIENCES.map(({ title, text, points, theme, demo }, i) => (
        <Box key={title} className={`dd ${i % 2 ? 'rev' : ''} rv`}>
          <Box className="tx">
            <span className="no">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <TickList items={points} />
          </Box>
          <Box className="vis">
            <Box className="vc">
              <SmartCardPreview theme={theme} />
            </Box>
            <PhoneMockup>
              <DemoScreen demo={demo} />
            </PhoneMockup>
          </Box>
        </Box>
      ))}
      <SectionHeader eyebrow="Destinations" title="Point it wherever you need" titleAs="h3" className="sh--sub" />
      <Pills items={DESTINATIONS} />
    </Section>
  )
}

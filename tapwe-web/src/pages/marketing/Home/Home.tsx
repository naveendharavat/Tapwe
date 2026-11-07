import { CtaBand } from '../../../components/marketing/CtaBand'
import { Pills } from '../../../components/marketing/Pills'
import { TeamSection } from '../../../components/marketing/TeamSection'
import { Section, type IconName } from '../../../components/ui'
import { usePageMeta } from '../../../hooks/usePageMeta'
import { useReveal } from '../../../hooks/useReveal'
import { AboutSection } from './sections/AboutSection'
import { CardExperiences } from './sections/CardExperiences'
import { CardJourney } from './sections/CardJourney'
import { CustomersStrip } from './sections/CustomersStrip'
import { DemoSection } from './sections/DemoSection'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { UseCases } from './sections/UseCases'
import { WaysIn } from './sections/WaysIn'
import { WhyChoose } from './sections/WhyChoose'
import { WhyTapwe } from './sections/WhyTapwe'

const HIGHLIGHTS: Array<[IconName, string]> = [
  'NFC enabled',
  'QR on every card',
  'Durable PVC card',
  'Any destination',
  'Set up by our team',
  'No app for customers',
].map((label): [IconName, string] => ['check', label])

export default function Home() {
  usePageMeta('Smart NFC & QR business cards', 'Smart NFC and QR cards that connect your business to the digital world with one tap.')
  useReveal()
  return (
    <>
      <Hero />
      <Marquee />
      <CustomersStrip />
      <WhyTapwe />
      <CardJourney />
      <WaysIn />
      <DemoSection />
      <AboutSection />
      <TeamSection />
      <Section spacing="flush-top">
        <Pills items={HIGHLIGHTS} />
      </Section>
      <CardExperiences />
      <UseCases />
      <WhyChoose />
      <CtaBand />
    </>
  )
}

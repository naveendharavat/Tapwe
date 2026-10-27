import { AboutSection } from '../components/home/AboutSection'
import { CardExperiences } from '../components/home/CardExperiences'
import { CardJourney } from '../components/home/CardJourney'
import { CtaBand } from '../components/home/CtaBand'
import { DemoSection } from '../components/home/DemoSection'
import { Hero } from '../components/home/Hero'
import { HowSteps } from '../components/home/HowSteps'
import { Marquee } from '../components/home/Marquee'
import { Pills } from '../components/home/Pills'
import { TeamSection } from '../components/home/TeamSection'
import { UseCases } from '../components/home/UseCases'
import { WaysIn } from '../components/home/WaysIn'
import { WhyChoose } from '../components/home/WhyChoose'
import { WhyTapwe } from '../components/home/WhyTapwe'
import type { IconName } from '../components/ui/icons'
import { useReveal } from '../hooks/useReveal'

const HIGHLIGHTS: Array<[IconName, string]> = [
  'NFC enabled',
  'QR on every card',
  'Durable PVC card',
  'Any destination',
  'Set up by our team',
  'No app for customers',
].map((label): [IconName, string] => ['check', label])

export default function Home() {
  useReveal()
  return (
    <>
      <Hero />
      <Marquee />
      <WhyTapwe />
      <HowSteps />
      <WaysIn />
      <DemoSection />
      <AboutSection />
      <TeamSection />
      <section className="s" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Pills items={HIGHLIGHTS} />
        </div>
      </section>
      <CtaBand />
      <CardExperiences />
      <CardJourney />
      <UseCases />
      <WhyChoose />
      <CtaBand />
    </>
  )
}

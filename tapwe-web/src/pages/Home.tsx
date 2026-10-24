import { Bento } from '../components/home/Bento'
import { CtaBand } from '../components/home/CtaBand'
import { DemoSection } from '../components/home/DemoSection'
import { Hero } from '../components/home/Hero'
import { HowSteps } from '../components/home/HowSteps'
import { Marquee } from '../components/home/Marquee'
import { Showcase } from '../components/home/Showcase'
import { TeamSection } from '../components/home/TeamSection'
import { UseCases } from '../components/home/UseCases'
import { useReveal } from '../hooks/useReveal'

export default function Home() {
  useReveal()
  return (
    <>
      <Hero />
      <Marquee />
      <HowSteps />
      <DemoSection />
      <section className="s alt" id="features">
        <div className="wrap">
          <div className="sh rv">
            <div className="eyebrow">Features</div>
            <h2>Everything a card needs to do</h2>
            <p>One physical card, one permanent link, and the tools to point it wherever your business needs.</p>
          </div>
          <Bento />
        </div>
      </section>
      <UseCases />
      <Showcase />
      <TeamSection />
      <CtaBand />
    </>
  )
}

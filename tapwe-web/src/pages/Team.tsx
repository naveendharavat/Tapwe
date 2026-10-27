import { CtaBand } from '../components/home/CtaBand'
import { TeamSection } from '../components/home/TeamSection'
import { Icon } from '../components/ui/Icon'
import type { IconName } from '../components/ui/icons'
import { revealDelay } from '../lib/cssVars'
import { useReveal } from '../hooks/useReveal'

const VALUES: Array<[IconName, string, string]> = [
  ['sliders', 'We do the setup', 'Businesses should not have to configure anything. We set up every card and keep it updated.'],
  ['phone', 'Simple for customers', 'One tap or scan opens the page. No app and no typing.'],
  ['star', 'Built for in-person businesses', 'Restaurants, shops, salons and professionals who meet people face to face.'],
]

export default function Team() {
  useReveal()
  return (
    <>
      <TeamSection />
      <section className="s alt">
        <div className="wrap">
          <div className="sh rv">
            <div className="eyebrow">How we work</div>
            <h2>What we care about</h2>
          </div>
          <div className="g3">
            {VALUES.map(([icon, title, text], n) => (
              <div key={title} className="card why rv" style={revealDelay(n * 0.08)}>
                <span className="ico">
                  <Icon name={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

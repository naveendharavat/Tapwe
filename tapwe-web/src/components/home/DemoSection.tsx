import { useEffect, useState } from 'react'
import { revealDelay } from '../../lib/cssVars'
import { PhoneMockup } from '../cards/PhoneMockup'
import { SmartCardPreview } from '../cards/SmartCardPreview'
import { Icon } from '../ui/Icon'
import { DEMO_TABS, DEMO_THEME, type DemoKey } from './demo-content'
import { DemoScreen } from './DemoScreens'

const CYCLE_MS = 4200

export function DemoSection() {
  const [current, setCurrent] = useState<DemoKey>('menu')
  const [autoplay, setAutoplay] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!autoplay) return
    const timer = window.setInterval(() => {
      setCurrent((key) => {
        const i = DEMO_TABS.findIndex(([k]) => k === key)
        return DEMO_TABS[(i + 1) % DEMO_TABS.length][0]
      })
    }, CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [autoplay])

  const choose = (key: DemoKey) => {
    setAutoplay(false)
    setCurrent(key)
  }
  const label = DEMO_TABS.find(([k]) => k === current)![1]

  return (
    <section className="s" id="demo">
      <div className="wrap demo">
        <div className="rv">
          <div className="eyebrow">One card, any destination</div>
          <h2>
            We set it up. <span className="gt">You just tap.</span>
          </h2>
          <p className="lead">
            Tell us what the card should open. We configure it and hand it over ready to use. Need a change later? Just
            ask, with no reprinting.
          </p>
          <div className="dtabs" role="tablist" aria-label="Choose a destination to preview">
            {DEMO_TABS.map(([key, text, icon, description]) => (
              <button key={key} type="button" className="dtab" role="tab" aria-selected={current === key} onClick={() => choose(key)}>
                <span className="ico">
                  <Icon name={icon} />
                </span>
                <span>
                  <b>{text}</b>
                  <span className="d">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="stage rv" style={revealDelay(0.1)}>
          <div className="sg">
            <div className="sc">
              <SmartCardPreview theme={DEMO_THEME[current]} />
            </div>
            <PhoneMockup key={current} screenId="dscr" screenClassName="fade">
              <DemoScreen demo={current} />
            </PhoneMockup>
          </div>
          <div className="urlb">
            <Icon name="link" />
            <code>tapwe.example/c/ab12cd</code>
            <span>
              Same link · now opens <b>{label}</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

import { revealDelay } from '../../lib/cssVars'

const STAGES: Array<[title: string, text: string]> = [
  ['Request', 'Fill in the short request form.'],
  ['Configure', 'We set up your page, link and QR.'],
  ['Deliver', 'Your finished card is handed over.'],
  ['Tap', 'Customers connect in one tap.'],
]

export function CardJourney() {
  return (
    <section className="s alt" id="journey">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">The journey</div>
          <h2>How a card gets to you</h2>
        </div>
        <ol className="tl">
          {STAGES.map(([title, text], n) => (
            <li key={title} className="rv" style={revealDelay(n * 0.08)}>
              <span className="tn">{n + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

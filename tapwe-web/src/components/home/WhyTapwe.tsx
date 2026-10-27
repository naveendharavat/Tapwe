import { revealDelay } from '../../lib/cssVars'

const NUMBERS: Array<[value: string, label: string]> = [
  ['1', 'permanent link inside every card'],
  ['2', 'ways in: NFC tap and QR scan'],
  ['0', 'apps for your customers to install'],
  ['0', 'reprints when you change the destination'],
]

export function WhyTapwe() {
  return (
    <section className="s" id="gap">
      <div className="wrap">
        <div className="gapt rv">
          <div className="eyebrow">Why Tapwe</div>
          <h2>
            Paper cards get lost. <span className="gt">A link doesn’t.</span>
          </h2>
          <p>
            A printed card holds a name and a number, then ends up in a drawer. Customers who want your menu, your
            Instagram or a place to leave a review have to search for you.
          </p>
          <p>Tapwe puts one permanent link inside a durable card. A tap or a scan opens exactly what you want them to see.</p>
          <p className="strong">The card stays the same. What it opens can change.</p>
        </div>
        <div className="num4">
          {NUMBERS.map(([value, label], i) => (
            <div key={label} className="rv" style={revealDelay(i * 0.07)}>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

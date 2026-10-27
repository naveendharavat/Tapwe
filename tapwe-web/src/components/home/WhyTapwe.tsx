import { revealDelay } from '../../lib/cssVars'

const NUMBERS: Array<[value: string, label: string]> = [
  ['1', 'permanent link per card'],
  ['2', 'ways in: NFC and QR'],
  ['0', 'apps to install'],
  ['0', 'reprints for changes'],
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
          <p>A printed card ends up in a drawer. A Tapwe card puts your menu, social page or review link one tap away.</p>
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

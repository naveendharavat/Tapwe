import { LinkButton } from '../ui/Button'

export function CtaBand() {
  return (
    <section style={{ padding: '0 0 80px' }}>
      <div className="wrap">
        <div className="band rv">
          <h2>Make Every Connection Count.</h2>
          <p>Bring your business card, digital presence, and customer connections together with Tapwe.</p>
          <div className="row2">
            <LinkButton variant="w" size="lg" to="/request">
              Request a Card
            </LinkButton>
            <LinkButton variant="o" size="lg" to="/how-it-works">
              See How It Works
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

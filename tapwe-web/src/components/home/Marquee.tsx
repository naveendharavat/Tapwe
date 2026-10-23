import { Icon } from '../ui/Icon'

const TAGS = ['Restaurants', 'Cafés', 'Hotels', 'Retail shops', 'Salons', 'Clinics', 'Freelancers', 'Professionals', 'Creators']

export function Marquee() {
  // The row is rendered twice so the -50% translate loops seamlessly.
  const row = (copy: number) =>
    TAGS.map((tag) => (
      <span key={`${copy}-${tag}`}>
        <Icon name="nfc" />
        {tag}
      </span>
    ))
  return (
    <div className="marq" aria-label="Built for restaurants, cafés, hotels, retail shops, salons, clinics, freelancers, professionals and creators">
      <div className="tr" aria-hidden="true">
        {row(1)}
        {row(2)}
      </div>
    </div>
  )
}

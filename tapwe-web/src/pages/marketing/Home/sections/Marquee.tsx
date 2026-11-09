import { Box, Icon } from '../../../../components/ui'

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
    <Box className="marq" aria-label="Built for restaurants, cafés, hotels, retail shops, salons, clinics, freelancers, professionals and creators">
      <Box className="tr" aria-hidden="true">
        {row(1)}
        {row(2)}
      </Box>
    </Box>
  )
}

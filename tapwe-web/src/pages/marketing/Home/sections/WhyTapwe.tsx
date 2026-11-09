import { Box, Card, Section, Typography } from '../../../../components/ui'
import { revealDelay } from '../../../../lib/cssVars'

const NUMBERS: Array<[value: string, label: string]> = [
  ['1', 'permanent link per card'],
  ['2', 'ways in: NFC and QR'],
  ['0', 'apps to install'],
  ['0', 'reprints for changes'],
]

export function WhyTapwe() {
  return (
    <Section id="gap">
      <Box as="header" className="gapt rv">
        <Typography variant="eyebrow">Why Tapwe</Typography>
        <h2>
          Paper cards get lost. <span className="gt">A link doesn’t.</span>
        </h2>
        <p>A printed card ends up in a drawer. A Tapwe card puts your menu, social page or review link one tap away.</p>
        <p className="strong">The card stays the same. What it opens can change.</p>
      </Box>
      <Box className="num4">
        {NUMBERS.map(([value, label], i) => (
          <Card key={label} size="md" className="rv" style={revealDelay(i * 0.07)}>
            <b>{value}</b>
            <span>{label}</span>
          </Card>
        ))}
      </Box>
    </Section>
  )
}

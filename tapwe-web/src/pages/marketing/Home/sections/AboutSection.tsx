import { Box, Section, Typography } from '../../../../components/ui'

export function AboutSection() {
  return (
    <Section id="about">
      <Box className="about rv">
        <Typography variant="eyebrow">Why we exist</Typography>
        <p>
          Every business meets customers <em>in person</em>. Tapwe turns that moment into a{' '}
          <em>menu viewed, a page followed or a review left</em>, with no app and no typing.
        </p>
      </Box>
    </Section>
  )
}

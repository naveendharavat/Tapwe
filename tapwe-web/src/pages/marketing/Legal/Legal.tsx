import { PageHead } from '../../../components/layout/PageHead'
import { SupportPhones } from '../../../components/layout/SupportPhones'
import { Box, Card, Section, Stack, Typography } from '../../../components/ui'

const PAGES = {
  privacy: ['Privacy Policy', 'The Privacy Policy will be published here before launch.'],
  terms: ['Terms and Conditions', 'The Terms and Conditions will be published here before launch.'],
  support: ['Support and contact', 'Questions about a card, an order or your account? Call us and we will help.'],
} as const

export default function Legal({ page }: { page: keyof typeof PAGES }) {
  const [title, lead] = PAGES[page]
  return (
    <>
      <PageHead eyebrow="Tapwe" title={title} lead={lead} />
      {page === 'support' ? (
        <Section className="legal-support">
          <Card size="md" className="support-card">
            <Stack gap={2}>
              <Typography variant="heading-sm">Call us</Typography>
              <Typography variant="muted">
                <SupportPhones />
              </Typography>
            </Stack>
          </Card>
        </Section>
      ) : (
        <Box className="legal-placeholder" aria-hidden="true" />
      )}
    </>
  )
}

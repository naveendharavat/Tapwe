import { PageHead } from '../../../components/layout/PageHead'
import { SupportPhones } from '../../../components/layout/SupportPhones'
import { Card, Container, Section, Stack, Typography } from '../../../components/ui'
import { PRIVACY_POLICY, TERMS, type LegalPage } from '../../../content/legal'

const PAGES = { privacy: PRIVACY_POLICY, terms: TERMS } as const

function LegalArticle({ page }: { page: LegalPage }) {
  return (
    <>
      <PageHead eyebrow="Tapwe" title={page.title} lead={page.lead} />
      <Container>
        <article className="legal">
          <p className="updated">Last updated {page.updated}</p>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}
          <h2>Contact</h2>
          <p>
            Call <SupportPhones />.
          </p>
        </article>
      </Container>
    </>
  )
}

export default function Legal({ page }: { page: keyof typeof PAGES | 'support' }) {
  if (page !== 'support') return <LegalArticle page={PAGES[page]} />
  return (
    <>
      <PageHead eyebrow="Tapwe" title="Support and contact" lead="Questions about a card, an order or your account? Call us and we will help." />
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
    </>
  )
}

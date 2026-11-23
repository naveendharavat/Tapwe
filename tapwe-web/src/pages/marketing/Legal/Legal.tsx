import { PageHead } from '../../../components/layout/PageHead'
import { SupportPhones } from '../../../components/layout/SupportPhones'
import { ContactSection } from '../../../components/marketing/ContactSection'
import { Container } from '../../../components/ui'
import { usePageMeta } from '../../../hooks/usePageMeta'
import { useReveal } from '../../../hooks/useReveal'
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
  return <ContactPage />
}

function ContactPage() {
  usePageMeta('Contact us', 'Call or WhatsApp Tapwe to order a card or ask anything.')
  useReveal()
  return <ContactSection titleAs="h1" />
}

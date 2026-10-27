import { PageHead } from '../components/layout/PageHead'
import { SupportPhones } from '../components/layout/SupportPhones'

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
        <div style={{ padding: '40px 0 120px' }}>
          <div className="wrap">
            <div className="card" style={{ padding: 24, maxWidth: 480 }}>
              <h2 style={{ fontSize: 18 }}>Call us</h2>
              <p className="muted" style={{ marginTop: 8 }}>
                <SupportPhones />
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: 240 }} />
      )}
    </>
  )
}

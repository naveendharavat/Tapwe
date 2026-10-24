import { PageHead } from '../components/layout/PageHead'

const PAGES = {
  privacy: ['Privacy Policy', 'The Privacy Policy will be published here before launch.'],
  terms: ['Terms and Conditions', 'The Terms and Conditions will be published here before launch.'],
  support: ['Support and contact', 'Support and contact details will be added here once available.'],
} as const

export default function Legal({ page }: { page: keyof typeof PAGES }) {
  const [title, lead] = PAGES[page]
  return (
    <>
      <PageHead eyebrow="Tapwe" title={title} lead={lead} />
      <div style={{ height: 240 }} />
    </>
  )
}

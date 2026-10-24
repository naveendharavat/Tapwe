import { isAxiosError } from 'axios'
import { useEffect, type ReactNode } from 'react'
import { useParams } from 'react-router'
import { initials } from '../lib/initials'
import { Button, LinkButton } from '../components/ui/Button'
import { EmptyState, Skeleton } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import type { IconName } from '../components/ui/icons'
import { profileVCard } from '../lib/vcard'
import type { BusinessProfile } from '../services/profile/profile.types'
import { usePublicCard } from '../services/public/public.queries'

function Centered({ children }: { children: ReactNode }) {
  return <div className="empty-page">{children}</div>
}

export default function PublicCard() {
  const { code = '' } = useParams()
  const card = usePublicCard(code.toLowerCase())

  useEffect(() => {
    if (card.data?.state === 'redirect') window.location.replace(card.data.url)
  }, [card.data])

  if (card.isPending || card.data?.state === 'redirect') {
    return (
      <Centered>
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <p className="muted">Opening…</p>
          <Skeleton rows={2} label="Opening the card’s page" />
        </div>
      </Centered>
    )
  }

  if (card.isError) {
    const notFound = isAxiosError(card.error) && card.error.response?.status === 404
    return (
      <Centered>
        <EmptyState
          icon="alert"
          title={notFound ? 'Card not found' : 'We couldn’t open this card'}
          description={notFound ? 'This card link doesn’t exist or is no longer in use.' : 'Check your connection and try again.'}
          actions={
            <LinkButton variant="s" to="/">
              Go to Tapwe
            </LinkButton>
          }
        />
      </Centered>
    )
  }

  if (card.data.state === 'inactive') {
    return (
      <Centered>
        <EmptyState icon="card" title="This card isn’t active yet" description="Its owner is still setting it up. Please try again later." />
      </Centered>
    )
  }

  return <ProfilePage profile={card.data.profile} />
}

function ProfilePage({ profile }: { profile: BusinessProfile }) {
  const name = profile.businessName || 'Business profile'
  const actions: Array<[IconName, string, string]> = []
  if (profile.phone) actions.push(['phone', 'Call', `tel:+91${profile.phone}`])
  if (profile.businessName) actions.push(['pin', 'Map', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.businessName)}`])
  if (profile.website) actions.push(['globe', 'Website', profile.website])

  const saveContact = () => {
    const blob = new Blob([profileVCard(profile)], { type: 'text/vcard' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${name.replace(/[^\w-]+/g, '-').toLowerCase()}.vcf`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="pub page">
      <div className="box">
        <div className="av" aria-hidden="true">
          {initials(name)}
        </div>
        <h1>{name}</h1>
        {profile.description && <p className="sb">{profile.description}</p>}
        {actions.length > 0 && (
          <div className="lk">
            {actions.map(([icon, label, href]) => (
              <a key={label} href={href} target={icon === 'phone' ? undefined : '_blank'} rel="noopener noreferrer">
                <Icon name={icon} />
                {label}
              </a>
            ))}
          </div>
        )}
        <Button variant="p" size="lg" className="save" onClick={saveContact}>
          <Icon name="user" />
          Save contact
        </Button>
        <p className="by">
          powered by <b>Tapwe</b>
        </p>
      </div>
    </main>
  )
}

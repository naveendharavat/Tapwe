import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { initials } from '../../lib/initials'

interface PhoneMockupProps {
  children: ReactNode
  /** Id and class on the screen element, e.g. for the demo's fade animation. */
  screenId?: string
  screenClassName?: string
}

export function PhoneMockup({ children, screenId, screenClassName }: PhoneMockupProps) {
  return (
    <div className="phone" role="img" aria-label="Smartphone showing a digital business page">
      <div className="notch" />
      <div id={screenId} className={['scr', screenClassName].filter(Boolean).join(' ')}>{children}</div>
    </div>
  )
}

const PROFILE_LINKS: Array<[IconName, string]> = [
  ['phone', 'Call'],
  ['pin', 'Map'],
  ['at', 'Social'],
  ['globe', 'Website'],
]

/** The design's digital-profile phone screen; name/description can be overridden for live previews. */
export function ProfileScreen({
  name = 'Your Business',
  description = 'Café · Open until 10 pm',
}: {
  name?: string
  description?: string
}) {
  return (
    <>
      <div className="av">{initials(name)}</div>
      <div className="nm">{name}</div>
      <div className="sb">{description}</div>
      <div className="lk">
        {PROFILE_LINKS.map(([icon, label]) => (
          <div key={label}>
            <Icon name={icon} />
            {label}
          </div>
        ))}
      </div>
      <div className="fb">
        <Icon name="star" />
        Leave feedback
      </div>
      <div className="pbtn">
        <Icon name="user" />
        Save contact
      </div>
    </>
  )
}

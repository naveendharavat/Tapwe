import { formatPhone, SUPPORT_PHONES, telHref } from '../../content/contact'

/** Both support numbers as tap-to-call links. */
export function SupportPhones({ separator = ' or ' }: { separator?: string }) {
  return SUPPORT_PHONES.map((phone, i) => (
    <span key={phone}>
      {i > 0 && separator}
      <a href={telHref(phone)} style={{ whiteSpace: 'nowrap' }}>
        {formatPhone(phone)}
      </a>
    </span>
  ))
}

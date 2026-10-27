/** Tapwe's support numbers (Indian mobiles), shown wherever customers might have a question. */
export const SUPPORT_PHONES = ['7794928975', '7569960755'] as const

export const telHref = (phone: string) => `tel:+91${phone}`

/** "+91 77949 28975" */
export const formatPhone = (phone: string) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`

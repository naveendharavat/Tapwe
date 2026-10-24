import * as Y from 'yup'
import type { CardStatus, DestinationType } from '../services/cards/cards.types'

export const msg = {
  name: 'Enter your name.',
  email: 'Enter your email address.',
  emailBad: 'Enter a valid email address.',
  pw: 'Enter a password.',
  pwLen: 'Use at least 8 characters.',
  url: 'Enter a full link starting with https://',
  phone: 'Enter your phone number.',
  phoneBad: 'Enter a valid 10-digit mobile number.',
} as const

const PHONE_RE = /^[6-9]\d{9}$/

export function normalizePhone(value: unknown): string {
  const digits = String(value ?? '').replace(/[\s\-()]/g, '')
  return digits.length > 10 ? digits.replace(/^(\+91|91|0)/, '') : digits
}

export function isHttpUrl(value: string): boolean {
  try {
    return /^https?:$/.test(new URL(value).protocol)
  } catch {
    return false
  }
}

const email = () => Y.string().trim().required(msg.email).email(msg.emailBad)
const requiredName = () => Y.string().trim().required(msg.name)
const optionalPhone = () =>
  Y.string()
    .transform((v: string) => (v.trim() === '' ? '' : normalizePhone(v)))
    .test('phone', msg.phoneBad, (v) => !v || PHONE_RE.test(v))
const optionalUrl = () =>
  Y.string()
    .trim()
    .test('url', msg.url, (v) => !v || isHttpUrl(v))

export const signInSchema = Y.object({
  email: email(),
  password: Y.string().required(msg.pw),
})
export type SignInValues = Y.InferType<typeof signInSchema>

export const signUpSchema = Y.object({
  name: requiredName(),
  email: email(),
  password: Y.string().required(msg.pw).min(8, msg.pwLen),
})
export type SignUpValues = Y.InferType<typeof signUpSchema>

export const requestSchema = Y.object({
  name: requiredName(),
  businessName: Y.string().trim().required('Enter your business name.'),
  email: email(),
  phone: Y.string()
    .transform(normalizePhone)
    .required(msg.phone)
    .matches(PHONE_RE, { message: msg.phoneBad, excludeEmptyString: true }),
  businessType: Y.string().required('Choose your business type.'),
  quantity: Y.string().required('Choose how many cards.'),
  destinations: Y.array().of(Y.string().required()).min(1, 'Choose at least one option.').required(),
  city: Y.string().trim().default(''),
  note: Y.string().trim().default(''),
  agreed: Y.boolean().oneOf([true], 'Please confirm to continue.').required('Please confirm to continue.'),
})
export type RequestValues = Y.InferType<typeof requestSchema>

export const profileSchema = Y.object({
  businessName: Y.string().trim().default(''),
  description: Y.string().trim().default(''),
  phone: optionalPhone().default(''),
  website: optionalUrl().default(''),
})
export type ProfileValues = Y.InferType<typeof profileSchema>

export const settingsSchema = Y.object({
  name: requiredName(),
  email: email(),
})
export type SettingsValues = Y.InferType<typeof settingsSchema>

export const changeRequestSchema = Y.object({
  message: Y.string().trim().required('Tell us what the card should open.').max(500),
})
export type ChangeRequestValues = Y.InferType<typeof changeRequestSchema>

const CARD_STATUSES: readonly CardStatus[] = ['draft', 'active', 'paused']
const DESTINATION_TYPES: readonly DestinationType[] = ['profile', 'url', 'menu', 'form']

export const adminCardSchema = Y.object({
  name: Y.string().trim().required('Give the card a name.').max(120, 'Keep the name under 120 characters.'),
  ownerEmail: Y.string()
    .trim()
    .default('')
    .test('email', msg.emailBad, (v) => !v || Y.string().email().isValidSync(v)),
  status: Y.mixed<CardStatus>().oneOf(CARD_STATUSES).required(),
  destinationType: Y.mixed<DestinationType>().oneOf(DESTINATION_TYPES).required(),
  destinationUrl: Y.string()
    .trim()
    .default('')
    .when('destinationType', {
      is: 'profile',
      otherwise: (s) => s.test('url', msg.url, (v) => !!v && isHttpUrl(v)),
    }),
})
export type AdminCardValues = Y.InferType<typeof adminCardSchema>

/** `{ field: firstMessage }` for every invalid field, or `{}` when valid. */
export function firstErrors(schema: Y.AnyObjectSchema, values: unknown): Record<string, string> {
  try {
    schema.validateSync(values, { abortEarly: false })
    return {}
  } catch (error) {
    if (!(error instanceof Y.ValidationError)) throw error
    const errors: Record<string, string> = {}
    for (const issue of error.inner.length ? error.inner : [error]) {
      if (issue.path && !errors[issue.path]) errors[issue.path] = issue.message
    }
    return errors
  }
}

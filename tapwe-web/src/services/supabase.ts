import { createClient, isAuthApiError, type PostgrestError } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'missing-anon-key',
)

/** The public link written to every NFC chip and QR code. */
export function cardUrl(code: string): string {
  const base = import.meta.env.VITE_PUBLIC_CARD_BASE_URL ?? window.location.origin
  return `${base.replace(/\/$/, '')}/c/${code}`
}

/** An error whose message is written for the person using the app. */
export class UserFacingError extends Error {}

export async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new UserFacingError('Your session has expired. Please sign in again.')
  return data.session.user.id
}

/** Returns `data` as `T`, or throws the Supabase error so React Query sees a failure. */
export function unwrap<T = unknown>({ data, error }: { data: unknown; error: PostgrestError | null }): T {
  if (error) throw error
  return data as T
}

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect email or password.',
  user_already_exists: 'An account with this email already exists. Sign in instead.',
  email_exists: 'That email is already used by another account.',
  weak_password: 'Use at least 8 characters.',
  over_request_rate_limit: 'Too many attempts. Please wait a minute and try again.',
}

const isPostgrestError = (error: unknown): error is PostgrestError =>
  typeof error === 'object' && error !== null && 'code' in error && 'details' in error

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof UserFacingError) return error.message
  if (isAuthApiError(error)) return (error.code && AUTH_MESSAGES[error.code]) || error.message || fallback
  if (isPostgrestError(error)) {
    // P0001 is a message our own database functions raise for people to read.
    if (error.code === 'P0001') return error.message
    if (!error.code && /fetch/i.test(error.message)) return 'Could not reach Tapwe. Check your connection and try again.'
  }
  if (error instanceof TypeError) return 'Could not reach Tapwe. Check your connection and try again.'
  return fallback
}

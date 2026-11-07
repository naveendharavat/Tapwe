import { supabase, unwrap, UserFacingError } from '../supabase'
import type { SignInRequest, SignUpRequest, UpdateMeRequest, User } from './auth.types'

export class AuthService {
  /** The signed-in account, or null when nobody is signed in. */
  static async me(): Promise<User | null> {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    return AuthService.load(data.session.user.id)
  }

  static async signIn({ email, password }: SignInRequest): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) throw error
    return AuthService.load(data.user.id)
  }

  static async signUp({ name, email, password }: SignUpRequest): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name.trim() } },
    })
    if (error) throw error
    if (!data.session) throw new UserFacingError('Check your inbox to confirm your email, then sign in.')
    return AuthService.load(data.session.user.id)
  }

  /** A new email only takes effect once its owner clicks the confirmation link Supabase sends. */
  static async updateMe({ name, email }: UpdateMeRequest): Promise<{ user: User; emailPending: boolean }> {
    const { data, error } = await supabase.auth.updateUser({ email: email?.trim().toLowerCase(), data: { name: name?.trim() } })
    if (error) throw error
    return { user: await AuthService.load(data.user.id), emailPending: !!data.user.new_email }
  }

  /** Emails a link that opens /reset-password with a short-lived session. Succeeds even for unknown emails. */
  static async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  static async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  static async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  private static async load(id: string): Promise<User> {
    return unwrap<User>(await supabase.from('users').select('id, name, email, role').eq('id', id).single())
  }
}

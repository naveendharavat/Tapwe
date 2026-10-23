import { createContext, useContext } from 'react'
import type { SignInRequest, SignUpRequest, User } from '../services/auth/auth.types'

export interface AuthState {
  user: User | null
  isLoading: boolean
  signIn: (body: SignInRequest) => Promise<User>
  signUp: (body: SignUpRequest) => Promise<User>
  signOut: () => void
  setUser: (user: User) => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>.')
  return auth
}

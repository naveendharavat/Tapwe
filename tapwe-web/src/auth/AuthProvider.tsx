import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthService } from '../services/auth/auth.service'
import type { SignInRequest, SignUpRequest, User } from '../services/auth/auth.types'
import { supabase } from '../services/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AuthService.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))

    // Fires when the session ends anywhere: sign-out in another tab or a refresh token that no longer works.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_OUT') return
      setUser(null)
      queryClient.clear()
    })
    return () => data.subscription.unsubscribe()
  }, [queryClient])

  const start = useCallback((signedIn: User) => {
    setUser(signedIn)
    return signedIn
  }, [])

  const signIn = useCallback((body: SignInRequest) => AuthService.signIn(body).then(start), [start])
  const signUp = useCallback((body: SignUpRequest) => AuthService.signUp(body).then(start), [start])
  const signOut = useCallback(() => {
    void AuthService.signOut()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, setUser }),
    [user, isLoading, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

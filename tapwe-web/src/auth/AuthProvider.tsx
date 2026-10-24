import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onUnauthorized } from '../services/api'
import { AuthService } from '../services/auth/auth.service'
import type { AuthResponse, SignInRequest, SignUpRequest, User } from '../services/auth/auth.types'
import { AuthContext } from './auth-context'
import { clearToken, getToken, setToken } from './token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => getToken() !== null)

  useEffect(() => {
    if (!getToken()) return
    AuthService.me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(
    () =>
      onUnauthorized(() => {
        setUser(null)
        queryClient.clear()
      }),
    [queryClient],
  )

  const start = useCallback((auth: AuthResponse) => {
    setToken(auth.token)
    setUser(auth.user)
    return auth.user
  }, [])

  const signIn = useCallback((body: SignInRequest) => AuthService.signIn(body).then(start), [start])
  const signUp = useCallback((body: SignUpRequest) => AuthService.signUp(body).then(start), [start])
  const signOut = useCallback(() => {
    clearToken()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, setUser }),
    [user, isLoading, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

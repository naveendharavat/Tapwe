import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Skeleton } from '../components/ui/EmptyState'
import { useAuth } from './auth-context'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="auth">
        <div className="box">
          <Skeleton label="Loading your account" />
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  return children
}

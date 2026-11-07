import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ADMIN_NAV, OWNER_NAV } from './components/layout/nav'
import { MarketingLayout } from './components/layout/MarketingLayout'
import { AdminCardRequests } from './pages/admin/AdminCardRequests'
import { AdminCards } from './pages/admin/AdminCards'
import { AdminChangeRequests } from './pages/admin/AdminChangeRequests'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminUsers } from './pages/admin/AdminUsers'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { SignIn } from './pages/auth/SignIn'
import { SignUp } from './pages/auth/SignUp'
import { Analytics } from './pages/dashboard/Analytics'
import { Destinations } from './pages/dashboard/Destinations'
import { MyCards } from './pages/dashboard/MyCards'
import { Overview } from './pages/dashboard/Overview'
import { Profile } from './pages/dashboard/Profile'
import { QrCode } from './pages/dashboard/QrCode'
import { RequestCard } from './pages/dashboard/RequestCard'
import { Settings } from './pages/dashboard/Settings'
import { Features } from './pages/marketing/Features'
import { Home } from './pages/marketing/Home'
import { HowItWorks } from './pages/marketing/HowItWorks'
import { Legal } from './pages/marketing/Legal'
import { Pricing } from './pages/marketing/Pricing'
import { Request } from './pages/marketing/Request'
import { Team } from './pages/marketing/Team'
import { PublicCard } from './pages/public/PublicCard'

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="team" element={<Team />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="request" element={<Request />} />
          <Route path="privacy" element={<Legal page="privacy" />} />
          <Route path="terms" element={<Legal page="terms" />} />
          <Route path="support" element={<Legal page="support" />} />
        </Route>

        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="c/:code" element={<PublicCard />} />

        <Route
          path="app"
          element={
            <RequireAuth role="owner">
              <DashboardLayout nav={OWNER_NAV} label="Dashboard" settingsPath="/app/settings" />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="cards" element={<MyCards />} />
          <Route path="create" element={<RequestCard />} />
          <Route path="qr" element={<QrCode />} />
          <Route path="profile" element={<Profile />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="admin"
          element={
            <RequireAuth role="admin">
              <DashboardLayout nav={ADMIN_NAV} label="Admin" />
            </RequireAuth>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="cards" element={<AdminCards />} />
          <Route path="card-requests" element={<AdminCardRequests />} />
          <Route path="change-requests" element={<AdminChangeRequests />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ADMIN_NAV, OWNER_NAV } from './components/layout/nav'
import { MarketingLayout } from './components/layout/MarketingLayout'

const Home = lazy(() => import('./pages/Home'))
const Features = lazy(() => import('./pages/Features'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Team = lazy(() => import('./pages/Team'))
const Request = lazy(() => import('./pages/Request'))
const Legal = lazy(() => import('./pages/Legal'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const PublicCard = lazy(() => import('./pages/PublicCard'))
const Overview = lazy(() => import('./pages/dashboard/Overview'))
const MyCards = lazy(() => import('./pages/dashboard/MyCards'))
const RequestCard = lazy(() => import('./pages/dashboard/RequestCard'))
const QrCode = lazy(() => import('./pages/dashboard/QrCode'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))
const Destinations = lazy(() => import('./pages/dashboard/Destinations'))
const Analytics = lazy(() => import('./pages/dashboard/Analytics'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminCards = lazy(() => import('./pages/admin/AdminCards'))
const AdminCardRequests = lazy(() => import('./pages/admin/AdminCardRequests'))
const AdminChangeRequests = lazy(() => import('./pages/admin/AdminChangeRequests'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

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

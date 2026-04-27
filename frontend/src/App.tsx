import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { HamburgerSidebar } from './components/layout/HamburgerSidebar'
import { Sidebar } from './components/layout/Sidebar'
import { FloatingMicButton } from './components/FloatingMicButton'
import { AppProvider } from './context/AppContext'
import { SensorProvider } from './context/SensorContext'
import { Toaster } from 'react-hot-toast'
import { BatchProvider } from './context/BatchContext'
import { Dashboard } from './pages/Dashboard'
import { IoTMonitoring } from './pages/IoTMonitoring'
import { ColdStorage } from './pages/ColdStorage'
import { ShipmentGPS } from './pages/ShipmentGPS'
import { SpoilageDetection } from './pages/SpoilageDetection'
import { Traceability } from './pages/Traceability'
import { CloudAlerts } from './pages/CloudAlerts'
import { ShelfLife } from './pages/ShelfLife'
import { LiveMonitor } from './pages/LiveMonitor'
import { Marketplace } from './pages/Marketplace'
import { KisanConnect } from './pages/KisanConnect'
import { FarmAnalytics } from './pages/FarmAnalytics'
import { AICropAdvisor } from './pages/AICropAdvisor'
import { Profile } from './pages/Profile.jsx'
import { ConsumerTraceView } from './pages/ConsumerTraceView'

import { AIChatbot } from './components/AIChatbot'
import { Spinner } from './components/ui/spinner'
import { ErrorBoundary } from './components/ErrorBoundary'

function DashboardLayout({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pb-20 lg:pb-0">
      <Navbar userName={userName} />
      <HamburgerSidebar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:flex lg:gap-6">
        <Sidebar />
        <section className="flex-1 min-w-0">
          <Outlet />
        </section>
      </main>

      <BottomNav activeTab="dashboard" setActiveTab={() => {}} />
      <AIChatbot />
      <FloatingMicButton />
    </div>
  )
}

function App() {
  const { user, loading, isAuthenticated, signup, login, googleLogin, logout } = useAuth()
  const [authMode, setAuthMode] = useState<'landing' | 'signup' | 'signin'>('landing')

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const isPublicTraceRoute = window.location.pathname.startsWith('/trace/');

  if (!isAuthenticated && !isPublicTraceRoute) {
    if (authMode === 'signup') {
      return (
        <SignUp
          onSignUp={signup}
          onGoogleLogin={googleLogin}
          onSwitchToSignIn={() => setAuthMode('signin')}
        />
      )
    }
    if (authMode === 'signin') {
      return (
        <SignIn
          onSignIn={login}
          onGoogleLogin={googleLogin}
          onSwitchToSignUp={() => setAuthMode('signup')}
        />
      )
    }
    return (
      <LandingPage
        onLogin={() => setAuthMode('signin')}
        onSignUp={() => setAuthMode('signup')}
      />
    )
  }

  const userName = user?.fullName || 'Guest'

  return (
    <AppProvider>
      <BatchProvider>
        <SensorProvider>
          <Router>
            <ErrorBoundary>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    borderRadius: '16px',
                    padding: '14px 20px',
                    fontWeight: 600,
                    fontSize: '13px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  },
                }}
              />

              <Routes>
                {/* ═══ PUBLIC CONSUMER ROUTE ═══ */}
                <Route path="/trace/:batchId" element={<ConsumerTraceView />} />

                {/* ═══ PRIVATE DASHBOARD ROUTES ═══ */}
                {isAuthenticated ? (
                  <>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardLayout userName={userName} />}>
                      <Route index element={<Dashboard />} />
                      <Route path="iot-monitoring" element={<IoTMonitoring />} />
                      <Route path="cold-storage" element={<ColdStorage />} />
                      <Route path="shipment-gps" element={<ShipmentGPS />} />
                      <Route path="spoilage-detection" element={<SpoilageDetection />} />
                      <Route path="traceability" element={<Traceability />} />
                      <Route path="cloud-alerts" element={<CloudAlerts />} />
                      <Route path="shelf-life" element={<ShelfLife />} />
                      <Route path="live-monitor" element={<LiveMonitor />} />
                      
                      {/* Agriculture Module Routes */}
                      <Route path="market" element={<Marketplace />} />
                      <Route path="community" element={<KisanConnect />} />
                      <Route path="analytics" element={<FarmAnalytics />} />
                      <Route path="advisor" element={<AICropAdvisor />} />
                      
                      <Route path="profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                  </>
                ) : (
                  // If unauthenticated and they try to go somewhere else, bounce them back
                  <Route path="*" element={<Navigate to="/" replace onClick={() => window.location.href = '/'} />} />
                )}
              </Routes>
            </ErrorBoundary>
          </Router>
        </SensorProvider>
      </BatchProvider>
    </AppProvider>
  )
}

export default App

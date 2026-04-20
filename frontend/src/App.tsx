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
import { BatchProvider } from './context/BatchContext'
import { Dashboard } from './pages/Dashboard'
import { IoTMonitoring } from './pages/IoTMonitoring'
import { ColdStorage } from './pages/ColdStorage'
import { ShipmentGPS } from './pages/ShipmentGPS'
import { SpoilageDetection } from './pages/SpoilageDetection'
import { Traceability } from './pages/Traceability'
import { CloudAlerts } from './pages/CloudAlerts'
import { StorageAnalytics } from './pages/StorageAnalytics'
import { ShelfLife } from './pages/ShelfLife'
import { Profile } from './pages/Profile.jsx'

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

  if (!isAuthenticated) {
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

  const userName = user?.fullName || 'User'

  return (
    <AppProvider>
      <BatchProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardLayout userName={userName} />}>
                <Route index element={<Dashboard />} />
                <Route path="iot-monitoring" element={<IoTMonitoring />} />
                <Route path="cold-storage" element={<ColdStorage />} />
                <Route path="shipment-gps" element={<ShipmentGPS />} />
                <Route path="spoilage-detection" element={<SpoilageDetection />} />
                <Route path="traceability" element={<Traceability />} />
                <Route path="cloud-alerts" element={<CloudAlerts />} />
                <Route path="storage-analytics" element={<StorageAnalytics />} />
                <Route path="shelf-life" element={<ShelfLife />} />
                <Route path="profile" element={<Profile />} />
                

                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Router>
      </BatchProvider>
    </AppProvider>
  )
}

export default App

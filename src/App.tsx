import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { HamburgerSidebar, HamburgerButton } from './components/layout/HamburgerSidebar'
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
import { CropDoctor } from './pages/CropDoctor'
import { Irrigation } from './pages/Irrigation'
import { Marketplace } from './pages/Marketplace'
import { Community } from './pages/Community'
import { Analytics } from './pages/Analytics'
import { CropAdvisor } from './pages/CropAdvisor'
import { AIChatbot } from './components/AIChatbot'
import { Spinner } from './components/ui/spinner'
import { ErrorBoundary } from './components/ErrorBoundary'

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Navbar userName="User" />
      
      {/* Hamburger Sidebar for Mobile */}
      <HamburgerSidebar />
      
      <main className="max-w-7xl mx-auto px-4 py-6 lg:flex lg:gap-8">
        {/* Sidebar for Desktop - Keep original sidebar for large screens */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <section className="flex-1">
          <Outlet />
        </section>
      </main>

      <BottomNav activeTab="dashboard" setActiveTab={() => {}} />
      <AIChatbot />
      <FloatingMicButton />
    </div>
  )
}

// Main authenticated dashboard component
function AuthenticatedDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
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
        
        {/* Legacy routes - redirect to new ones */}
        <Route path="doctor" element={<Navigate to="/dashboard/spoilage-detection" replace />} />
        <Route path="irrigation" element={<Navigate to="/dashboard/cold-storage" replace />} />
        <Route path="market" element={<Navigate to="/dashboard/shipment-gps" replace />} />
        <Route path="community" element={<Navigate to="/dashboard/traceability" replace />} />
        <Route path="analytics" element={<Navigate to="/dashboard/storage-analytics" replace />} />
        <Route path="advisor" element={<Navigate to="/dashboard/shelf-life" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  const { user, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage onLogin={login} />
  }

  return (
    <AppProvider>
      <BatchProvider>
        <Router>
          <ErrorBoundary>
            <AuthenticatedDashboard />
          </ErrorBoundary>
        </Router>
      </BatchProvider>
    </AppProvider>
  )
}

export default App

import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { CropDoctor } from './pages/CropDoctor'
import { Irrigation } from './pages/Irrigation'
import { Marketplace } from './pages/Marketplace'
import { Community } from './pages/Community'
import { Analytics } from './pages/Analytics'
import { CropAdvisor } from './pages/CropAdvisor'
import { AIChatbot } from './components/AIChatbot'
import { VoiceFAB } from './components/VoiceFAB'
import { Spinner } from './components/ui/spinner'

function App() {
  const { user, loading, login } = useAuth()
  const [activeTab, setActiveTab] = useState('home')

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-primary font-bold animate-pulse">Namaste... Planting Seeds of Innovation 🌱</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage onLogin={login} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />
      case 'doctor':
        return <CropDoctor />
      case 'irrigation':
        return <Irrigation />
      case 'market':
        return <Marketplace />
      case 'community':
        return <Community />
      case 'analytics':
        return <Analytics />
      case 'advisor':
        return <CropAdvisor />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Navbar userName={user?.displayName || 'Farmer Ji'} />

      <main className="max-w-7xl mx-auto px-4 py-6 lg:flex lg:gap-8">
        {/* Sidebar Nav for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 space-y-2 sticky top-24 h-fit">
          <SidebarButton
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            label="Home Dashboard"
            icon="🏠"
          />
          <SidebarButton
            active={activeTab === 'doctor'}
            onClick={() => setActiveTab('doctor')}
            label="AI Crop Doctor"
            icon="🔬"
          />
          <SidebarButton
            active={activeTab === 'irrigation'}
            onClick={() => setActiveTab('irrigation')}
            label="Smart Irrigation"
            icon="💧"
          />
          <SidebarButton
            active={activeTab === 'market'}
            onClick={() => setActiveTab('market')}
            label="Mandi Marketplace"
            icon="💰"
          />
          <SidebarButton
            active={activeTab === 'community'}
            onClick={() => setActiveTab('community')}
            label="Kisan Connect"
            icon="👥"
          />
          <SidebarButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            label="Farm Analytics"
            icon="📊"
          />
          <SidebarButton
            active={activeTab === 'advisor'}
            onClick={() => setActiveTab('advisor')}
            label="AI Crop Advisor"
            icon="🧠"
          />
        </aside>

        <section className="flex-1">
          {renderContent()}
        </section>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <AIChatbot />
      <VoiceFAB />
    </div>
  )
}

function SidebarButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-bold ${active
        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
        : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default App

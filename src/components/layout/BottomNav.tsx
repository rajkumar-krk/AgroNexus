import { Home, Camera, Droplets, ShoppingBag, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

interface BottomNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'doctor', icon: Camera, label: 'Crop Doctor' },
    { id: 'irrigation', icon: Droplets, label: 'Irrigation' },
    { id: 'market', icon: ShoppingBag, label: 'Market' },
    { id: 'community', icon: Users, label: 'Community' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 flex justify-between items-center z-50 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors duration-200",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-200",
              isActive && "bg-primary/10"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

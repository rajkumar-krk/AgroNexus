import { Home, Microscope, Droplets, ShoppingBag, BarChart3 } from 'lucide-react'

const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'doctor', label: 'Doctor', icon: Microscope },
    { id: 'irrigation', label: 'Water', icon: Droplets },
    { id: 'market', label: 'Mandi', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border lg:hidden">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'text-primary scale-105'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                            {isActive && (
                                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

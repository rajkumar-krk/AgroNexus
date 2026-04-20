import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Activity, Snowflake, Truck, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = [
    { id: '/dashboard', label: 'Home', icon: Home },
    { id: '/dashboard/iot-monitoring', label: 'IoT', icon: Activity },
    { id: '/dashboard/cold-storage', label: 'Storage', icon: Snowflake },
    { id: '/dashboard/shipment-gps', label: 'GPS', icon: Truck },
    { id: '/dashboard/storage-analytics', label: 'Analytics', icon: BarChart3 },
]

export function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-border/60 lg:hidden safe-area-pb">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.id || (tab.id === '/dashboard' && location.pathname === '/')
                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => navigate(tab.id)}
                            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'text-emerald-600'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-1 w-8 h-1 rounded-full bg-emerald-500"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                        </motion.button>
                    )
                })}
            </div>
        </nav>
    )
}

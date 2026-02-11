import { Menu, User, Bell, Mic, Wifi, WifiOff } from 'lucide-react'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

export function Navbar({ userName = 'Ramesh Ji' }: { userName?: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <header className="sticky top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-40 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/5">
          <Menu className="text-primary" />
        </Button>
        <div className="hidden lg:flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl text-primary leading-none">AgriSmart</span>
            <span className="text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">Smart Nature</span>
          </div>
        </div>
        <div className="flex flex-col lg:ml-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Bhilwara, Rajasthan</span>
            {!isOnline && (
              <div className="flex items-center gap-1 bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                <WifiOff size={10} />
                <span className="text-[8px] font-black uppercase">Offline</span>
              </div>
            )}
            {isOnline && (
              <div className="flex items-center gap-1 bg-sprout/10 text-primary px-2 py-0.5 rounded-full">
                <Wifi size={10} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Sync Active</span>
              </div>
            )}
          </div>
          <span className="text-sm font-bold text-primary leading-none lg:text-lg">Namaste, {userName}! 🙏</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <Button variant="outline" size="icon" className="rounded-xl bg-white border-2 border-border text-primary hover:border-primary/50 relative hidden sm:flex">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hidden sm:flex">
          <Mic size={20} />
        </Button>
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden bg-white shadow-sm cursor-pointer hover:border-primary transition-colors">
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-primary">
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  )
}
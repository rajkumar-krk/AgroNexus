import { Button } from '../ui/button'
import { Sprout, Bell, LogOut } from 'lucide-react'

export function Navbar({ userName }: { userName: string }) {
    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sprout size={20} className="text-white" />
                    </div>
                    <span className="text-lg font-heading font-black hidden sm:block">AgriSmart</span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative rounded-xl">
                        <Bell size={18} />
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    <div className="flex items-center gap-2 pl-2 border-l border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold hidden sm:block">{userName}</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

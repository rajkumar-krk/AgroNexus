import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Sprout, Bell, Search } from 'lucide-react'
import { HamburgerButton } from './HamburgerSidebar'
import { motion } from 'framer-motion'

export function Navbar({ userName }: { userName: string }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 8)
                    ticking = false
                })
                ticking = true
            }
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const initials = userName
        .split(' ')
        .map(n => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-border/60' 
                    : 'bg-white/60 backdrop-blur-md border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Left — Logo + Hamburger */}
                <div className="flex items-center gap-3">
                    <HamburgerButton />
                    <div className="flex items-center gap-2.5">
                        <motion.div 
                            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Sprout size={20} className="text-white" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-heading font-extrabold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                                AgroNexus
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center — Search (desktop only) */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                            type="text"
                            placeholder="Search batches, sensors, alerts..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon" className="relative rounded-xl w-10 h-10 hover:bg-muted/60">
                            <Bell size={18} />
                            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                                3
                            </span>
                        </Button>
                    </motion.div>

                    <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-border/60">
                        <motion.div 
                            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-500/15 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {initials}
                        </motion.div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold leading-none">{userName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Farmer</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

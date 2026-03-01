import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Sprout, ArrowRight, Leaf, MapPin, Radio, ThermometerSun, X, Activity, Bell, Layers } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'

const features = [
    {
        icon: '📡',
        title: 'IoT Sensor Monitoring',
        desc: 'Track temperature, humidity, and gas levels in real time across cold rooms and trucks.',
    },
    {
        icon: '🧊',
        title: 'Cold Storage Health',
        desc: 'Monitor packhouse and cold storage performance to keep produce within safe ranges.',
    },
    {
        icon: '🚚',
        title: 'Live Shipment GPS',
        desc: 'Follow every truck on the road with live GPS and route context.',
    },
    {
        icon: '🧪',
        title: 'Spoilage Detection',
        desc: 'AI flags spoilage risk early using temperature, humidity, and gas trends.',
    },
    {
        icon: '🔍',
        title: 'QR Crop Traceability',
        desc: 'Scan QR codes to view complete storage, sensor, and movement history.',
    },
    {
        icon: '☁️',
        title: 'Cloud Alerts & Logs',
        desc: 'All events are synced to Firebase for 24/7 monitoring and audit trails.',
    },
]

const featureContainer = createStaggerContainer(0.08)

const PROMPT_STORAGE_KEY = 'agronexus-login-prompt-dismissed'

const MotionButton = motion(Button as any)

export function LandingPage({ onLogin }: { onLogin: () => void }) {
    const [showPrompt, setShowPrompt] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        if (window.localStorage.getItem(PROMPT_STORAGE_KEY) === 'true') return

        const timeoutId = window.setTimeout(() => {
            setShowPrompt(true)
        }, 10000)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [])

    const dismissPrompt = () => {
        window.localStorage.setItem(PROMPT_STORAGE_KEY, 'true')
        setShowPrompt(false)
    }

    const handlePrimaryAction = () => {
        dismissPrompt()
        onLogin()
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />

                <nav className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sprout size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-heading font-black">AgroNexus</span>
                    </div>
                    <Button onClick={onLogin} className="rounded-xl font-bold shadow-lg shadow-primary/20">
                        Login / Register <ArrowRight size={16} className="ml-1" />
                    </Button>
                </nav>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="relative max-w-4xl mx-auto px-4 py-20 text-center"
                >
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-bold">
                        AgroNexus – Smart Cold Chain Monitoring for Agriculture
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black leading-tight">
                        Smart Monitoring for Safer
                        <span className="text-primary"> Crop Storage & Transport</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Monitor temperature, humidity, gas levels, and real-time location of agricultural produce using IoT-powered
                        intelligence to reduce spoilage and post-harvest losses across your cold chain.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <MotionButton
                            size="lg"
                            onClick={onLogin}
                            className="rounded-xl font-bold text-lg px-8 shadow-xl shadow-primary/30"
                            whileHover={shouldReduceMotion ? { scale: 1.02 } : { scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Sprout size={20} className="mr-2" /> Start Monitoring
                        </MotionButton>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                        Connect sensors in your packhouses, reefer trucks, and warehouses in minutes.
                    </p>
                </motion.div>
            </header>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <motion.div
                    className="text-center mb-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <h2 className="text-3xl font-heading font-black">
                        End-to-End Cold Chain Visibility <span className="text-primary">❄️</span>
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        From harvest to mandi, monitor every handoff with IoT sensors, GPS, and cloud alerts.
                    </p>
                </motion.div>
                <motion.div
                    variants={featureContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {features.map((f, index) => (
                        <motion.div key={f.title} variants={fadeInUp} custom={index}>
                            <motion.div
                                className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-border/60 hover:border-primary/60 group cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                                whileHover={shouldReduceMotion ? { scale: 1.02 } : { scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span className="text-3xl inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                                    {f.icon}
                                </span>
                                <h3 className="mt-3 font-bold text-lg group-hover:text-primary transition-colors">{f.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Stats */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                            Prototype Capabilities <span className="text-primary">🚀</span>
                        </h2>
                        <p className="text-gray-600 mt-2 text-center max-w-2xl mx-auto">
                            Current features and technical achievements in our testing environment.
                        </p>
                    </motion.div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: Activity,
                                title: '3+ Sensors Integrated',
                                description: 'Temperature, Humidity & Gas Monitoring',
                            },
                            {
                                icon: MapPin,
                                title: 'Real-Time Tracking',
                                description: 'GPS + Cloud Connectivity',
                            },
                            {
                                icon: Bell,
                                title: 'Smart Alerts System',
                                description: 'Threshold-Based Notifications',
                            },
                            {
                                icon: Layers,
                                title: 'Scalable Architecture',
                                description: 'Ready for Large Deployment',
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center text-center h-full hover:scale-105 hover:-translate-y-1">
                                    <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <stat.icon className="w-7 h-7 text-green-700" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{stat.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-6">
                        Prototype results based on controlled testing environment.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 py-16 text-center">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <Card className="p-8 lg:p-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                        <Leaf className="mx-auto text-primary" size={40} />
                        <h2 className="mt-4 text-2xl sm:text-3xl font-heading font-black">
                            Ready to Secure Your Cold Chain?
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Join agribusinesses using AgroNexus to monitor cold storage, reefer fleets, and crop shipments in real time.
                        </p>
                        <MotionButton
                            size="lg"
                            onClick={onLogin}
                            className="mt-6 rounded-xl font-bold text-lg px-10 shadow-xl shadow-primary/20"
                            whileHover={shouldReduceMotion ? { scale: 1.02 } : { scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Get Started with AgroNexus
                        </MotionButton>
                    </Card>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/20 px-4 py-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sprout size={18} className="text-primary" />
                    <span className="font-heading font-bold">AgroNexus</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    AgroNexus – Smart Cold Chain Monitoring for Agriculture
                </p>
            </footer>

            {/* Login / Signup notification prompt */}
            {showPrompt && (
                <motion.div
                    className="fixed inset-0 z-40 flex items-end justify-center md:items-end md:justify-end pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="mb-4 md:mb-6 md:mr-6 max-w-sm w-full pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="bg-background/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-border"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Sprout size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-sm font-semibold">Track Your Crops in Real-Time 🚜</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Sign in to monitor temperature, humidity, location, and freshness of your produce with
                                                AgroNexus.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={dismissPrompt}
                                            aria-label="Close notification"
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <MotionButton
                                            size="sm"
                                            onClick={handlePrimaryAction}
                                            className="rounded-xl font-semibold px-4"
                                            whileHover={shouldReduceMotion ? { scale: 1.02 } : { scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                        >
                                            Login / Sign Up
                                        </MotionButton>
                                        <button
                                            type="button"
                                            onClick={dismissPrompt}
                                            className="text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                                        >
                                            Maybe Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

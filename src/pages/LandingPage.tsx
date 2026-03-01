import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Sprout, Shield, BarChart3, Users, Zap, ArrowRight, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
    { icon: '🔬', title: 'AI Crop Doctor', desc: 'Instant disease diagnosis from a photo' },
    { icon: '💧', title: 'Smart Irrigation', desc: 'Save 40% water with AI-powered scheduling' },
    { icon: '💰', title: 'Mandi Marketplace', desc: 'Best prices, direct from mandi to you' },
    { icon: '📊', title: 'Farm Analytics', desc: 'Track yield, costs, and profit in real-time' },
    { icon: '👥', title: 'Kisan Connect', desc: 'Join a community of 10 lakh+ farmers' },
    { icon: '🧠', title: 'AI Crop Advisor', desc: 'Personalized advice for your soil & climate' },
]

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export function LandingPage({ onLogin }: { onLogin: () => void }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

                <nav className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sprout size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-heading font-black">AgriSmart</span>
                    </div>
                    <Button onClick={onLogin} className="rounded-xl font-bold shadow-lg shadow-primary/20">
                        Login / Register <ArrowRight size={16} className="ml-1" />
                    </Button>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-4xl mx-auto px-4 py-20 text-center"
                >
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-bold">
                        🌱 India's #1 AI-Powered Farm Platform
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black leading-tight">
                        Smart Farming for
                        <span className="text-primary"> Every Kisan</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        AI crop doctor, smart irrigation, live mandi prices, and community support — everything a modern Indian farmer needs, in one app.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" onClick={onLogin} className="rounded-xl font-bold text-lg px-8 shadow-xl shadow-primary/20">
                            <Sprout size={20} className="mr-2" /> Start Free — Shuru Karo! 🚀
                        </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Available in Hindi, Telugu, Marathi, Tamil & more</p>
                </motion.div>
            </header>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-black">
                        Everything Your Farm Needs <span className="text-primary">🌾</span>
                    </h2>
                    <p className="text-muted-foreground mt-2">Powered by AI, built for Indian farmers</p>
                </div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {features.map((f) => (
                        <motion.div key={f.title} variants={item}>
                            <Card className="p-6 hover:border-primary/30 transition-all duration-200 hover:shadow-lg group cursor-pointer">
                                <span className="text-3xl">{f.icon}</span>
                                <h3 className="mt-3 font-bold text-lg group-hover:text-primary transition-colors">{f.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Stats */}
            <section className="bg-muted/30 border-y border-border">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '10L+', label: 'Active Farmers' },
                            { value: '28', label: 'States Covered' },
                            { value: '₹2.5Cr', label: 'Savings Generated' },
                            { value: '4.8★', label: 'App Rating' },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-3xl font-black text-primary">{s.value}</p>
                                <p className="text-sm text-muted-foreground font-bold mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 py-16 text-center">
                <Card className="p-8 lg:p-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <Leaf className="mx-auto text-primary" size={40} />
                    <h2 className="mt-4 text-2xl sm:text-3xl font-heading font-black">
                        Ready to Transform Your Farm?
                    </h2>
                    <p className="mt-2 text-muted-foreground">Join lakhs of farmers already using AgriSmart</p>
                    <Button size="lg" onClick={onLogin} className="mt-6 rounded-xl font-bold text-lg px-10 shadow-xl shadow-primary/20">
                        Get Started — Free Forever 🌱
                    </Button>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/20 px-4 py-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sprout size={18} className="text-primary" />
                    <span className="font-heading font-bold">AgriSmart</span>
                </div>
                <p className="text-xs text-muted-foreground">Made with ❤️ for Indian Farmers • Jai Jawan, Jai Kisan</p>
            </footer>
        </div>
    )
}

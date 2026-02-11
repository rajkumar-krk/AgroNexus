import { Button } from '../components/ui/button'
import { Leaf, Shield, TrendingUp, Users, Mic, Camera, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const features = [
    { icon: Camera, title: 'AI Crop Doctor', desc: 'Scan crops with your camera for instant disease diagnosis.' },
    { icon: Droplets, title: 'Smart Irrigation', desc: 'Optimize water usage with IoT-driven real-time insights.' },
    { icon: TrendingUp, title: 'Market Mandi', desc: 'Get live pricing and connect with verified buyers nearby.' },
    { icon: Users, title: 'Kisan Connect', desc: 'Join a community of experts and fellow farmers for wisdom.' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-primary selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-20"
            alt="AgriSmart Farm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F3]/50 via-[#FAF8F3]/20 to-[#FAF8F3]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Leaf size={16} className="text-primary" />
            <span className="text-sm font-bold tracking-wide uppercase">Award-Winning AgriTech Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
            Empowering Farmers <br />
            <span className="text-secondary italic">With Intelligent Nature</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
            AgriSmart brings cutting-edge AI, IoT sensors, and market intelligence to rural farming communities. Accessible, voice-first, and offline-ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={onLogin}
              className="w-full sm:w-auto text-lg h-14 px-10 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Get Started Namaste 🙏
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg h-14 px-10 rounded-full font-bold border-2 hover:bg-primary/5 transition-colors"
            >
              Watch Video Guide
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">1M+</span>
              <span className="text-sm">Farmers Empowered</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">15+</span>
              <span className="text-sm">Regional Languages</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">92%</span>
              <span className="text-sm">Yield Improvement</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Voice Icon */}
        <div className="absolute bottom-10 right-10 z-20 hidden md:block">
          <Button size="icon" className="w-16 h-16 rounded-full shadow-2xl animate-pulse">
            <Mic size={32} />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Smart Solutions for Modern Farming</h2>
            <div className="w-20 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-4 bg-[#FAF8F3]">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-6">Blockchain-Secured & Privacy-First</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your farm data is encrypted and stays with you. Blockchain ensures transparency in market pricing and secure escrow payments for all produce sales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-white rounded-xl border border-border flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-bold">End-to-End Encrypted</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-xl border border-border flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-bold">Biometric Authentication</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-xl border border-border flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-bold">Offline Sync Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-heading font-bold">AgriSmart</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Contact</a>
            <a href="#" className="hover:text-accent">Govt Schemes</a>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            © 2026 Sonnet AgriSmart Platform. Earth-conscious technology.
          </p>
        </div>
      </footer>
    </div>
  )
}

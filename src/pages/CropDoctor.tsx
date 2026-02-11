import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  X, 
  Zap, 
  Mic, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  ShoppingBag, 
  MessageSquare,
  History,
  Info
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export function CropDoctor() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [flashOn, setFlashOn] = useState(false)

  const startScan = () => {
    setIsScanning(true)
    // Simulate AI Processing delay
    setTimeout(() => {
      setScanResult({
        disease: 'Leaf Blight (Pattā Jhulsā)',
        confidence: 87,
        detectedDate: new Date().toLocaleDateString(),
        treatment: [
          'Remove and destroy infected leaves immediately.',
          'Spray Mancozeb (200g/100L) uniformly across the field.',
          'Avoid overhead irrigation to reduce moisture on leaves.',
          'Repeat spray after 7-10 days if symptoms persist.'
        ],
        severity: 'Moderate',
        organicOption: 'Neem oil spray (5ml/L) with soap solution.'
      })
      setIsScanning(false)
    }, 3000)
  }

  const reset = () => {
    setScanResult(null)
    setIsScanning(false)
  }

  return (
    <div className="max-w-md mx-auto h-full flex flex-col space-y-4 pb-12">
      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col h-[70vh]"
          >
            {/* Camera Viewfinder Mockup */}
            <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1597362905293-385650fd540e?auto=format&fit=crop&q=80" 
                className={`w-full h-full object-cover transition-all duration-500 ${isScanning ? 'brightness-50 blur-sm' : 'brightness-90'}`}
                alt="Crop View"
              />
              
              {/* AR Overlays */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-xl" />
                  
                  {isScanning && (
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-accent/80 shadow-[0_0_15px_hsl(var(--accent))]"
                    />
                  )}
                </div>
              </div>

              {/* Status Banner */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[80%]">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    {isScanning ? 'Analyzing Crop Health...' : 'Align affected area in grid'}
                  </span>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-full ${flashOn ? 'bg-accent text-black' : 'bg-black/20 text-white'}`}
                  onClick={() => setFlashOn(!flashOn)}
                >
                  <Zap size={20} />
                </Button>
                
                <button 
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-20 h-20 rounded-full bg-white p-1 shadow-2xl active:scale-95 transition-transform disabled:opacity-50"
                >
                  <div className="w-full h-full rounded-full border-4 border-black/10 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white transition-all duration-300 ${isScanning ? 'scale-0' : 'scale-100'}`}>
                      <Camera size={28} />
                    </div>
                  </div>
                </button>

                <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white">
                  <History size={20} />
                </Button>
              </div>
            </div>

            {/* Voice Symptom Prompt */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">Or describe symptoms via voice</p>
              <Button variant="outline" className="rounded-full px-8 h-12 border-2 border-primary/20 text-primary hover:bg-primary/5 flex items-center gap-2 group">
                <Mic size={18} className="group-hover:animate-pulse" />
                <span className="font-bold">Describe Symptoms</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col space-y-4"
          >
            {/* Result Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">Diagnosis Report</h2>
              <Button variant="ghost" size="icon" onClick={reset} className="rounded-full">
                <X size={24} />
              </Button>
            </div>

            {/* Main Result Card */}
            <Card className="p-0 overflow-hidden border-2 border-destructive/20 shadow-xl">
              <div className="bg-destructive text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle size={24} />
                  <div>
                    <h3 className="font-bold text-lg">{scanResult.disease}</h3>
                    <p className="text-xs text-white/80">Confidence Score: {scanResult.confidence}%</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-white border-white bg-white/20">
                  {scanResult.severity}
                </Badge>
              </div>
              
              <div className="p-5 space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" /> Treatment Plan
                  </h4>
                  <ul className="space-y-3">
                    {scanResult.treatment.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-snug">{step}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sprout/5 border border-sprout/20 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase text-primary mb-2 flex items-center gap-2">
                    <Leaf size={14} /> Organic Alternative
                  </h4>
                  <p className="text-sm font-medium">{scanResult.organicOption}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="rounded-xl h-12 flex items-center gap-2 font-bold">
                    <ShoppingBag size={18} /> Buy Medicine
                  </Button>
                  <Button variant="outline" className="rounded-xl h-12 border-2 border-primary/20 text-primary font-bold flex items-center gap-2">
                    <MessageSquare size={18} /> Ask Expert
                  </Button>
                </div>
              </div>
            </Card>

            {/* Related Info */}
            <Card className="p-4 bg-muted/30 border-dashed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Did you know?</p>
                  <p className="text-xs text-muted-foreground">High humidity above 85% accelerates Leaf Blight spread.</p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            </Card>

            {/* Video Guide CTA */}
            <div className="relative rounded-2xl overflow-hidden h-32 group cursor-pointer shadow-lg border border-border">
              <img 
                src="https://images.unsplash.com/photo-1599148400620-8e1ff0bf28d8?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-50"
                alt="Treatment Video"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-1">
                  <Zap size={24} fill="currentColor" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Watch Video Guide (Hindi)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Leaf({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13z" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3" />
    </svg>
  )
}

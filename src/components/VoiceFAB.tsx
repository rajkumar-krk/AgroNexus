import { Mic } from 'lucide-react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function VoiceFAB() {
  const [isListening, setIsListening] = useState(false)

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice feedback
      const utterance = new SpeechSynthesisUtterance("Namaste Ramesh Ji, Main aapki kaise madad kar sakta hoon?")
      utterance.lang = 'hi-IN'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 lg:bottom-10 lg:right-10">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-primary text-white p-4 rounded-2xl shadow-2xl w-64 border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm font-bold">Listening...</span>
            </div>
            <p className="text-xs text-white/80 italic">"Ramesh Ji, kheti ka haal batao"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isListening ? 'bg-destructive hover:bg-destructive/90 scale-110' : 'bg-primary hover:bg-primary/90'
        }`}
      >
        <Mic size={32} className={isListening ? 'animate-pulse' : ''} />
      </Button>
    </div>
  )
}

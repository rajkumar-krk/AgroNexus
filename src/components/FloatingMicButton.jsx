import React, { useState } from 'react'
import { Mic } from 'lucide-react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingMicButton() {
  const [isListening, setIsListening] = useState(false)

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice feedback
      const utterance = new SpeechSynthesisUtterance("Voice assistant activated for cold chain monitoring")
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 left-0 bg-primary text-white p-4 rounded-2xl shadow-2xl w-64 border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-card rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm font-bold">Listening...</span>
            </div>
            <p className="text-xs text-white/80 italic">"Monitor cold room temperature"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Button */}
      <Button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 scale-110' 
            : 'bg-green-500 hover:bg-green-600 hover:scale-110'
        }`}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px'
        }}
      >
        <Mic size={24} className={isListening ? 'animate-pulse text-white' : 'text-white'} />
      </Button>
    </div>
  )
}

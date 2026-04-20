import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from 'lucide-react'
import { api } from '../lib/api'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Namaste! 🙏 I\'m your FarmOS AI Assistant. Ask me anything about farming — crop advice, pest control, market prices, government schemes, or weather guidance. I\'m here to help!',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    async function handleSend() {
        if (!input.trim() || loading) return
        const userMessage = input.trim()
        setInput('')

        const newUserMsg: ChatMessage = { role: 'user', content: userMessage, timestamp: new Date() }
        setMessages(prev => [...prev, newUserMsg])
        setLoading(true)

        try {
            const conversationHistory = messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                content: m.content,
            }))

            const result = await api.chatWithAI(userMessage, conversationHistory)

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: result.response, timestamp: new Date() },
            ])
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ Sorry, I couldn\'t process that. Please try again.', timestamp: new Date() },
            ])
        } finally {
            setLoading(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickQuestions = [
        '🌾 Best crop for Rabi season?',
        '🐛 How to control aphids?',
        '💰 What is today\'s wheat price?',
        '🏛️ PM-KISAN eligibility?',
    ]

    return (
        <>
            {/* FAB Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 w-[360px] h-[500px] bg-card rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 bg-primary text-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">FarmOS AI</h3>
                                <p className="text-[10px] text-white/70">Powered by Gemini</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                                <Minimize2 size={14} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                        <Bot size={12} className="text-primary" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-muted rounded-bl-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                        <User size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot size={12} className="text-primary" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions (shown only if 1 message) */}
                    {messages.length <= 1 && (
                        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                            {quickQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(q); handleSend() }}
                                    className="text-[10px] px-2.5 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="p-3 border-t shrink-0">
                        <div className="flex items-center gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything about farming..."
                                className="flex-1 text-xs h-9"
                                disabled={loading}
                            />
                            <Button
                                size="sm"
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="h-9 w-9 p-0"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

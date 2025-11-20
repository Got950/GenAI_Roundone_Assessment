import { useState, useRef, useEffect } from 'react'
import Message from './Message'
import InputArea from './InputArea'
import TypingIndicator from './TypingIndicator'
import VoiceInput from './VoiceInput'
import { useTheme } from '../contexts/ThemeContext'
import { usePerson } from '../contexts/PersonContext'
import { callGroqAPI } from '../services/groqApi'

export interface MessageType {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

function Chatbot() {
  const { theme } = useTheme()
  const { personDetails, apiKey } = usePerson()
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm Alex. I can answer questions about anything - ask me anything! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<MessageType[]>(messages)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis
      
      // Load voices (some browsers need this)
      const loadVoices = () => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.getVoices()
        }
      }
      
      loadVoices()
      // Some browsers fire this event when voices are loaded
      if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
        speechSynthesisRef.current.onvoiceschanged = loadVoices
      }
    }
    
    // Cleanup: stop any ongoing speech when component unmounts
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  // Function to speak text
  const speakText = (text: string) => {
    if (!speechSynthesisRef.current) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Stop any ongoing speech
    speechSynthesisRef.current.cancel()

    // Clean text - remove emojis and special characters for better speech
    const cleanText = text
      .replace(/[👋💬🎨✨]/g, '') // Remove emojis
      .replace(/\[.*?\]/g, '') // Remove brackets content
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 1.0 // Normal speed
    utterance.pitch = 1.0 // Normal pitch
    utterance.volume = 1.0 // Full volume

    // Try to use a natural-sounding voice
    const selectVoice = () => {
      const voices = speechSynthesisRef.current?.getVoices() || []
      if (voices.length === 0) {
        // Voices not loaded yet, use default
        speechSynthesisRef.current?.speak(utterance)
        return
      }
      
      const preferredVoice = voices.find(
        (voice) => voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Neural')
      ) || voices.find((voice) => voice.lang.startsWith('en'))
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
      }

      speechSynthesisRef.current?.speak(utterance)
    }

    // Try to select voice immediately, or wait if voices aren't loaded
    const voices = speechSynthesisRef.current.getVoices()
    if (voices.length === 0) {
      // Wait a bit for voices to load
      setTimeout(selectVoice, 100)
    } else {
      selectVoice()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Update initial message when person details change (but keep it general)
    if (personDetails && messages.length === 1 && messages[0].id === '1') {
      setMessages([
        {
          id: '1',
          text: "Hello! 👋 I'm Alex. I can answer questions about anything - ask me anything! How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    }
  }, [personDetails])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Stop any ongoing speech when sending a new message
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
    }

    // Always use the API key from context, environment variable, or default
    const keyToUse = apiKey || import.meta.env.VITE_GROQ_API_KEY || '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'
    
    if (!keyToUse) {
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: 'API key is missing. Please configure your Groq API key.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    // Add user message to state
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Use ref to get latest messages (includes the user message we just added)
      const currentMessages = [...messagesRef.current, userMessage]
      
      // Build conversation history from all messages except initial greeting
      const conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }> = currentMessages
        .filter((msg) => msg.id !== '1') // Exclude initial greeting
        .map((msg) => ({
          role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.text,
        }))

      const response = await callGroqAPI(conversationMessages, keyToUse, personDetails)

      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      
      // Speak the bot's response
      speakText(response)
    } catch (error: any) {
      console.error('Error calling Groq API:', error)
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please check your API key and try again.`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      
      // Speak the error message
      speakText(errorMessage.text)
    } finally {
      setIsTyping(false)
    }
  }

  const handleVoiceTranscript = (text: string) => {
    if (text.trim()) {
      // Stop any ongoing speech when user speaks
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
      // Voice input automatically sends the message
      handleSendMessage(text)
    }
  }

  const handleToggleListening = () => {
    // Stop any ongoing speech when starting to listen
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
    }
    setIsListening((prev) => !prev)
  }

  return (
    <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-500/40 overflow-hidden animate-fade-in vibrant-glow transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800 p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptLTIwIDBjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0yMi0xMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6TTIwIDEwYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMjIgMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6TTYgMjJjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0zNiAwYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="relative">
            <div className="w-12 h-12 bg-white/25 dark:bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm animate-float border border-white/40 dark:border-blue-400/60 vibrant-glow">
              <svg
                className="w-7 h-7 text-white dark:text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 dark:bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-lg shadow-emerald-500/70"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white dark:text-blue-100 code-text drop-shadow-lg">Alex</h1>
              <span className="text-blue-200 dark:text-blue-300 terminal-cursor">_</span>
            </div>
            <p className="text-white/90 dark:text-blue-200/90 text-sm code-text drop-shadow">[STATUS: ONLINE] [MODE: {theme.toUpperCase()}]</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-gradient-to-b from-white/60 to-blue-50/40 dark:from-slate-900/60 dark:to-slate-800/40 relative"
      >
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            index={index}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <InputArea
        onSendMessage={handleSendMessage}
        isListening={isListening}
        onToggleListening={handleToggleListening}
      />
      <VoiceInput
        onTranscript={handleVoiceTranscript}
        isListening={isListening}
        onListeningChange={setIsListening}
      />
    </div>
  )
}

export default Chatbot


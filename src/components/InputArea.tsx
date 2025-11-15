import { useState, KeyboardEvent } from 'react'

interface InputAreaProps {
  onSendMessage: (text: string) => void
  isListening: boolean
  onToggleListening: () => void
}

function InputArea({ onSendMessage, isListening, onToggleListening }: InputAreaProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Voice input is handled by parent component, this is just for display

  return (
    <div className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-t border-blue-200/60 dark:border-blue-500/40">
      <div className="flex items-end space-x-3">
        <button
          onClick={onToggleListening}
          className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </button>
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? 'Listening...' : 'Type your message or use voice input...'}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-white/95 dark:bg-slate-800/95 border border-blue-300 dark:border-blue-500/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200 shadow-md hover:shadow-lg dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 code-text overflow-y-auto scrollbar-hide"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg vibrant-glow z-10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center code-text">
        {isListening ? '🎤 Listening... Speak now' : '[ENTER] to send | [SHIFT+ENTER] for new line | Click mic for voice'}
      </p>
    </div>
  )
}

export default InputArea


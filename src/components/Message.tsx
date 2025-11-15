import { MessageType } from './Chatbot'

interface MessageProps {
  message: MessageType
  index: number
}

function Message({ message, index }: MessageProps) {
  const isUser = message.sender === 'user'
  const animationDelay = index * 0.1

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div
        className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-5 py-3 shadow-lg transform transition-all duration-300 hover:scale-[1.02] border ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-slate-800 text-white animate-slide-in-right border-blue-400/60 dark:border-blue-500/70 vibrant-glow'
            : 'bg-white dark:bg-slate-800/95 text-gray-800 dark:text-gray-100 border-blue-200 dark:border-blue-500/40 animate-slide-in-left backdrop-blur-sm shadow-md'
        }`}
      >
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center mt-0.5 border border-white/40 dark:border-blue-400/60 shadow-lg">
              <svg
                className="w-5 h-5 text-white"
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
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words code-text">
              {message.text}
            </p>
            <p
              className={`text-xs mt-2 code-text ${
                isUser ? 'text-white/80 dark:text-blue-100/80' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              [{message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}]
            </p>
          </div>
          {isUser && (
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center mt-0.5 ml-2 border border-white/40 dark:border-blue-400/60 shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message


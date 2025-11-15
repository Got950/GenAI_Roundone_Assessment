function TypingIndicator() {
  return (
    <div className="flex justify-start animate-slide-in-left">
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl px-5 py-3 shadow-lg border border-blue-200 dark:border-blue-500/40 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center border border-white/40 dark:border-blue-400/60 shadow-md">
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
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 code-text font-semibold">PROCESSING</span>
            <div className="flex space-x-1.5 py-2">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-700 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator


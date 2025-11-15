import { useState, useEffect } from 'react'
import { usePerson } from '../contexts/PersonContext'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

function Settings({ isOpen, onClose }: SettingsProps) {
  const { personDetails, setPersonDetails, apiKey, setApiKey } = usePerson()
  const [localPersonDetails, setLocalPersonDetails] = useState(personDetails)
  const [localApiKey, setLocalApiKey] = useState(apiKey)

  // Update local state when settings modal opens to reflect current values
  useEffect(() => {
    if (isOpen) {
      setLocalPersonDetails(personDetails)
      setLocalApiKey(apiKey)
    }
  }, [isOpen, personDetails, apiKey])

  if (!isOpen) return null

  const handleSave = () => {
    setPersonDetails(localPersonDetails)
    setApiKey(localApiKey)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200 dark:border-blue-500/40">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 code-text">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 code-text">
              Groq API Key
            </label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-100 code-text"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Get your API key from{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Groq Console
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 code-text">
              Person Details
            </label>
            <textarea
              value={localPersonDetails}
              onChange={(e) => setLocalPersonDetails(e.target.value)}
              placeholder="Enter details about the person (name, age, profession, interests, background, etc.)"
              rows={8}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-100 code-text resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The AI will focus on answering questions about this person only.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors code-text"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg vibrant-glow code-text"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings


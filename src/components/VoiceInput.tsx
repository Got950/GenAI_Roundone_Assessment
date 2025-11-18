import { useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening: boolean
  onListeningChange: (listening: boolean) => void
}

function VoiceInput({ onTranscript, isListening, onListeningChange }: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    // Initialize recognition only once
    if (!isInitializedRef.current) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          console.log('Speech recognition started')
          onListeningChange(true)
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            }
          }
          
          if (finalTranscript.trim()) {
            console.log('Transcript received:', finalTranscript.trim())
            onTranscript(finalTranscript.trim())
            // Stop after getting result
            try {
              recognition.stop()
            } catch (e) {
              // Ignore stop errors
            }
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          onListeningChange(false)
          
          if (event.error === 'no-speech') {
            // No speech detected, just stop
            try {
              recognition.stop()
            } catch (e) {
              // Ignore
            }
          } else if (event.error === 'not-allowed') {
            alert('Microphone permission denied. Please enable microphone access in your browser settings.')
          } else if (event.error === 'aborted') {
            // User stopped, ignore
          } else {
            console.error('Speech recognition error:', event.error)
          }
        }

        recognition.onend = () => {
          console.log('Speech recognition ended')
          onListeningChange(false)
        }

        recognitionRef.current = recognition
        isInitializedRef.current = true
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error)
      }
    }

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          recognitionRef.current.abort()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - initialize only once

  useEffect(() => {
    if (!recognitionRef.current || !isInitializedRef.current) return

    if (isListening) {
      try {
        // Stop any existing recognition first
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore if not running
        }
        
        // Small delay to ensure previous recognition is stopped
        const timeoutId = setTimeout(() => {
          // Check current state again to avoid stale closure
          if (recognitionRef.current && isInitializedRef.current) {
            try {
              recognitionRef.current.start()
            } catch (error: any) {
              console.error('Error starting recognition:', error)
              // If already started, ignore
              if (error.name !== 'InvalidStateError') {
                onListeningChange(false)
              }
            }
          }
        }, 100)
        
        return () => clearTimeout(timeoutId)
      } catch (error) {
        console.error('Error starting recognition:', error)
        onListeningChange(false)
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Ignore stop errors (might not be running)
      }
    }
  }, [isListening, onListeningChange])

  return null
}

export default VoiceInput


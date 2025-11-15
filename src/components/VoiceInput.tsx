import { useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening: boolean
  onListeningChange: (listening: boolean) => void
}

function VoiceInput({ onTranscript, isListening, onListeningChange }: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported')
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      onListeningChange(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')
      if (transcript.trim()) {
        onTranscript(transcript)
      }
      onListeningChange(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      onListeningChange(false)
      if (event.error === 'no-speech') {
        // Don't show alert for no-speech, just stop listening
      } else if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please enable microphone access.')
      }
    }

    recognition.onend = () => {
      onListeningChange(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [onTranscript, onListeningChange])

  useEffect(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        onListeningChange(false)
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Ignore stop errors
      }
    }
  }, [isListening, onListeningChange])

  return null
}

export default VoiceInput


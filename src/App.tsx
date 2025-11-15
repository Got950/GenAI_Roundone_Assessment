import Chatbot from './components/Chatbot'
import { ThemeProvider } from './contexts/ThemeContext'
import { PersonProvider } from './contexts/PersonContext'

function App() {
  return (
    <ThemeProvider>
      <PersonProvider>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Chatbot />
        </div>
      </PersonProvider>
    </ThemeProvider>
  )
}

export default App


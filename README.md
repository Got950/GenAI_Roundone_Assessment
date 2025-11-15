# Alex - Professional AI Chatbot

A beautiful, animated, and professional chatbot interface built with React, TypeScript, and Tailwind CSS. Features Groq API integration, voice input, and person-focused conversations.

## Features

✨ **Modern Design**
- Blue gradient theme with dark mode support
- Glassmorphism effects with backdrop blur
- Responsive layout that works on all devices
- Smooth animations and transitions

🎨 **Eye-Catching Animations**
- Smooth fade-in and slide-up animations for messages
- Typing indicators with bouncing dots
- Hover effects and transitions
- Floating header icon animation

💬 **Chat Features**
- **Groq API Integration** - Powered by Llama 3.3 70B model
- **Voice Input** - Speech-to-text using Web Speech API
- **Text Input** - Traditional typing with auto-resize
- **Person-Focused** - Configure to answer questions about a specific person
- Real-time message display with conversation history
- Auto-scrolling to latest messages
- Natural, conversational responses

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Setting Up Groq API

1. Get your API key from [Groq Console](https://console.groq.com/keys)
2. Click the settings (gear) icon in the chatbot header
3. Enter your Groq API key
4. Click Save

### Configuring Person Details

1. Click the settings (gear) icon in the chatbot header
2. Enter details about the person in the "Person Details" field
3. The chatbot will focus on answering questions about this person
4. Click Save

### Voice Input

- Click the microphone button to start voice input
- Speak your question clearly
- The speech will be automatically transcribed and sent
- Works best in Chrome/Edge browsers

### Styling

The UI uses Tailwind CSS. You can customize colors, animations, and styles in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom CSS and animations
- Component files - Inline Tailwind classes

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## License

MIT


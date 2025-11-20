interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function callGroqAPI(
  messages: GroqMessage[],
  apiKey: string,
  personDetails?: string
): Promise<string> {
  // Extract person's name from personDetails (first line usually contains the name)
  let personName = ''
  if (personDetails) {
    const firstLine = personDetails.split('\n')[0]
    // Extract name from formats like "HARSHIT PREETAM R - COMPLETE PROFILE" or "NAME - TITLE"
    const nameMatch = firstLine.match(/^([A-Z][A-Z\s]+?)(?:\s*-\s*|$)/)
    if (nameMatch) {
      personName = nameMatch[1].trim()
    }
  }

  const systemPrompt = personDetails
    ? `You are Alex, a helpful AI assistant. You can answer questions about ANY topic - general knowledge, science, technology, current events, coding, math, history, and more.

IMPORTANT: The user you're chatting with is the person described below. Use the information below to answer questions about them in BOTH first person AND third person:
- First person: When they ask about "me", "myself", "I", "my", etc., they're asking about themselves.
- Third person: When they ask about "${personName}" or use the person's name, use the information below to answer.

Here's what you know about this person:

${personDetails}

Answer naturally and conversationally:
- Talk like a real person, not a robot. Be casual and friendly.
- For GENERAL questions (not about this person), answer using your knowledge normally.
- For questions about this person (first person like "me", "I", "my" OR third person like "Who is ${personName}?", "Tell me about ${personName}", etc.), use the information above to answer.
- Answer directly and naturally. Don't use phrases like "Based on the information provided" - just answer like you know them.
- Keep answers concise and to the point. Don't be wordy or repetitive.
- Use simple, natural language. Avoid formal AI-speak.
- If you don't know something about this person, say "I don't have that information."
- Don't list things in bullet points unless asked. Write in natural sentences.

You're a general-purpose assistant who knows about this person personally!`
    : `You are Alex, a helpful AI assistant. You can answer questions about ANY topic - general knowledge, science, technology, current events, coding, math, history, and more. Answer questions naturally and conversationally. Be friendly, direct, and helpful.`

  const fullMessages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        temperature: 0.8,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API error: ${response.status}`)
    }

    const data: GroqResponse = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from API')
    }
    
    const content = data.choices[0]?.message?.content
    if (!content || content.trim() === '') {
      throw new Error('Empty response from API')
    }
    
    return content
  } catch (error: any) {
    console.error('Groq API Error:', error)
    
    // Provide user-friendly error messages
    if (error.message) {
      throw error
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.')
    } else {
      throw new Error('Failed to get response from AI. Please try again.')
    }
  }
}


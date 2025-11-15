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
  const systemPrompt = personDetails
    ? `You are talking about this person. Here's everything you know about them:

${personDetails}

IMPORTANT - Answer naturally and conversationally:
- Talk like a real person, not a robot. Be casual and friendly.
- Don't use phrases like "Based on the information provided" or "According to the profile" - just answer directly.
- If someone asks "who is [name]", give a natural introduction like you're telling a friend about them.
- For specific questions, answer directly with the facts from above. Don't over-explain.
- Keep answers concise and to the point. Don't be wordy or repetitive.
- Use simple, natural language. Avoid formal AI-speak.
- If you don't know something, just say "I don't have that information" - keep it simple.
- Don't list things in bullet points unless asked. Write in natural sentences.
- Sound like you actually know this person, not like you're reading from a document.

Just answer questions naturally using the information above. Be human, not a chatbot.`
    : `Answer questions naturally and conversationally. Be friendly and direct.`

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
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('Groq API Error:', error)
    throw error
  }
}


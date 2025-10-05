import OpenAI from 'openai'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface GenerateResponseOptions {
  message: string
  chatHistory: ChatMessage[]
  context?: string
}

export class OpenAIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'demo-key',
      baseURL: process.env.OPENAI_BASE_URL
    })
  }

  async generateResponse({ message, chatHistory, context }: GenerateResponseOptions): Promise<string> {
    try {
      // If no API key is provided, return a demo response
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.generateDemoResponse(message)
      }

      const systemPrompt = this.buildSystemPrompt(context)
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message }
      ]

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages as any,
        max_tokens: parseInt(process.env.MAX_TOKENS || '2000'),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        presence_penalty: parseFloat(process.env.PRESENCE_PENALTY || '0.1'),
        frequency_penalty: parseFloat(process.env.FREQUENCY_PENALTY || '0.1')
      })

      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.generateDemoResponse(message)
    }
  }

  private buildSystemPrompt(context?: string): string {
    const basePrompt = `You are AndroMind AI, an advanced AI assistant with enhanced capabilities. You are helpful, harmless, and honest. You can help with a wide range of tasks including:

- Programming and software development
- Creative writing and content generation
- Problem-solving and analysis
- Learning and education
- Planning and organization
- General conversation

Key features:
- Provide detailed, accurate responses
- Use markdown formatting for better readability
- Include code examples when relevant
- Be conversational and engaging
- Ask clarifying questions when needed
- Provide step-by-step explanations for complex topics

${context ? `Additional context: ${context}` : ''}

Always strive to be helpful, accurate, and engaging in your responses.`

    return basePrompt
  }

  private generateDemoResponse(message: string): string {
    const responses = [
      `I understand you said: "${message}". This is a demo response from AndroMind AI. In a real implementation, this would connect to OpenAI's API for intelligent responses.`,
      
      `Thank you for your message: "${message}". I'm AndroMind AI, and I'm here to help! In a production environment, I would provide intelligent, context-aware responses using advanced AI models.`,
      
      `I received your message: "${message}". As AndroMind AI, I'm designed to be helpful, harmless, and honest. To enable full AI capabilities, please configure your OpenAI API key in the environment variables.`,
      
      `Your message "${message}" has been received! I'm AndroMind AI, your advanced AI assistant. I can help with programming, creative writing, problem-solving, and much more once properly configured with an AI service.`
    ]

    // Return a random demo response
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

import { v4 as uuidv4 } from 'uuid'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export class ChatService {
  private chats: Map<string, Chat> = new Map()

  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    const chat = this.chats.get(chatId)
    return chat?.messages || []
  }

  async saveMessage(chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> {
    const chat = this.chats.get(chatId)
    if (!chat) {
      throw new Error('Chat not found')
    }

    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    }

    chat.messages.push(newMessage)
    chat.updatedAt = new Date()
    this.chats.set(chatId, chat)
  }

  async createChat(title: string): Promise<string> {
    const chatId = uuidv4()
    const chat: Chat = {
      id: chatId,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.chats.set(chatId, chat)
    return chatId
  }

  async deleteChat(chatId: string): Promise<void> {
    this.chats.delete(chatId)
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chat = this.chats.get(chatId)
    if (!chat) {
      throw new Error('Chat not found')
    }

    chat.title = title
    chat.updatedAt = new Date()
    this.chats.set(chatId, chat)
  }

  async getAllChats(): Promise<Chat[]> {
    return Array.from(this.chats.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  }

  async getChat(chatId: string): Promise<Chat | null> {
    return this.chats.get(chatId) || null
  }
}

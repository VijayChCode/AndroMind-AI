import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  // Current chat
  currentChatId: string | null
  messages: Message[]
  isTyping: boolean
  
  // All chats
  chats: Chat[]
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  
  // Actions
  setCurrentChat: (chatId: string | null) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (id: string, content: string) => void
  setTyping: (isTyping: boolean) => void
  createChat: (title: string) => string
  deleteChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  clearAllChats: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChatId: null,
      messages: [],
      isTyping: false,
      chats: [],
      sidebarOpen: true,
      theme: 'dark',
      
      // Actions
      setCurrentChat: (chatId) => {
        const chat = get().chats.find(c => c.id === chatId)
        set({
          currentChatId: chatId,
          messages: chat?.messages || []
        })
      },
      
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date()
        }
        
        set((state) => {
          const updatedMessages = [...state.messages, newMessage]
          
          // Update current chat if exists
          if (state.currentChatId) {
            const updatedChats = state.chats.map(chat =>
              chat.id === state.currentChatId
                ? { ...chat, messages: updatedMessages, updatedAt: new Date() }
                : chat
            )
            return { messages: updatedMessages, chats: updatedChats }
          }
          
          return { messages: updatedMessages }
        })
      },
      
      updateMessage: (id, content) => {
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === id ? { ...msg, content } : msg
          )
        }))
      },
      
      setTyping: (isTyping) => set({ isTyping }),
      
      createChat: (title) => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
          messages: []
        }))
        
        return newChat.id
      },
      
      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter(chat => chat.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
          messages: state.currentChatId === chatId ? [] : state.messages
        }))
      },
      
      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
          )
        }))
      },
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setTheme: (theme) => set({ theme }),
      
      clearAllChats: () => set({
        chats: [],
        currentChatId: null,
        messages: []
      })
    }),
    {
      name: 'andromind-chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)

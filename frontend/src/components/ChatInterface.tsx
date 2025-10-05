import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Paperclip, Download, Copy } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import toast from 'react-hot-toast'

const ChatInterface = () => {
  const {
    messages,
    addMessage,
    setTyping,
    isTyping,
    currentChatId,
    createChat
  } = useChatStore()

  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    addMessage({
      content: userMessage,
      role: 'user'
    })

    // Create chat if none exists
    if (!currentChatId) {
      createChat(userMessage.slice(0, 50) + '...')
    }

    // Simulate AI response
    setTyping(true)
    
    try {
      // Here you would make an API call to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: currentChatId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add AI response
      addMessage({
        content: data.response,
        role: 'assistant'
      })
    } catch (error) {
      // Fallback response for demo
      setTimeout(() => {
        addMessage({
          content: `I understand you said: "${userMessage}". This is a demo response. In a real implementation, this would connect to an AI service like OpenAI's API.`,
          role: 'assistant'
        })
        setTyping(false)
        setIsLoading(false)
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    toast.success(isRecording ? 'Voice recording stopped' : 'Voice recording started')
  }

  const handleCopyAll = () => {
    const allMessages = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n')
    
    navigator.clipboard.writeText(allMessages)
    toast.success('Conversation copied to clipboard')
  }

  const handleExport = () => {
    const data = {
      messages,
      timestamp: new Date().toISOString(),
      chatId: currentChatId
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${currentChatId || 'new'}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Chat exported successfully')
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-bold text-white">A</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to AndroMind AI</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-md text-sm sm:text-base px-4">
              Start a conversation with our advanced AI assistant. Ask questions, get help with coding, 
              or just have a friendly chat!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full px-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput("Explain quantum computing in simple terms")}
                className="p-4 glass-effect rounded-lg text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">💡 Learn Something New</h3>
                <p className="text-sm text-gray-400">Ask about any topic you're curious about</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput("Help me write a Python function to sort a list")}
                className="p-4 glass-effect rounded-lg text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">💻 Code Assistance</h3>
                <p className="text-sm text-gray-400">Get help with programming and debugging</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput("Write a creative story about a robot learning to paint")}
                className="p-4 glass-effect rounded-lg text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">🎨 Creative Writing</h3>
                <p className="text-sm text-gray-400">Generate stories, poems, and creative content</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput("Plan a healthy meal for the week")}
                className="p-4 glass-effect rounded-lg text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">📋 Planning & Organization</h3>
                <p className="text-sm text-gray-400">Get help with planning and organizing tasks</p>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  index={index}
                />
              ))}
            </AnimatePresence>
            
            {isTyping && <TypingIndicator />}
            
            {/* Action buttons for existing conversations */}
            {messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center space-x-4 pt-4"
              >
                <button
                  onClick={handleCopyAll}
                  className="flex items-center space-x-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy Chat</span>
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </motion.div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-2 sm:p-4 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-3 sm:p-4">
            <div className="flex items-end space-x-2 sm:space-x-3">
              <button
                onClick={handleVoiceToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'hover:bg-white/10 text-gray-400'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none max-h-32 text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '24px' }}
                />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden sm:inline">Press Enter to send</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Shift+Enter for new line</span>
                <span className="sm:hidden">Enter to send</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-white/10 rounded">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatInterface

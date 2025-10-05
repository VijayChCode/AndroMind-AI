import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Search,
  Download,
  Upload,
  Settings
} from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { useState } from 'react'

const Sidebar = () => {
  const { 
    sidebarOpen, 
    chats, 
    currentChatId, 
    setCurrentChat, 
    deleteChat, 
    updateChatTitle,
    clearAllChats 
  } = useChatStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditStart = (chat: any) => {
    setEditingChat(chat.id)
    setEditTitle(chat.title)
  }

  const handleEditSave = () => {
    if (editingChat && editTitle.trim()) {
      updateChatTitle(editingChat, editTitle.trim())
    }
    setEditingChat(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingChat(null)
    setEditTitle('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 sm:hidden"
            onClick={() => useChatStore.getState().toggleSidebar()}
          />
          
          <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-80 sm:w-80 glass-effect border-r border-white/10 flex flex-col fixed sm:relative inset-y-0 left-0 z-40"
        >
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      currentChatId === chat.id
                        ? 'bg-primary-600/20 border border-primary-500/30'
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setCurrentChat(chat.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {editingChat === chat.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleEditSave}
                            onKeyDown={handleKeyPress}
                            className="w-full bg-transparent border-none outline-none text-white text-sm"
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm text-white truncate">{chat.title}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {chat.messages.length} messages
                        </p>
                      </div>
                      
                      {currentChatId === chat.id && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditStart(chat)
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteChat(chat.id)
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export Chats</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import Chats</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            
            {chats.length > 0 && (
              <button
                onClick={clearAllChats}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Clear All Chats</span>
              </button>
            )}
          </div>
        </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar

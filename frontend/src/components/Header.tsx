import { motion } from 'framer-motion'
import { Menu, Sun, Moon, Settings, Plus, LogOut, User } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import SettingsModal from './SettingsModal'

const Header = () => {
  const { toggleSidebar, theme, setTheme, createChat } = useChatStore()
  const { user, logout } = useAuthStore()
  const [isCreating, setIsCreating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleNewChat = async () => {
    setIsCreating(true)
    createChat('New Chat')
    // You could add a loading animation here
    setTimeout(() => setIsCreating(false), 500)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-effect border-b border-white/10 px-3 sm:px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold gradient-text">AndroMind AI</h1>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handleNewChat}
            disabled={isCreating}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg transition-colors focus-ring"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {isCreating ? 'Creating...' : 'New Chat'}
            </span>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">{user?.name}</span>
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-lg py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-white/10 transition-colors text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </motion.header>
  )
}

export default Header

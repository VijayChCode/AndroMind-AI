import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AuthModal from './components/auth/AuthModal'
import { useChatStore } from './store/chatStore'
import { useAuthStore } from './store/authStore'
import LegalPages from './components/legal/LegalPages'

function App() {
  const { theme } = useChatStore()
  const { isAuthenticated, refreshAuthToken } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showLegalPages, setShowLegalPages] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    // Initialize authentication
    const initAuth = async () => {
      if (!isAuthenticated) {
        const refreshed = await refreshAuthToken()
        if (!refreshed) {
          setShowAuthModal(true)
        }
      }
      setIsInitializing(false)
    }

    initAuth()
  }, [isAuthenticated, refreshAuthToken])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading AndroMind AI...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
        
        {!isAuthenticated ? (
          <div className="flex flex-col min-h-screen">
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl font-bold text-white">A</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to AndroMind AI</h1>
                <p className="text-gray-400 mb-8 max-w-md">
                  Experience the future of AI conversation with our advanced ChatGPT clone. 
                  Sign in to start chatting with our intelligent assistant.
                </p>
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200"
                >
                  Get Started
                </motion.button>
              </motion.div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
                <p>&copy; 2024 AndroMind AI. All rights reserved.</p>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <button
                    onClick={() => setShowLegalPages(true)}
                    className="hover:text-primary-400 transition-colors"
                  >
                    Terms of Service
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setShowLegalPages(true)}
                    className="hover:text-primary-400 transition-colors"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-screen relative"
          >
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <Routes>
                <Route path="/" element={<ChatInterface />} />
                <Route path="/chat/:id" element={<ChatInterface />} />
              </Routes>
            </div>
          </motion.div>
        )}
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
        
        <LegalPages 
          isOpen={showLegalPages} 
          onClose={() => setShowLegalPages(false)} 
        />
      </div>
    </Router>
  )
}

export default App

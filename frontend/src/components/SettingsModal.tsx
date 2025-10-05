import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Palette, Bell, Shield, Database, Download, Upload } from 'lucide-react'
import { useState } from 'react'
import { useChatStore } from '../store/chatStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, setTheme, clearAllChats } = useChatStore()
  const [activeTab, setActiveTab] = useState('appearance')

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
  ]

  const handleExportData = () => {
    const data = {
      chats: useChatStore.getState().chats,
      settings: {
        theme,
        sidebarOpen: useChatStore.getState().sidebarOpen
      },
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `andromind-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Here you would implement the import logic
        console.log('Import data:', data)
      } catch (error) {
        console.error('Error importing data:', error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-effect rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold text-white">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex h-96">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/10 p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-600/20 text-primary-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Appearance</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Theme
                        </label>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setTheme('light')}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              theme === 'light'
                                ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                                : 'border-white/20 text-gray-400 hover:border-white/40'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                                : 'border-white/20 text-gray-400 hover:border-white/40'
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <p className="text-gray-400">Notification settings will be available in future updates.</p>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
                    <p className="text-gray-400">Privacy settings will be available in future updates.</p>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Data Management</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Export Data</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Download all your conversations and settings as a JSON file.
                        </p>
                        <button
                          onClick={handleExportData}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Data</span>
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Import Data</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Import conversations from a previously exported JSON file.
                        </p>
                        <label className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>Import Data</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Permanently delete all your conversations and data.
                        </p>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
                              clearAllChats()
                              onClose()
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Clear All Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SettingsModal

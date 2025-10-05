import { useState } from 'react'
import TermsAndConditions from './TermsAndConditions'
import PrivacyPolicy from './PrivacyPolicy'

type LegalPage = 'terms' | 'privacy' | null

interface LegalPagesProps {
  isOpen: boolean
  onClose: () => void
}

const LegalPages = ({ isOpen, onClose }: LegalPagesProps) => {
  const [currentPage, setCurrentPage] = useState<LegalPage>(null)

  const handleBack = () => {
    if (currentPage) {
      setCurrentPage(null)
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {!currentPage ? (
          <div className="glass-effect rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Legal Information</h1>
              <p className="text-gray-400">Please review our terms and privacy policy</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentPage('terms')}
                className="p-6 glass-effect rounded-xl hover:bg-white/10 transition-colors text-left group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      Terms and Conditions
                    </h3>
                    <p className="text-gray-400 text-sm">Our terms of service</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Read about your rights and responsibilities when using AndroMind AI.
                </p>
              </button>

              <button
                onClick={() => setCurrentPage('privacy')}
                className="p-6 glass-effect rounded-xl hover:bg-white/10 transition-colors text-left group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      Privacy Policy
                    </h3>
                    <p className="text-gray-400 text-sm">How we protect your data</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Learn about how we collect, use, and protect your personal information.
                </p>
              </button>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {currentPage === 'terms' && <TermsAndConditions onBack={handleBack} />}
            {currentPage === 'privacy' && <PrivacyPolicy onBack={handleBack} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalPages

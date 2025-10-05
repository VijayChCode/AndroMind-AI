import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import OTPForm from './OTPForm'
import ResetPasswordForm from './ResetPasswordForm'
import LegalPages from '../legal/LegalPages'

type AuthMode = 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  initialEmail?: string
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login', initialEmail = '' }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState(initialEmail)
  const [resetToken, setResetToken] = useState('')
  const [showLegalPages, setShowLegalPages] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setEmail(initialEmail)
    }
  }, [isOpen, initialMode, initialEmail])

  const handleClose = () => {
    setMode('login')
    setEmail('')
    onClose()
  }

  const handleSwitchToLogin = () => setMode('login')
  const handleSwitchToRegister = () => setMode('register')
  const handleSwitchToForgotPassword = () => setMode('forgot-password')

  const handleSwitchToResetPassword = (userEmail: string, token: string) => {
    setEmail(userEmail)
    setResetToken(token)
    setMode('reset-password')
  }

  const handleResetPasswordSuccess = () => {
    setMode('login')
    setEmail('')
    setResetToken('')
  }

  const handleOpenLegalPages = () => {
    setShowLegalPages(true)
  }

  const handleCloseLegalPages = () => {
    setShowLegalPages(false)
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-dark-800 hover:bg-dark-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Auth Forms */}
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm
                    onSwitchToRegister={handleSwitchToRegister}
                    onSwitchToForgotPassword={handleSwitchToForgotPassword}
                  />
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterForm 
                    onSwitchToLogin={handleSwitchToLogin} 
                    onOpenLegalPages={handleOpenLegalPages}
                  />
                </motion.div>
              )}

              {mode === 'forgot-password' && (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ForgotPasswordForm onSwitchToLogin={handleSwitchToLogin} />
                </motion.div>
              )}

              {mode === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <OTPForm
                    email={email}
                    onSwitchToLogin={handleSwitchToLogin}
                    onSwitchToResetPassword={handleSwitchToResetPassword}
                  />
                </motion.div>
              )}

              {mode === 'reset-password' && (
                <motion.div
                  key="reset-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResetPasswordForm
                    email={email}
                    token={resetToken}
                    onSuccess={handleResetPasswordSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      
      {/* Legal Pages Modal */}
      <LegalPages 
        isOpen={showLegalPages} 
        onClose={handleCloseLegalPages} 
      />
    </AnimatePresence>
  )
}

export default AuthModal

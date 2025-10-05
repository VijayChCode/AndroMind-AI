import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits')
})

type OTPFormData = z.infer<typeof otpSchema>

interface OTPFormProps {
  email: string
  onSwitchToLogin: () => void
  onSwitchToResetPassword?: (email: string, token: string) => void
}

const OTPForm = ({ email, onSwitchToLogin, onSwitchToResetPassword }: OTPFormProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isResending, setIsResending] = useState(false)
  const { verifyOTP, sendOTP, isLoading } = useAuthStore()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  const {
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email }
  })

  useEffect(() => {
    setValue('email', email)
  }, [email, setValue])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setValue('otp', newOtp.join(''))

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onSubmit = async (data: OTPFormData) => {
    const result = await verifyOTP(data.email, data.otp)
    
    if (result.success) {
      toast.success('OTP verified successfully!')
      // For password reset flow, we'll generate a token and redirect
      if (onSwitchToResetPassword) {
        // Generate a temporary token for password reset
        const resetToken = btoa(`${data.email}:${Date.now()}`)
        onSwitchToResetPassword(data.email, resetToken)
      } else {
        onSwitchToLogin()
      }
    } else {
      toast.error(result.error || 'OTP verification failed')
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    const result = await sendOTP(email)
    
    if (result.success) {
      toast.success('OTP sent successfully!')
    } else {
      toast.error(result.error || 'Failed to send OTP')
    }
    setIsResending(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-effect rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
          <p className="text-gray-400">
            Enter the 6-digit code sent to <br />
            <span className="text-primary-400 font-semibold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold bg-dark-800 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-400 text-sm mt-2 text-center">{errors.otp.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-400 text-sm">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
          
          <button
            onClick={onSwitchToLogin}
            className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default OTPForm

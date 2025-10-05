import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

interface StrengthRule {
  label: string
  test: (password: string) => boolean
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const [strength, setStrength] = useState(0)
  const [rules, setRules] = useState<Array<{ label: string; passed: boolean }>>([])

  const strengthRules: StrengthRule[] = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd) => /\d/.test(pwd) },
    { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ]

  useEffect(() => {
    const newRules = strengthRules.map(rule => ({
      label: rule.label,
      passed: rule.test(password)
    }))
    
    setRules(newRules)
    
    const passedRules = newRules.filter(rule => rule.passed).length
    setStrength(passedRules)
  }, [password])

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-orange-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    if (strength <= 1) return 'Very Weak'
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-3 bg-dark-800 rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Password Strength</span>
        <span className={`text-sm font-medium ${
          strength <= 2 ? 'text-red-400' : 
          strength <= 3 ? 'text-yellow-400' : 
          strength <= 4 ? 'text-blue-400' : 'text-green-400'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
          className={`h-2 rounded-full ${getStrengthColor()}`}
        />
      </div>

      <div className="space-y-1">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            {rule.passed ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <X className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-xs ${
              rule.passed ? 'text-green-400' : 'text-gray-500'
            }`}>
              {rule.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default PasswordStrength

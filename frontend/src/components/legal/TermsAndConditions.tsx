import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Users, Lock, FileText } from 'lucide-react'

interface TermsAndConditionsProps {
  onBack: () => void
}

const TermsAndConditions = ({ onBack }: TermsAndConditionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms and Conditions</h1>
          </div>
        </div>

        {/* Content */}
        <div className="glass-effect rounded-2xl p-6 sm:p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-sm mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary-400" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using AndroMind AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-400" />
                2. Use License
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Permission is granted to temporarily use AndroMind AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary-400" />
                3. User Accounts and Security
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Safeguarding the password and all activities under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information remains accurate and up-to-date</li>
                <li>Using strong passwords and keeping them confidential</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">4. Prohibited Uses</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You may not use our service:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">5. AI Service Usage</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                AndroMind AI provides AI-powered chat services. By using our service, you agree that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI responses are generated automatically and may not always be accurate</li>
                <li>You will not use the service for illegal, harmful, or inappropriate purposes</li>
                <li>We reserve the right to monitor and moderate conversations</li>
                <li>We may suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">6. Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                In no event shall AndroMind AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
                <br />
                <span className="text-primary-400">support@andromind-ai.com</span>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                By using AndroMind AI, you acknowledge that you have read and understood these terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TermsAndConditions

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, X, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface OTPVerificationProps {
  email: string
  isOpen: boolean
  onClose: () => void
  onVerify: (code: string) => Promise<void>
  onResend: () => Promise<void>
  isLoading?: boolean
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  isOpen,
  onClose,
  onVerify,
  onResend,
  isLoading = false
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setTimer(60)
      setCanResend(false)
      setError(null)
      setFocusedIndex(0)
      // Focus first input after modal opens
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    }
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    if (digits.length === 6) {
      const newOtp = digits.split('')
      setOtp(newOtp)
      setError(null)
      // Auto-submit after paste
      setTimeout(() => handleVerify(), 300)
    } else if (digits.length > 0) {
      const newOtp = [...otp]
      digits.split('').forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit
      })
      setOtp(newOtp)
      setError(null)
      // Focus the next empty input
      const nextEmpty = newOtp.findIndex(d => d === '')
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty]?.focus()
        setFocusedIndex(nextEmpty)
      }
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsVerifying(true)
    setError(null)
    try {
      await onVerify(code)
      toast.success('Email verified successfully! 🎉')
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
      // Reset OTP inputs on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setFocusedIndex(0)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimer(60)
    setError(null)
    try {
      await onResend()
      toast.success('New code sent to your email!')
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
      setCanResend(true)
    }
  }

  const handleClose = () => {
    if (!isVerifying && !isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] rounded-3xl p-8 max-w-md w-full border border-[#F4FDFF]/20 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-16 h-16 bg-[#F4FDFF]/10 rounded-2xl flex items-center justify-center mb-4"
            >
              <Mail className="w-8 h-8 text-[#F4FDFF]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#F4FDFF]">Verify Your Email</h2>
            <p className="text-[#F4FDFF]/60 text-sm mt-1">
              We sent a 6-digit code to <br />
              <span className="text-[#F4FDFF]/80 font-medium">{email}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#F4FDFF]/10 rounded-lg transition-colors"
            disabled={isVerifying || isLoading}
          >
            <X className="w-5 h-5 text-[#F4FDFF]/60 hover:text-[#F4FDFF]" />
          </button>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              disabled={isVerifying || isLoading}
              className={`w-14 h-16 text-center text-2xl font-bold bg-[#F4FDFF]/5 border-2 rounded-xl text-[#F4FDFF] outline-none transition-all duration-200 ${
                focusedIndex === index
                  ? 'border-[#F4FDFF] ring-2 ring-[#F4FDFF]/20'
                  : digit
                  ? 'border-[#938BA1]'
                  : 'border-[#F4FDFF]/20'
              } ${error ? 'border-red-500' : ''}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer & Resend */}
        <div className="flex items-center justify-between text-sm mb-6">
          <span className="text-[#F4FDFF]/40">
            {timer > 0 ? (
              <>⏱️ Resend in <span className="text-[#F4FDFF]/60 font-medium">{timer}s</span></>
            ) : (
              '📩 Code expired'
            )}
          </span>
          <button
            onClick={handleResend}
            disabled={!canResend || isVerifying || isLoading}
            className={`text-[#938BA1] hover:text-[#F4FDFF] transition-all duration-300 flex items-center gap-1 ${
              !canResend || isVerifying || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Mail className="w-4 h-4" />
            Resend Code
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isVerifying || isLoading}
            className="flex-1 px-4 py-3 border border-[#F4FDFF]/20 text-[#F4FDFF] rounded-xl hover:bg-[#F4FDFF]/10 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={isVerifying || isLoading || otp.join('').length !== 6}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              <><Check size={18} /> Verify</>
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-[#F4FDFF]/30 mt-4">
          🔒 Your verification code expires in 15 minutes
        </p>
      </motion.div>
    </motion.div>
  )
}
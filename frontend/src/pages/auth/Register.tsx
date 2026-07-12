import React, { useState, useEffect } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Mail, Lock, User, Phone, CheckCircle, Eye, EyeOff, 
  AlertCircle, Shield, Crown, Diamond, ArrowRight, Award, 
  Heart, Globe, Zap, Bell, Clock, Users, Loader2, Check,
  XCircle, WifiOff
} from 'lucide-react'

import { authApi } from '../../api/auth.api'
import type { RegisterData } from '../../types/auth.types'
// Remove this import: import { testBackendConnection } from '../../utils/testApi'

// ========== PASSWORD STRENGTH ==========
const getPasswordStrength = (password: string) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  const score = Object.values(requirements).filter(Boolean).length
  let label = 'Weak'
  let color = 'bg-[#938BA1]'
  if (score >= 4) { label = 'Strong'; color = 'bg-[#F4FDFF]' }
  else if (score >= 3) { label = 'Good'; color = 'bg-[#938BA1]' }
  else if (score >= 2) { label = 'Fair'; color = 'bg-[#1C448E]' }
  return { score, label, color, requirements }
}

// ========== VALIDATION SCHEMA ==========
const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password'),
  fullName: yup.string().min(2, 'Min 2 characters').required('Full name required'),
  phone: yup.string()
    .matches(/^(080|081|090|091|070)\d{8}$/, 'Enter a valid Nigerian phone number (e.g., 08012345678)')
    .required('Phone required'),
  termsAccepted: yup.boolean().oneOf([true], 'Accept terms').required(),
  privacyPolicyAccepted: yup.boolean().oneOf([true], 'Accept privacy policy').required(),
  marketingConsent: yup.boolean().default(false)
})

type RegisterSchemaType = yup.InferType<typeof registerSchema>

// ========== OTP VERIFICATION COMPONENT ==========
interface OTPVerificationProps {
  email: string
  onVerify: (code: string) => void
  onResend: () => void
  isLoading: boolean
  onClose?: () => void
  error?: string | null
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading,
  onClose,
  error
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

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

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length === 6) {
      onVerify(code)
    } else {
      toast.error('Please enter all 6 digits')
    }
  }

  const handleResend = () => {
    setTimer(60)
    setCanResend(false)
    onResend()
  }

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E] rounded-3xl p-8 max-w-md w-full border border-[#F4FDFF]/20 shadow-2xl">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-16 h-16 bg-[#F4FDFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Mail className="w-8 h-8 text-[#F4FDFF]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#F4FDFF]">Verify Your Email</h2>
          <p className="text-[#F4FDFF]/60 text-sm mt-2">
            We sent a verification code to <span className="text-[#F4FDFF]/80 font-medium">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={setInputRef(index)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              className={`w-12 h-14 text-center text-2xl font-bold bg-[#F4FDFF]/5 border-2 rounded-xl text-[#F4FDFF] outline-none transition-all ${
                focusedIndex === index
                  ? 'border-[#F4FDFF] ring-2 ring-[#F4FDFF]/20'
                  : 'border-[#F4FDFF]/20'
              }`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm mb-6">
          <span className="text-[#F4FDFF]/40">
            {timer > 0 ? `Resend in ${timer}s` : 'Code expired'}
          </span>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-[#938BA1] hover:text-[#F4FDFF] transition-colors ${
              !canResend ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend Code
          </button>
        </div>

        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#F4FDFF]/20 text-[#F4FDFF] rounded-xl hover:bg-[#F4FDFF]/10 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              <><Check size={18} /> Verify</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ========== MAIN REGISTER COMPONENT ==========
const Register: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''))
  const [isHovered, setIsHovered] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isBackendDown, setIsBackendDown] = useState(false)

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    resolver: yupResolver(registerSchema) as any,
    mode: 'onChange',
    defaultValues: { 
      termsAccepted: false, 
      privacyPolicyAccepted: false, 
      marketingConsent: false 
    }
  })

  const watchPassword = watch('password', '')
  const watchTermsAccepted = watch('termsAccepted')
  const watchPrivacyAccepted = watch('privacyPolicyAccepted')

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(watchPassword))
  }, [watchPassword])

  // Test backend connection on mount - inline version without import
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log('🔍 Testing backend connection...')
        // Simple fetch to test if backend is accessible
        const response = await fetch('http://localhost:5000/api/health')
        if (response.ok) {
          console.log('✅ Backend is running')
          setIsBackendDown(false)
        } else {
          console.error('❌ Backend returned error:', response.status)
          setIsBackendDown(true)
          toast.error('Cannot connect to server. Please make sure the backend is running.')
        }
      } catch (error) {
        console.error('❌ Backend connection failed:', error)
        setIsBackendDown(true)
        toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.')
      }
    }
    checkBackend()
  }, [])

  // ========== SEND OTP MUTATION ==========
  const sendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      console.log('📧 Sending OTP to:', email)
      const response = await authApi.sendOTP({ email, type: 'verification' })
      console.log('✅ OTP response:', response)
      return response
    }
  })

  // ========== REGISTER MUTATION ==========
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchemaType) => {
      const registerData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      } as RegisterData
      
      console.log('📝 Sending register data:', registerData)
      return authApi.register(registerData)
    },
    onSuccess: async (response) => {
      console.log('✅ Registration success:', response)
      setRegisteredEmail(response.user.email)
      
      try {
        await sendOTPMutation.mutateAsync(response.user.email)
        setShowOTP(true)
        setOtpError(null)
        toast.success('Account created! Please verify your email.')
      } catch (otpError: any) {
        console.error('❌ OTP sending failed:', otpError)
        const errorMessage = otpError?.response?.data?.message || 
                           otpError?.error?.message || 
                           'Account created but OTP failed. Please request a new code.'
        setOtpError(errorMessage)
        toast.error(errorMessage)
        setShowOTP(true)
      }
    },
    onError: (error: any) => {
      console.error('❌ Registration error details:', error)
      
      // Handle network errors specifically
      if (error?.error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
        setIsBackendDown(true)
        toast.error('Network error: Cannot connect to server. Please check if backend is running.')
        return
      }
      
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.error?.message) {
        errorMessage = error.error.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      if (errorMessage.toLowerCase().includes('email already exists') || 
          errorMessage.toLowerCase().includes('email already registered')) {
        errorMessage = 'This email is already registered. Please login or use a different email.'
      } else if (errorMessage.toLowerCase().includes('phone already exists') || 
                 errorMessage.toLowerCase().includes('phone already registered')) {
        errorMessage = 'This phone number is already registered. Please use a different number.'
      }
      
      toast.error(errorMessage)
    }
  })

  // ========== OTP VERIFICATION MUTATION ==========
  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      console.log('🔐 Verifying OTP:', data)
      const response = await authApi.verifyOTP(data)
      return response
    },
    onSuccess: () => {
      setShowOTP(false)
      setOtpError(null)
      toast.success('Email verified successfully! 🎉')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      console.error('❌ OTP verification error:', error)
      const message = error?.response?.data?.message || 
                     error?.error?.message || 
                     'Invalid verification code'
      setOtpError(message)
      toast.error(message)
    }
  })

  // ========== RESEND OTP MUTATION ==========
  const resendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      console.log('📧 Resending OTP to:', email)
      const response = await authApi.resendOTP({ email, type: 'verification' })
      return response
    },
    onSuccess: () => {
      setOtpError(null)
      toast.success('New code sent to your email!')
    },
    onError: (error: any) => {
      console.error('❌ Resend OTP error:', error)
      const message = error?.response?.data?.message || 
                     error?.error?.message || 
                     'Failed to resend code'
      setOtpError(message)
      toast.error(message)
    }
  })

  // ========== SUBMIT HANDLER ==========
  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    if (isBackendDown) {
      toast.error('Cannot connect to server. Please check your connection.')
      return
    }
    
    console.log('📝 Form submitted with data:', data)
    setIsRegistering(true)
    try {
      await registerMutation.mutateAsync(data)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsRegistering(false)
    }
  }

  // ========== OTP HANDLERS ==========
  const handleVerifyOTP = async (code: string) => {
    await verifyOTPMutation.mutateAsync({
      email: registeredEmail,
      code
    })
  }

  const handleResendOTP = async () => {
    if (registeredEmail) {
      await resendOTPMutation.mutateAsync(registeredEmail)
    } else {
      toast.error('No email found. Please try registering again.')
      setShowOTP(false)
    }
  }

  const handleCloseOTP = () => {
    setShowOTP(false)
    setOtpError(null)
  }

  const benefits = [
    { icon: Shield, title: 'Secure Identity Verification', desc: 'Multi-level verification ensures safe returns', color: '#F4FDFF' },
    { icon: Globe, title: 'Smart Location Matching', desc: 'AI-powered finds items near you instantly', color: '#938BA1' },
    { icon: Award, title: 'Reward System', desc: 'Earn rewards for helping others', color: '#F4FDFF' },
    { icon: Heart, title: 'Privacy First', desc: 'Your data is encrypted and secure', color: '#938BA1' },
    { icon: Zap, title: 'Fast Claims Process', desc: 'Verified users get priority', color: '#F4FDFF' },
    { icon: Bell, title: 'Real-time Notifications', desc: 'Instant updates on your items', color: '#938BA1' }
  ]

  // Show loading state
  if (registerMutation.isPending || sendOTPMutation.isPending || isRegistering) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4FDFF]/30 border-t-[#F4FDFF] rounded-full animate-spin mx-auto" />
          <p className="text-[#F4FDFF]/60 mt-4">Creating your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F4FDFF] to-[#938BA1] rounded-2xl shadow-2xl mb-4 relative"
            >
              <Shield className="w-8 h-8 text-[#1C448E]" />
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-4 h-4 text-[#F4FDFF]" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="mt-2 text-[#F4FDFF]/50">Join the revolution in lost and found technology</p>
          </motion.div>

          {/* Backend Status Warning */}
          {isBackendDown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
            >
              <WifiOff className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium">Server Connection Error</p>
                <p className="text-xs text-red-400/70">Cannot connect to backend server. Please make sure the server is running on port 5000.</p>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-6 border border-[#F4FDFF]/10">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-[#F4FDFF]" />
                  <h2 className="text-xl font-bold text-[#F4FDFF]">Why Join Secure Finder?</h2>
                  <Diamond className="w-4 h-4 text-[#938BA1]" />
                </div>
                
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#F4FDFF]/5 hover:bg-[#F4FDFF]/10 transition-all duration-300 border border-transparent hover:border-[#F4FDFF]/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F4FDFF]/10 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5" style={{ color: benefit.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#F4FDFF]">{benefit.title}</h3>
                        <p className="text-xs text-[#F4FDFF]/40">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#938BA1]" />
                    <span className="text-sm text-[#F4FDFF]/70">
                      Already have an account?{' '}
                      <Link to="/login" className="text-[#938BA1] hover:text-[#F4FDFF] font-semibold transition-colors">
                        Sign in here
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-6 border border-[#F4FDFF]/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '50K+', label: 'Active Users', icon: Users },
                    { value: '99.9%', label: 'Success Rate', icon: Award },
                    { value: '10K+', label: 'Items Found', icon: Heart },
                    { value: '48h', label: 'Avg Recovery', icon: Clock },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -3, backgroundColor: 'rgba(244,253,255,0.1)' }}
                      className="text-center p-3 rounded-xl bg-[#F4FDFF]/5 transition-all duration-300"
                    >
                      <stat.icon className="w-5 h-5 text-[#938BA1] mx-auto mb-2" />
                      <div className="text-lg font-bold text-[#F4FDFF]">{stat.value}</div>
                      <div className="text-xs text-[#F4FDFF]/30">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-[#938BA1] to-[#1C448E] rounded-3xl blur-2xl"
                animate={{ opacity: isHovered ? 0.5 : 0.25, scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#F4FDFF]/10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.fullName && <p className="text-[#938BA1] text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.email && <p className="text-[#938BA1] text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="080 1234 5678"
                        className="w-full pl-10 pr-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-[#938BA1] text-xs mt-1">{errors.phone.message}</p>}
                    <p className="text-[10px] text-[#F4FDFF]/30 mt-1">Enter a valid Nigerian number (e.g., 08012345678)</p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30 hover:text-[#F4FDFF]/60 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[#938BA1] text-xs mt-1">{errors.password.message}</p>}
                    {watchPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#F4FDFF]/50">Password strength</span>
                          <span className={passwordStrength.score >= 4 ? 'text-[#F4FDFF]' : passwordStrength.score >= 3 ? 'text-[#938BA1]' : 'text-[#1C448E]'}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#F4FDFF]/10 rounded-full overflow-hidden">
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-10 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30 hover:text-[#F4FDFF]/60 transition-colors">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[#938BA1] text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register('termsAccepted')} className="w-4 h-4 rounded border-[#F4FDFF]/30 bg-[#F4FDFF]/5 text-[#938BA1] focus:ring-[#F4FDFF]/20" />
                      <span className="text-sm text-[#F4FDFF]/50 group-hover:text-[#F4FDFF]/70 transition-colors">I accept the <a href="/terms" className="text-[#938BA1] hover:text-[#F4FDFF] transition-colors">Terms and Conditions</a></span>
                    </label>
                    {errors.termsAccepted && <p className="text-[#938BA1] text-xs">{errors.termsAccepted.message}</p>}
                    
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register('privacyPolicyAccepted')} className="w-4 h-4 rounded border-[#F4FDFF]/30 bg-[#F4FDFF]/5 text-[#938BA1] focus:ring-[#F4FDFF]/20" />
                      <span className="text-sm text-[#F4FDFF]/50 group-hover:text-[#F4FDFF]/70 transition-colors">I accept the <a href="/privacy" className="text-[#938BA1] hover:text-[#F4FDFF] transition-colors">Privacy Policy</a></span>
                    </label>
                    {errors.privacyPolicyAccepted && <p className="text-[#938BA1] text-xs">{errors.privacyPolicyAccepted.message}</p>}
                    
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register('marketingConsent')} className="w-4 h-4 rounded border-[#F4FDFF]/30 bg-[#F4FDFF]/5 text-[#938BA1] focus:ring-[#F4FDFF]/20" />
                      <span className="text-sm text-[#F4FDFF]/50 group-hover:text-[#F4FDFF]/70 transition-colors">Receive updates, tips, and offers</span>
                    </label>
                  </div>

                  {/* Security Note */}
                  <div className="p-3 bg-[#938BA1]/10 border border-[#938BA1]/20 rounded-xl">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-[#938BA1] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#F4FDFF]/70">Security Information</p>
                        <p className="text-xs text-[#F4FDFF]/40 mt-1">
                          Your information is encrypted and stored securely.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={registerMutation.isPending || isSubmitting || !watchTermsAccepted || !watchPrivacyAccepted || isBackendDown}
                    className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#938BA1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerMutation.isPending || isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-[#1C448E]/30 border-t-[#1C448E] rounded-full animate-spin" /> Creating Account...</>
                    ) : (
                      <><Shield size={18} /> Create Secure Account <ArrowRight size={18} /></>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-[#F4FDFF]/30 pt-2">
                    By registering, you agree to our Terms and confirm that you have read our Privacy Policy.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTP && (
          <OTPVerification
            email={registeredEmail}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            isLoading={verifyOTPMutation.isPending || resendOTPMutation.isPending}
            onClose={handleCloseOTP}
            error={otpError}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Register
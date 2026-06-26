import React, { useState, useEffect, useRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Mail, Lock, User, Phone, IdCard, CheckCircle, Eye, EyeOff, 
  AlertCircle, Shield, Crown, Diamond, ArrowRight, Award, 
  Heart, Globe, Zap, Bell, Clock, Users, Upload, X, FileCheck,
  Loader2, Check
} from 'lucide-react'

import { authApi } from '../../api/auth.api'
import type { RegisterData } from '../../types/auth.types'

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
  phone: yup.string().min(10, 'Enter valid phone number').required('Phone required'),
  identityType: yup.string().required('Select ID type'),
  identityNumber: yup.string().min(6, 'Min 6 characters').required('ID number required'),
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
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading,
  onClose
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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

// ========== DOCUMENT UPLOAD COMPONENT ==========
interface DocumentUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  previewUrl: string | null
  error?: string
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  selectedFile,
  previewUrl,
  error
}) => {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image or PDF')
        return
      }
      onFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image or PDF')
        return
      }
      onFileSelect(file)
    }
  }

  const handleRemove = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
          dragOver
            ? 'border-[#F4FDFF] bg-[#F4FDFF]/10'
            : selectedFile
            ? 'border-[#938BA1] bg-[#938BA1]/5'
            : 'border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40'
        } ${error ? 'border-[#938BA1]' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        {selectedFile && previewUrl ? (
          <div className="relative">
            <div className="flex items-center gap-3 justify-center">
              {selectedFile.type.startsWith('image/') ? (
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-[#F4FDFF]/10 flex items-center justify-center">
                  <FileCheck className="w-8 h-8 text-[#938BA1]" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm text-[#F4FDFF]/80 truncate max-w-[150px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#F4FDFF]/40">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-[#1C448E] rounded-full hover:bg-[#0F2A5E] transition-colors"
            >
              <X className="w-4 h-4 text-[#F4FDFF]" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="w-8 h-8 text-[#938BA1] mx-auto mb-2" />
            <p className="text-sm text-[#F4FDFF]/60">
              Drag & drop or <span className="text-[#938BA1] hover:text-[#F4FDFF] transition-colors">browse</span>
            </p>
            <p className="text-xs text-[#F4FDFF]/30 mt-1">
              JPG, PNG, PDF (max 5MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-[#938BA1] text-xs">{error}</p>}
    </div>
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
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentPreview, setDocumentPreview] = useState<string | null>(null)

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    resolver: yupResolver(registerSchema) as any,
    mode: 'onChange',
    defaultValues: { 
      identityType: 'national_id', 
      termsAccepted: false, 
      privacyPolicyAccepted: false, 
      marketingConsent: false 
    }
  })

  const watchPassword = watch('password', '')
  const watchTermsAccepted = watch('termsAccepted')
  const watchPrivacyAccepted = watch('privacyPolicyAccepted')
  const watchIdentityType = watch('identityType', 'national_id')
  const watchEmail = watch('email', '')

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(watchPassword))
  }, [watchPassword])

  const handleDocumentSelect = (file: File | null) => {
    setDocumentFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDocumentPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setDocumentPreview(null)
    }
  }

  // ========== SEND OTP MUTATION ==========
  const sendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await authApi.sendOTP({ email, type: 'verification' })
      return response
    }
  })

  // ========== REGISTER MUTATION ==========
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchemaType) => {
      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fullName: data.fullName,
        phone: data.phone,
        identityType: data.identityType as 'driving_license' | 'passport' | 'national_id' | 'other',
        identityNumber: data.identityNumber,
        termsAccepted: data.termsAccepted,
        privacyPolicyAccepted: data.privacyPolicyAccepted,
        marketingConsent: data.marketingConsent
      }
      return authApi.register(registerData)
    },
    onSuccess: async (response) => {
      setRegisteredEmail(response.user.email)
      // Send OTP after successful registration
      await sendOTPMutation.mutateAsync(response.user.email)
      setShowOTP(true)
      toast.success('Account created! Please verify your email.')
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Registration failed')
    }
  })

  // ========== OTP VERIFICATION MUTATION ==========
  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const response = await authApi.verifyOTP(data)
      return response
    },
    onSuccess: () => {
      setShowOTP(false)
      toast.success('Email verified successfully! 🎉')
      navigate('/login')
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Invalid verification code')
    }
  })

  // ========== RESEND OTP MUTATION ==========
  const resendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await authApi.resendOTP({ email, type: 'verification' })
      return response
    },
    onSuccess: () => {
      toast.success('New code sent to your email!')
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Failed to resend code')
    }
  })

  // ========== SUBMIT HANDLER ==========
  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    if (!documentFile) {
      toast.error('Please upload an identity document')
      return
    }
    await registerMutation.mutateAsync(data)
  }

  // ========== OTP HANDLERS ==========
  const handleVerifyOTP = async (code: string) => {
    await verifyOTPMutation.mutateAsync({
      email: registeredEmail,
      code
    })
  }

  const handleResendOTP = async () => {
    await resendOTPMutation.mutateAsync(registeredEmail)
  }

  const identityTypeOptions = [
    { value: 'national_id', label: 'National ID', icon: IdCard },
    { value: 'passport', label: 'Passport', icon: Globe },
    { value: 'driving_license', label: "Driver's License", icon: Award },
    { value: 'other', label: 'Other ID', icon: Shield }
  ]

  const benefits = [
    { icon: Shield, title: 'Secure Identity Verification', desc: 'Multi-level verification ensures safe returns', color: '#F4FDFF' },
    { icon: Globe, title: 'Smart Location Matching', desc: 'AI-powered finds items near you instantly', color: '#938BA1' },
    { icon: Award, title: 'Reward System', desc: 'Earn rewards for helping others', color: '#F4FDFF' },
    { icon: Heart, title: 'Privacy First', desc: 'Your data is encrypted and secure', color: '#938BA1' },
    { icon: Zap, title: 'Fast Claims Process', desc: 'Verified users get priority', color: '#F4FDFF' },
    { icon: Bell, title: 'Real-time Notifications', desc: 'Instant updates on your items', color: '#938BA1' }
  ]

  // Show loading state
  if (registerMutation.isPending || isSubmitting || sendOTPMutation.isPending) {
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
      
      {/* Content */}
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
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-[#938BA1] text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Identity Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Identity Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {identityTypeOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex flex-col items-center p-2 border-2 rounded-xl cursor-pointer transition-all ${
                            watchIdentityType === option.value
                              ? 'border-[#F4FDFF] bg-[#F4FDFF]/20'
                              : 'border-[#F4FDFF]/15 hover:border-[#F4FDFF]/30'
                          }`}
                        >
                          <input type="radio" value={option.value} {...register('identityType')} className="sr-only" />
                          <option.icon className="w-5 h-5 text-[#938BA1] mb-1" />
                          <span className="text-xs font-medium text-[#F4FDFF]/70">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.identityType && <p className="text-[#938BA1] text-xs mt-1">{errors.identityType.message}</p>}
                  </div>

                  {/* Identity Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Identity Number *</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={18} />
                      <input
                        type="text"
                        {...register('identityNumber')}
                        placeholder="Enter your ID number"
                        className="w-full pl-10 pr-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.identityNumber && <p className="text-[#938BA1] text-xs mt-1">{errors.identityNumber.message}</p>}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Identity Document *</label>
                    <DocumentUpload
                      onFileSelect={handleDocumentSelect}
                      selectedFile={documentFile}
                      previewUrl={documentPreview}
                      error={errors.identityNumber?.message}
                    />
                    <p className="text-xs text-[#F4FDFF]/30 mt-1">
                      Upload a clear photo of your ID (JPG, PNG, PDF, max 5MB)
                    </p>
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
                          Your identity information is encrypted and stored securely for verification purposes only.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={registerMutation.isPending || isSubmitting || !watchTermsAccepted || !watchPrivacyAccepted || !documentFile}
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
            onClose={() => setShowOTP(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Register
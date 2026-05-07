import React, { useState, useEffect, useRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles, TorusKnot, Ring, Octahedron } from '@react-three/drei'
import toast from 'react-hot-toast'
import { 
  Mail, Lock, User, Phone, IdCard, CheckCircle, Eye, EyeOff, 
  AlertCircle, Shield, Crown, Diamond, ArrowRight,
  Award, Heart, Globe, Zap, Bell, Clock, Users
} from 'lucide-react'

import { authApi } from '../../api/auth.api'
import type { RegisterData } from '../../types/auth.types'

// ========== 3D SCENE FOR REGISTER PAGE ==========
const Register3DScene: React.FC = () => {
  const groupRef = useRef<any>(null)
  const torusRef = useRef<any>(null)
  const centerRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.03
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.08
      torusRef.current.rotation.z = t * 0.12
    }
    if (centerRef.current) {
      centerRef.current.rotation.y = t * 0.15
      centerRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.2}>
        <Octahedron args={[1.2, 0]} ref={centerRef}>
          <MeshDistortMaterial 
            color="#E5E4E2"
            distort={0.5}
            speed={1.8}
            roughness={0.08}
            metalness={0.95}
            emissive="#8b5cf6"
            emissiveIntensity={1}
          />
        </Octahedron>
      </Float>
      
      <TorusKnot args={[2.3, 0.08, 200, 32, 3, 4]} position={[0, 0, 0]} ref={torusRef}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          emissive="#4b0082"
          emissiveIntensity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </TorusKnot>
      
      <Ring args={[3.0, 3.3, 64]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#E5E4E2" 
          emissive="#c4b5fd" 
          emissiveIntensity={0.4}
          metalness={0.85}
          transparent
          opacity={0.6}
        />
      </Ring>
      
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 3.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const colors = ["#E5E4E2", "#8b5cf6", "#c4b5fd", "#a78bfa", "#7c3aed", "#6d28d9"]
        return (
          <Float key={i} speed={1 + (i * 0.05)} rotationIntensity={0.4} floatIntensity={1} 
                 position={[x, Math.sin(angle * 2) * 0.6, z]}>
            <Sphere args={[0.12, 48, 48]}>
              <MeshDistortMaterial 
                color={colors[i % colors.length]} 
                distort={0.3}
                speed={1.5}
                metalness={0.85}
                emissive="#4b0082"
                emissiveIntensity={0.4}
              />
            </Sphere>
          </Float>
        )
      })}
      
      <Sparkles count={600} scale={[12, 12, 12]} size={0.06} speed={0.4} color="#E5E4E2" />
      <Stars radius={20} depth={80} count={2500} factor={6} fade />
    </group>
  )
}

// Password strength checker
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
  let color = 'bg-red-500'
  if (score >= 4) { label = 'Strong'; color = 'bg-green-500' }
  else if (score >= 3) { label = 'Good'; color = 'bg-yellow-500' }
  else if (score >= 2) { label = 'Fair'; color = 'bg-orange-500' }
  return { score, label, color, requirements }
}

// Validation schema
const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password'),
  fullName: yup.string().min(2, 'Min 2 characters').required('Full name required'),
  phone: yup.string().required('Phone required'),
  identityType: yup.string().required('Select ID type'),
  identityNumber: yup.string().min(6, 'Min 6 characters').required('ID number required'),
  termsAccepted: yup.boolean().oneOf([true], 'Accept terms').required(),
  privacyPolicyAccepted: yup.boolean().oneOf([true], 'Accept privacy policy').required(),
  marketingConsent: yup.boolean().default(false)
})

type RegisterSchemaType = yup.InferType<typeof registerSchema>

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''))
  const [isHovered, setIsHovered] = useState(false)

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    // Fix: Cast the resolver to any to bypass the type mismatch
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

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(watchPassword))
  }, [watchPassword])

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchemaType) => {
      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fullName: data.fullName,
        phone: data.phone,
        identityType: data.identityType as 'national_id' | 'passport' | 'driving_license' | 'other',
        identityNumber: data.identityNumber,
        termsAccepted: data.termsAccepted || false,
        privacyPolicyAccepted: data.privacyPolicyAccepted || false,
        marketingConsent: data.marketingConsent || false
      }
      return authApi.register(registerData)
    },
    onSuccess: () => {
      toast.success('Account created successfully!')
      navigate('/login')
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Registration failed')
    }
  })

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    await registerMutation.mutateAsync(data)
  }

  const identityTypeOptions = [
    { value: 'national_id', label: 'National ID', icon: IdCard },
    { value: 'passport', label: 'Passport', icon: Globe },
    { value: 'driving_license', label: "Driver's License", icon: Award },
    { value: 'other', label: 'Other ID', icon: Shield }
  ]

  const benefits = [
    { icon: Shield, title: 'Secure Identity Verification', desc: 'Multi-level verification ensures safe returns', color: '#8b5cf6' },
    { icon: Globe, title: 'Smart Location Matching', desc: 'AI-powered finds items near you instantly', color: '#E5E4E2' },
    { icon: Award, title: 'Reward System', desc: 'Earn rewards for helping others', color: '#fbbf24' },
    { icon: Heart, title: 'Privacy First', desc: 'Your data is encrypted and secure', color: '#ec4899' },
    { icon: Zap, title: 'Fast Claims Process', desc: 'Verified users get priority', color: '#06b6d4' },
    { icon: Bell, title: 'Real-time Notifications', desc: 'Instant updates on your items', color: '#10b981' }
  ]

  if (registerMutation.isPending) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082]">
      
      {/* Full Screen 3D Background */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1} color="#E5E4E2" />
          <pointLight position={[-5, -5, -5]} intensity={0.7} color="#8b5cf6" />
          <pointLight position={[5, 5, 5]} intensity={0.7} color="#E5E4E2" />
          <pointLight position={[0, 6, 0]} intensity={0.6} color="#c4b5fd" />
          <Register3DScene />
        </Canvas>
      </div>
      
      <div className="fixed inset-0 bg-black/30" />
      
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
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl mb-4"
            >
              <Shield className="w-8 h-8 text-[#4b0082]" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Create Your Account</h1>
            <p className="mt-2 text-white/60">Join the revolution in lost and found technology</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-[#E5E4E2]" />
                  <h2 className="text-xl font-bold text-white">Why Join Secure Finder?</h2>
                  <Diamond className="w-4 h-4 text-[#E5E4E2]" />
                </div>
                
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5" style={{ color: benefit.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{benefit.title}</h3>
                        <p className="text-xs text-white/50">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white/80">
                      Already have an account?{' '}
                      <Link to="/login" className="text-[#E5E4E2] hover:text-white font-semibold">
                        Sign in here
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '50K+', label: 'Active Users', icon: Users },
                    { value: '99.9%', label: 'Success Rate', icon: Award },
                    { value: '10K+', label: 'Items Found', icon: Heart },
                    { value: '48h', label: 'Avg Recovery', icon: Clock },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -3 }}
                      className="text-center p-3 rounded-xl bg-white/5"
                    >
                      <stat.icon className="w-5 h-5 text-[#E5E4E2] mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/40">{stat.label}</div>
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
                className="absolute -inset-4 bg-gradient-to-r from-[#8b5cf6] to-[#4b0082] rounded-3xl blur-2xl"
                animate={{ opacity: isHovered ? 0.4 : 0.2, scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
                <motion.div 
                  className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(229,228,226,0.2), rgba(139,92,246,0.2), transparent)' }}
                  animate={{ opacity: isHovered ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Identity Type */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Identity Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {identityTypeOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex flex-col items-center p-2 border-2 rounded-xl cursor-pointer transition-all ${
                            watchIdentityType === option.value
                              ? 'border-[#E5E4E2] bg-white/20'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <input type="radio" value={option.value} {...register('identityType')} className="sr-only" />
                          <option.icon className="w-5 h-5 text-[#E5E4E2] mb-1" />
                          <span className="text-xs font-medium text-white">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Identity Number */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Identity Number</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="text"
                        {...register('identityNumber')}
                        placeholder="Enter your ID number"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                    </div>
                    {errors.identityNumber && <p className="text-red-400 text-xs mt-1">{errors.identityNumber.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    {watchPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Password strength</span>
                          <span className={passwordStrength.score >= 4 ? 'text-green-400' : passwordStrength.score >= 3 ? 'text-yellow-400' : 'text-red-400'}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register('termsAccepted')} className="w-4 h-4 rounded border-white/30 bg-white/5 text-[#E5E4E2] focus:ring-[#E5E4E2]" />
                      <span className="text-sm text-white/70">I accept the <a href="/terms" className="text-[#E5E4E2] hover:text-white">Terms and Conditions</a></span>
                    </label>
                    {errors.termsAccepted && <p className="text-red-400 text-xs">{errors.termsAccepted.message}</p>}
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register('privacyPolicyAccepted')} className="w-4 h-4 rounded border-white/30 bg-white/5 text-[#E5E4E2] focus:ring-[#E5E4E2]" />
                      <span className="text-sm text-white/70">I accept the <a href="/privacy" className="text-[#E5E4E2] hover:text-white">Privacy Policy</a></span>
                    </label>
                    {errors.privacyPolicyAccepted && <p className="text-red-400 text-xs">{errors.privacyPolicyAccepted.message}</p>}
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register('marketingConsent')} className="w-4 h-4 rounded border-white/30 bg-white/5 text-[#E5E4E2] focus:ring-[#E5E4E2]" />
                      <span className="text-sm text-white/70">Receive updates, tips, and offers</span>
                    </label>
                  </div>

                  {/* Security Note */}
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-yellow-300">Security Information</p>
                        <p className="text-xs text-yellow-300/70 mt-1">
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
                    disabled={registerMutation.isPending || isSubmitting || !watchTermsAccepted || !watchPrivacyAccepted}
                    className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerMutation.isPending || isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-[#4b0082]/30 border-t-[#4b0082] rounded-full animate-spin" /> Creating Account...</>
                    ) : (
                      <><Shield size={18} /> Create Secure Account <ArrowRight size={18} /></>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-white/40 pt-2">
                    By registering, you agree to our Terms and confirm that you have read our Privacy Policy.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
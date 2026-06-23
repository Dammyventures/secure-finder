import React, { useState, useEffect, useRef } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Stars, 
  Sparkles, 
  TorusKnot, 
  Ring, 
  Octahedron,
  Points,
  PointMaterial
} from '@react-three/drei'
import toast from 'react-hot-toast'
import { 
  Mail, Lock, User, Phone, IdCard, CheckCircle, Eye, EyeOff, 
  AlertCircle, Shield, Crown, Diamond, ArrowRight,
  Award, Heart, Globe, Zap, Bell, Clock, Users
} from 'lucide-react'

import { authApi } from '../../api/auth.api'
import type { RegisterData } from '../../types/auth.types'

// ========== ✨ NEW: COSMIC PARTICLE GALAXY FOR REGISTER ==========
const RegisterParticleGalaxy: React.FC = () => {
  const pointsRef = useRef<any>(null)
  const galaxyRef = useRef<any>(null)
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(2500 * 3)
    for (let i = 0; i < 2500; i++) {
      const radius = 1.5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  })

  const [colorPositions] = useState(() => {
    const colors = new Float32Array(2500 * 3)
    const palette = [
      [0.956, 0.992, 1.0],   // #F4FDFF
      [0.11, 0.267, 0.557],   // #1C448E
      [0.576, 0.545, 0.631],  // #938BA1
      [0.956, 0.992, 1.0],   // #F4FDFF
    ]
    for (let i = 0; i < 2500; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return colors
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.012
      pointsRef.current.rotation.x = Math.sin(t * 0.018) * 0.04
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.015
      galaxyRef.current.rotation.x = Math.sin(t * 0.012) * 0.02
    }
  })

  return (
    <group ref={galaxyRef}>
      {/* Main Particle Galaxy */}
      <Points ref={pointsRef} positions={particlePositions} colors={colorPositions} stride={3}>
        <PointMaterial
          transparent
          opacity={0.7}
          size={0.03}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </Points>

      {/* Core Orb - Different shape for Register */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.9}>
        <TorusKnot args={[0.7, 0.15, 128, 16, 2, 3]}>
          <MeshDistortMaterial
            color="#1C448E"
            distort={0.3}
            speed={1.2}
            roughness={0.05}
            metalness={0.95}
            emissive="#938BA1"
            emissiveIntensity={0.9}
            transparent
            opacity={0.7}
          />
        </TorusKnot>
      </Float>

      {/* Inner Glow Ring */}
      <Ring args={[1.0, 1.2, 64]} position={[0, 0, 0]} rotation={[Math.PI / 4, 0.3, 0]}>
        <meshStandardMaterial
          color="#F4FDFF"
          emissive="#1C448E"
          emissiveIntensity={0.3}
          metalness={0.9}
          transparent
          opacity={0.4}
        />
      </Ring>

      {/* Dual Orbiting Rings */}
      {[1, 2].map((i) => {
        const radius = 1.6 + i * 0.5
        return (
          <Float key={i} speed={0.4 + i * 0.1} rotationIntensity={0.3} floatIntensity={0.4}>
            <Ring
              args={[radius, radius + 0.04, 80]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 3 + i * 0.5, i * 0.4, 0]}
            >
              <meshStandardMaterial
                color={i === 1 ? "#938BA1" : "#1C448E"}
                emissive={i === 1 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.1}
                metalness={0.8}
                transparent
                opacity={0.2}
                wireframe={i === 2}
              />
            </Ring>
          </Float>
        )
      })}

      {/* Floating Diamond Orbs */}
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
        const radius = 2.0 + Math.random() * 1.8
        const height = (Math.random() - 0.5) * 2.5
        return (
          <Float
            key={i + 100}
            speed={0.5 + Math.random() * 0.4}
            rotationIntensity={1.2}
            floatIntensity={1}
            position={[
              Math.cos(angle + i * 0.4) * radius,
              height,
              Math.sin(angle + i * 0.4) * radius
            ]}
          >
            <Sphere args={[0.05 + Math.random() * 0.05, 16, 16]}>
              <MeshDistortMaterial
                color={i % 3 === 0 ? "#F4FDFF" : i % 3 === 1 ? "#938BA1" : "#1C448E"}
                distort={0.6}
                speed={2.5}
                metalness={0.9}
                emissive={i % 3 === 0 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.4}
              />
            </Sphere>
          </Float>
        )
      })}

      <Sparkles count={500} scale={[10, 10, 10]} size={0.04} speed={0.4} color="#F4FDFF" />
      <Stars radius={18} depth={70} count={2000} factor={5} fade />
    </group>
  )
}

// ========== 🌊 NEW: FLUID AURA BACKGROUND ==========
const FluidAuraBackground: React.FC = () => {
  const groupRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.15
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => {
        const size = 2.5 + i * 2
        const opacity = 0.03 - i * 0.005
        return (
          <Float
            key={i}
            speed={0.25 + i * 0.04}
            rotationIntensity={0.1}
            floatIntensity={0.25 + i * 0.04}
            position={[0, -0.5 + i * 0.25, -1.5 - i * 0.4]}
          >
            <Sphere args={[size, 32, 32]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                distort={0.6 + i * 0.08}
                speed={0.4 + i * 0.04}
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={opacity}
                emissive={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                emissiveIntensity={0.08}
              />
            </Sphere>
          </Float>
        )
      })}
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
  let color = 'bg-[#938BA1]'
  if (score >= 4) { label = 'Strong'; color = 'bg-[#F4FDFF]' }
  else if (score >= 3) { label = 'Good'; color = 'bg-[#938BA1]' }
  else if (score >= 2) { label = 'Fair'; color = 'bg-[#1C448E]' }
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
    { icon: Shield, title: 'Secure Identity Verification', desc: 'Multi-level verification ensures safe returns', color: '#F4FDFF' },
    { icon: Globe, title: 'Smart Location Matching', desc: 'AI-powered finds items near you instantly', color: '#938BA1' },
    { icon: Award, title: 'Reward System', desc: 'Earn rewards for helping others', color: '#F4FDFF' },
    { icon: Heart, title: 'Privacy First', desc: 'Your data is encrypted and secure', color: '#938BA1' },
    { icon: Zap, title: 'Fast Claims Process', desc: 'Verified users get priority', color: '#F4FDFF' },
    { icon: Bell, title: 'Real-time Notifications', desc: 'Instant updates on your items', color: '#938BA1' }
  ]

  if (registerMutation.isPending) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F4FDFF]/30 border-t-[#F4FDFF] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
      
      {/* Full Screen 3D Background - NEW GALAXY */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} color="#F4FDFF" />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#938BA1" />
          <pointLight position={[2, -3, 4]} intensity={0.4} color="#1C448E" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#F4FDFF" />
          <RegisterParticleGalaxy />
          <FluidAuraBackground />
        </Canvas>
      </div>
      
      {/* Gradient overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C448E]/30 via-transparent to-[#1C448E]/50" />
      
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
                <motion.div 
                  className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, transparent, rgba(244,253,255,0.08), rgba(147,139,161,0.08), transparent)' }}
                  animate={{ opacity: isHovered ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Full Name</label>
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
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Email Address</label>
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
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Phone Number</label>
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
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Identity Type</label>
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
                  </div>

                  {/* Identity Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Identity Number</label>
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

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Password</label>
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
                    <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">Confirm Password</label>
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
                    disabled={registerMutation.isPending || isSubmitting || !watchTermsAccepted || !watchPrivacyAccepted}
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
    </div>
  )
}

export default Register
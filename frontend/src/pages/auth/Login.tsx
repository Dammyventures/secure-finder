import React, { useState, useRef, Suspense, useEffect } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles, TorusKnot, Ring, Octahedron } from '@react-three/drei'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/UI/Button'
import Input from '../../components/common/UI/Input'
import toast from 'react-hot-toast'
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Sparkles as SparkleIcon, 
  Shield, Fingerprint, ArrowRight, CheckCircle, Users,
  Award, Clock, Heart, Globe, Zap, Crown, Diamond, TrendingUp 
} from 'lucide-react'

// Define LoginCredentials type to match what your auth context expects
interface LoginCredentials {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

type LoginFormData = yup.InferType<typeof loginSchema>

// ========== REVOLUTIONARY 3D SCENE - FULL SCREEN ==========
const RevolutionaryLoginScene: React.FC = () => {
  const groupRef = useRef<any>(null)
  const torusRef = useRef<any>(null)
  const centerRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.05
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.1
      torusRef.current.rotation.z = t * 0.15
    }
    if (centerRef.current) {
      centerRef.current.rotation.y = t * 0.2
      centerRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <Octahedron args={[1.3, 0]} ref={centerRef}>
          <MeshDistortMaterial 
            color="#E5E4E2"
            distort={0.6}
            speed={2}
            roughness={0.08}
            metalness={0.95}
            emissive="#8b5cf6"
            emissiveIntensity={1.2}
          />
        </Octahedron>
      </Float>
      
      <TorusKnot args={[2.5, 0.1, 200, 32, 3, 4]} position={[0, 0, 0]} ref={torusRef}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          emissive="#4b0082"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </TorusKnot>
      
      <Ring args={[3.2, 3.5, 64]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#E5E4E2" 
          emissive="#c4b5fd" 
          emissiveIntensity={0.5}
          metalness={0.85}
          transparent
          opacity={0.7}
        />
      </Ring>
      
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 3.8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const colors = ["#E5E4E2", "#8b5cf6", "#c4b5fd", "#a78bfa", "#7c3aed", "#6d28d9", "#9b59b6", "#d4a5fc"]
        return (
          <Float key={i} speed={1.2 + (i * 0.05)} rotationIntensity={0.5} floatIntensity={1.2} 
                 position={[x, Math.sin(angle * 2) * 0.8, z]}>
            <Sphere args={[0.16, 48, 48]}>
              <MeshDistortMaterial 
                color={colors[i % colors.length]} 
                distort={0.35}
                speed={1.8}
                metalness={0.9}
                emissive="#4b0082"
                emissiveIntensity={0.6}
              />
            </Sphere>
          </Float>
        )
      })}
      
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 5.2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <Float key={i + 100} speed={0.8 + (i * 0.03)} rotationIntensity={0.3} floatIntensity={0.8} 
                 position={[x, Math.cos(angle * 3) * 1.2, z]}>
            <Sphere args={[0.12, 32, 32]}>
              <MeshDistortMaterial 
                color="#E5E4E2" 
                distort={0.2}
                speed={1}
                metalness={0.85}
                emissive="#c4b5fd"
                emissiveIntensity={0.4}
              />
            </Sphere>
          </Float>
        )
      })}
      
      <Sparkles count={800} scale={[15, 15, 15]} size={0.08} speed={0.5} color="#E5E4E2" />
      <Stars radius={25} depth={100} count={3000} factor={7} fade />
    </group>
  )
}

// ========== MAIN LOGIN COMPONENT ==========
const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    // Fix: Cast the resolver to any to bypass the type mismatch
    resolver: yupResolver(loginSchema) as any,
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data as LoginCredentials)
      toast.success('Login successful! Welcome back!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '10K+', label: 'Items Found', icon: Heart },
    { value: '99.9%', label: 'Success Rate', icon: Award },
    { value: '48h', label: 'Avg Recovery', icon: Clock },
  ]

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082]">
      
      {/* FULL SCREEN 3D BACKGROUND */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} color="#E5E4E2" />
          <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8b5cf6" />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#E5E4E2" />
          <pointLight position={[0, 8, 0]} intensity={0.7} color="#c4b5fd" />
          <Suspense fallback={null}>
            <RevolutionaryLoginScene />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/30" />
      
      {/* Scrollable Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Shadow */}
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-[#8b5cf6] to-[#4b0082] rounded-3xl blur-2xl"
            animate={{
              opacity: isHovered ? 0.5 : 0.25,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Card Content */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
            <motion.div 
              className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(229,228,226,0.3), rgba(139,92,246,0.3), transparent)',
              }}
              animate={{
                opacity: isHovered ? 0.5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#4b0082]" />
              </div>
            </motion.div>
            
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-white/60 text-xs sm:text-sm"
              >
                Sign in to continue your journey
              </motion.p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-[#E5E4E2] transition-colors" size={18} />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none text-sm sm:text-base"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-[#E5E4E2] transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 border-2 border-white/30 rounded bg-white/5 peer-checked:bg-[#E5E4E2] peer-checked:border-[#E5E4E2] transition-all duration-200">
                      <CheckCircle className="w-3 h-3 text-[#4b0082] absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                    </div>
                  </div>
                  <span className="ml-2 text-xs text-white/60 group-hover:text-white/80 transition-colors">
                    Remember me
                  </span>
                </label>
                <motion.a
                  href="#"
                  whileHover={{ x: 2 }}
                  className="text-xs text-[#E5E4E2] hover:text-white transition-colors"
                >
                  Forgot password?
                </motion.a>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#4b0082]/30 border-t-[#4b0082] rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-transparent text-white/40">OR</span>
                </div>
              </div>

              {/* Biometric */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-white/20 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm"
              >
                <Fingerprint size={18} />
                <span>Sign in with Biometrics</span>
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-xs text-white/50">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#E5E4E2] hover:text-white transition-colors inline-flex items-center gap-1 group">
                  Create account
                  <SparkleIcon size={12} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
        
        {/* Stats Bar - Below the card with proper spacing */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-md mx-auto mt-6 sm:mt-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10"
              >
                <stat.icon className="w-4 h-4 text-[#E5E4E2] mx-auto mb-1" />
                <div className="text-xs sm:text-sm font-bold text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Extra bottom padding for small screens */}
        <div className="h-4 sm:h-8"></div>
      </div>
    </div>
  )
}

export default Login
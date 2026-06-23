import React, { useState, useRef, Suspense, useEffect } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Html,
  Points,
  PointMaterial,
  Line
} from '@react-three/drei'
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

// ========== ✨ NEW: FLUID PARTICLE GALAXY SCENE ==========
const ParticleGalaxy: React.FC = () => {
  const pointsRef = useRef<any>(null)
  const galaxyRef = useRef<any>(null)
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const radius = 2 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  })

  const [colorPositions] = useState(() => {
    const colors = new Float32Array(3000 * 3)
    const palette = [
      [0.956, 0.992, 1.0],   // #F4FDFF
      [0.11, 0.267, 0.557],   // #1C448E
      [0.576, 0.545, 0.631],  // #938BA1
      [0.956, 0.992, 1.0],   // #F4FDFF
    ]
    for (let i = 0; i < 3000; i++) {
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
      pointsRef.current.rotation.y = t * 0.015
      pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.05
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.02
      galaxyRef.current.rotation.x = Math.sin(t * 0.015) * 0.03
    }
  })

  return (
    <group ref={galaxyRef}>
      {/* Main Particle Galaxy */}
      <Points ref={pointsRef} positions={particlePositions} colors={colorPositions} stride={3}>
        <PointMaterial
          transparent
          opacity={0.8}
          size={0.035}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </Points>

      {/* Glowing Core Orb */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.8, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#1C448E"
            distort={0.2}
            speed={1.5}
            roughness={0.05}
            metalness={0.95}
            emissive="#938BA1"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      {/* Inner Glow Ring */}
      <Ring args={[1.2, 1.5, 64]} position={[0, 0, 0]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshStandardMaterial
          color="#F4FDFF"
          emissive="#938BA1"
          emissiveIntensity={0.3}
          metalness={0.9}
          transparent
          opacity={0.3}
        />
      </Ring>

      {/* Outer Accent Rings */}
      {[1, 2, 3].map((i) => {
        const radius = 1.8 + i * 0.6
        const tilt = (i * 0.3) + 0.2
        return (
          <Float key={i} speed={0.5 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.3}>
            <Ring
              args={[radius, radius + 0.05, 96]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2 + tilt * 0.5, tilt, 0]}
            >
              <meshStandardMaterial
                color="#1C448E"
                emissive="#F4FDFF"
                emissiveIntensity={0.15}
                metalness={0.85}
                transparent
                opacity={0.15 + i * 0.05}
                wireframe={i === 2}
              />
            </Ring>
          </Float>
        )
      })}

      {/* Floating Energy Orbs */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 2.2 + Math.random() * 1.5
        const height = (Math.random() - 0.5) * 2
        return (
          <Float
            key={i + 100}
            speed={0.6 + Math.random() * 0.5}
            rotationIntensity={1}
            floatIntensity={1.2}
            position={[
              Math.cos(angle + i * 0.5) * radius,
              height,
              Math.sin(angle + i * 0.5) * radius
            ]}
          >
            <Sphere args={[0.04 + Math.random() * 0.06, 24, 24]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                distort={0.5}
                speed={2}
                metalness={0.9}
                emissive={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.5}
              />
            </Sphere>
          </Float>
        )
      })}

      <Sparkles count={400} scale={[8, 8, 8]} size={0.05} speed={0.3} color="#F4FDFF" />
      <Stars radius={15} depth={60} count={1500} factor={5} fade />
    </group>
  )
}

// ========== 🌊 NEW: FLUID WAVE BACKGROUND ==========
const FluidWaveBackground: React.FC = () => {
  const meshRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.03
    }
  })

  return (
    <group ref={meshRef}>
      {[...Array(6)].map((_, i) => {
        const size = 3 + i * 2.5
        const opacity = 0.03 - i * 0.004
        return (
          <Float
            key={i}
            speed={0.3 + i * 0.05}
            rotationIntensity={0.1}
            floatIntensity={0.3 + i * 0.05}
            position={[0, -1 + i * 0.3, -2 - i * 0.5]}
          >
            <Sphere args={[size, 48, 48]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                distort={0.8 + i * 0.1}
                speed={0.5 + i * 0.05}
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={opacity}
                emissive={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                emissiveIntensity={0.1}
              />
            </Sphere>
          </Float>
        )
      })}
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
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
      
      {/* FULL SCREEN 3D BACKGROUND - NEW GALAXY SCENE */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} color="#F4FDFF" />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#938BA1" />
          <pointLight position={[2, -3, 4]} intensity={0.4} color="#1C448E" />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#F4FDFF" />
          <Suspense fallback={null}>
            <ParticleGalaxy />
            <FluidWaveBackground />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Gradient overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C448E]/20 via-transparent to-[#1C448E]/40" />
      
      {/* Scrollable Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
          className="w-full max-w-md mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Shadow - Updated colors */}
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-[#938BA1] to-[#1C448E] rounded-3xl blur-2xl"
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
              scale: isHovered ? 1.03 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Card Content */}
          <div className="relative bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#F4FDFF]/10">
            <motion.div 
              className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent, rgba(244,253,255,0.1), rgba(147,139,161,0.1), transparent)',
              }}
              animate={{
                opacity: isHovered ? 0.4 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Logo - Glowing Shield */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <motion.div 
                className="relative"
                animate={{
                  boxShadow: isHovered 
                    ? '0 0 60px rgba(244,253,255,0.3)' 
                    : '0 0 30px rgba(244,253,255,0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#F4FDFF] to-[#938BA1] rounded-2xl shadow-2xl">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#1C448E]" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-4 h-4 text-[#F4FDFF]" />
                </motion.div>
              </motion.div>
            </motion.div>
            
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent"
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-[#F4FDFF]/50 text-xs sm:text-sm"
              >
                Sign in to continue your journey
              </motion.p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4FDFF]/30 group-focus-within:text-[#F4FDFF] transition-colors" size={18} />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none text-sm sm:text-base"
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: isHovered ? 'inset 0 0 30px rgba(244,253,255,0.05)' : 'inset 0 0 0px rgba(244,253,255,0)'
                    }}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[#938BA1] text-xs mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4FDFF]/30 group-focus-within:text-[#F4FDFF] transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F4FDFF]/30 hover:text-[#F4FDFF]/60 transition-colors"
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
                      className="text-[#938BA1] text-xs mt-1"
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
                    <div className="w-4 h-4 border-2 border-[#F4FDFF]/20 rounded bg-[#F4FDFF]/5 peer-checked:bg-[#F4FDFF] peer-checked:border-[#F4FDFF] transition-all duration-200">
                      <CheckCircle className="w-3 h-3 text-[#1C448E] absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                    </div>
                  </div>
                  <span className="ml-2 text-xs text-[#F4FDFF]/40 group-hover:text-[#F4FDFF]/70 transition-colors">
                    Remember me
                  </span>
                </label>
                <motion.a
                  href="#"
                  whileHover={{ x: 2 }}
                  className="text-xs text-[#938BA1] hover:text-[#F4FDFF] transition-colors"
                >
                  Forgot password?
                </motion.a>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#938BA1]/20 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#1C448E]/30 border-t-[#1C448E] rounded-full animate-spin" />
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
                  <div className="w-full border-t border-[#F4FDFF]/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-transparent text-[#F4FDFF]/30">OR</span>
                </div>
              </div>

              {/* Biometric */}
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#F4FDFF' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF]/50 hover:text-[#F4FDFF] hover:bg-[#F4FDFF]/5 transition-all duration-300 text-sm"
              >
                <Fingerprint size={18} />
                <span>Sign in with Biometrics</span>
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-xs text-[#F4FDFF]/30">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#938BA1] hover:text-[#F4FDFF] transition-colors inline-flex items-center gap-1 group">
                  Create account
                  <SparkleIcon size={12} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
        
        {/* Stats Bar - Updated colors */}
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
                whileHover={{ y: -3, backgroundColor: 'rgba(244,253,255,0.1)' }}
                className="text-center bg-[#F4FDFF]/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-[#F4FDFF]/5 transition-all duration-300"
              >
                <stat.icon className="w-4 h-4 text-[#938BA1] mx-auto mb-1" />
                <div className="text-xs sm:text-sm font-bold text-[#F4FDFF]">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-[#F4FDFF]/30">{stat.label}</div>
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
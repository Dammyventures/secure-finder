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
  Award, Clock, Heart, Globe, Zap, Crown, Diamond, TrendingUp,
  Waves, Ship, Compass, Droplet, Anchor
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

// ========== 🌊 OCEAN PARTICLE GALAXY SCENE ==========
const OceanParticleGalaxy: React.FC = () => {
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
          opacity={0.7}
          size={0.03}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </Points>

      {/* Glowing Core Orb - Ocean Blue */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.8, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#345DA7"
            distort={0.2}
            speed={1.5}
            roughness={0.05}
            metalness={0.95}
            emissive="#4BB4DE"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      {/* Inner Glow Ring */}
      <Ring args={[1.2, 1.5, 64]} position={[0, 0, 0]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshStandardMaterial
          color="#7ED5EA"
          emissive="#4BB4DE"
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
                color="#3B8AC4"
                emissive="#63BCE5"
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
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
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
                color={i % 2 === 0 ? "#7ED5EA" : "#4BB4DE"}
                distort={0.5}
                speed={2}
                metalness={0.9}
                emissive={i % 2 === 0 ? "#7ED5EA" : "#4BB4DE"}
                emissiveIntensity={0.5}
              />
            </Sphere>
          </Float>
        )
      })}

      <Sparkles count={400} scale={[8, 8, 8]} size={0.05} speed={0.3} color="#7ED5EA" />
      <Stars radius={15} depth={60} count={1500} factor={5} fade />
    </group>
  )
}

// ========== 🌊 OCEAN FLUID WAVE BACKGROUND ==========
const OceanFluidWaveBackground: React.FC = () => {
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
                color={i % 2 === 0 ? "#345DA7" : "#4BB4DE"}
                distort={0.8 + i * 0.1}
                speed={0.5 + i * 0.05}
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={opacity}
                emissive={i % 2 === 0 ? "#345DA7" : "#4BB4DE"}
                emissiveIntensity={0.1}
              />
            </Sphere>
          </Float>
        )
      })}
    </group>
  )
}

// ========== 🌊 OCEAN BUBBLE PARTICLES ==========
const OceanBubbles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => {
        const size = 3 + Math.random() * 10
        const left = Math.random() * 100
        const delay = Math.random() * 10
        const duration = 12 + Math.random() * 8
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: '-20px',
              background: `radial-gradient(circle at 30% 30%, rgba(75, 180, 222, ${0.08 + Math.random() * 0.12}), rgba(52, 93, 167, 0.02))`,
              border: '1px solid rgba(75, 180, 222, 0.06)',
              animation: `bubbleFloat ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// ========== MAIN LOGIN COMPONENT - OCEAN THEME ==========
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
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7]">
      
      {/* FULL SCREEN 3D BACKGROUND - OCEAN GALAXY */}
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
          <directionalLight position={[3, 5, 3]} intensity={0.8} color="#7ED5EA" />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#4BB4DE" />
          <pointLight position={[2, -3, 4]} intensity={0.4} color="#345DA7" />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#63BCE5" />
          <Suspense fallback={null}>
            <OceanParticleGalaxy />
            <OceanFluidWaveBackground />
          </Suspense>
        </Canvas>
      </div>
      
      <OceanBubbles />
      
      {/* Gradient overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#150734]/30 via-transparent to-[#0F2557]/40" />
      
      {/* Scrollable Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
          className="w-full max-w-[400px] sm:max-w-md mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Shadow - Ocean Colors */}
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-[#4BB4DE] to-[#345DA7] rounded-3xl blur-2xl"
            animate={{
              opacity: isHovered ? 0.5 : 0.25,
              scale: isHovered ? 1.03 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Card Content */}
          <div className="relative bg-[#4BB4DE]/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-[#4BB4DE]/15">
            <motion.div 
              className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent, rgba(75,180,222,0.08), rgba(99,188,229,0.08), transparent)',
              }}
              animate={{
                opacity: isHovered ? 0.3 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Logo - Glowing Shield */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="flex justify-center mb-4 sm:mb-6 md:mb-8"
            >
              <motion.div 
                className="relative"
                animate={{
                  boxShadow: isHovered 
                    ? '0 0 60px rgba(75,180,222,0.3)' 
                    : '0 0 30px rgba(75,180,222,0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#4BB4DE] to-[#63BCE5] rounded-2xl shadow-2xl">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#150734]" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ED5EA]" />
                </motion.div>
              </motion.div>
            </motion.div>
            
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#EFDBCB] to-[#7ED5EA] bg-clip-text text-transparent"
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 sm:mt-2 text-[#EFDBCB]/40 text-xs sm:text-sm"
              >
                Sign in to continue your journey 🌊
              </motion.p>
            </div>

            <form className="space-y-3 sm:space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#EFDBCB]/70 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4BB4DE]/30 group-focus-within:text-[#4BB4DE] transition-colors" size={16} />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-[#4BB4DE]/5 border border-[#4BB4DE]/15 rounded-xl text-[#EFDBCB] placeholder-[#EFDBCB]/20 text-xs sm:text-sm focus:border-[#4BB4DE] focus:ring-2 focus:ring-[#4BB4DE]/20 transition-all outline-none"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[#4BB4DE] text-[10px] sm:text-xs mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#EFDBCB]/70 mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4BB4DE]/30 group-focus-within:text-[#4BB4DE] transition-colors" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 md:py-3 bg-[#4BB4DE]/5 border border-[#4BB4DE]/15 rounded-xl text-[#EFDBCB] placeholder-[#EFDBCB]/20 text-xs sm:text-sm focus:border-[#4BB4DE] focus:ring-2 focus:ring-[#4BB4DE]/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4BB4DE]/30 hover:text-[#4BB4DE]/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[#4BB4DE] text-[10px] sm:text-xs mt-1"
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
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#4BB4DE]/20 rounded bg-[#4BB4DE]/5 peer-checked:bg-[#4BB4DE] peer-checked:border-[#4BB4DE] transition-all duration-200">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#150734] absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                    </div>
                  </div>
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-[#EFDBCB]/40 group-hover:text-[#EFDBCB]/70 transition-colors">
                    Remember me
                  </span>
                </label>
                <motion.a
                  href="#"
                  whileHover={{ x: 2 }}
                  className="text-[10px] sm:text-xs text-[#4BB4DE] hover:text-[#63BCE5] transition-colors"
                >
                  Forgot password?
                </motion.a>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734] font-semibold py-2 sm:py-2.5 md:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#4BB4DE]/30 text-xs sm:text-sm md:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#150734]/30 border-t-[#150734] rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span>Sign In</span>
                      <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#4BB4DE]/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-transparent text-[#EFDBCB]/20 text-[10px] sm:text-xs">OR</span>
                </div>
              </div>

              {/* Biometric */}
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#4BB4DE' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-[#4BB4DE]/15 rounded-xl text-[#EFDBCB]/40 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/5 transition-all duration-300 text-xs sm:text-sm"
              >
                <Fingerprint size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Sign in with Biometrics</span>
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-[10px] sm:text-xs text-[#EFDBCB]/30">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#4BB4DE] hover:text-[#63BCE5] transition-colors inline-flex items-center gap-1 group">
                  Create account
                  <SparkleIcon size={12} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
        
        {/* Stats Bar - Ocean Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-[400px] sm:max-w-md mx-auto mt-4 sm:mt-6 md:mt-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                whileHover={{ y: -2, backgroundColor: 'rgba(75,180,222,0.1)' }}
                className="text-center bg-[#4BB4DE]/5 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 md:p-3 border border-[#4BB4DE]/5 transition-all duration-300"
              >
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4BB4DE] mx-auto mb-0.5 sm:mb-1" />
                <div className="text-[10px] sm:text-xs md:text-sm font-bold text-[#EFDBCB]">{stat.value}</div>
                <div className="text-[8px] sm:text-[10px] text-[#EFDBCB]/30 truncate">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Decorative Wave */}
          <div className="flex justify-center mt-3 sm:mt-4">
            <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-[#4BB4DE]/20" />
          </div>
        </motion.div>
        
        {/* Extra bottom padding for small screens */}
        <div className="h-3 sm:h-4 md:h-8"></div>
      </div>
    </div>
  )
}

export default Login
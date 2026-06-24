import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, TorusKnot, Ring, Octahedron } from '@react-three/drei'
import { 
  Search, Shield, MapPin, Users, CheckCircle, Lock, Clock, Globe, 
  Sparkles, ChevronRight, Zap, Crown, Diamond, TrendingUp, Waves,
  Anchor, Ship, Compass, Cloud, Droplet
} from 'lucide-react'
import Button from '../components/common/UI/Button'
import Layout from '../components/common/Layout/Layout'

// ========== 🌊 OCEAN 3D SCENE ==========
const OceanHomeScene: React.FC = () => {
  const groupRef = useRef<any>(null)
  const torusRef = useRef<any>(null)
  const centerRef = useRef<any>(null)
  const waveRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.03
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.08
      torusRef.current.rotation.z = t * 0.12
      torusRef.current.scale.x = 1 + Math.sin(t * 0.5) * 0.02
      torusRef.current.scale.y = 1 + Math.sin(t * 0.5 + 1) * 0.02
    }
    if (centerRef.current) {
      centerRef.current.rotation.y = t * 0.15
      centerRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    }
    if (waveRef.current) {
      waveRef.current.position.y = Math.sin(t * 0.3) * 0.2
      waveRef.current.scale.x = 1 + Math.sin(t * 0.2) * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.2}>
        <Octahedron args={[1.4, 0]} ref={centerRef}>
          <MeshDistortMaterial 
            color="#4BB4DE"
            distort={0.5}
            speed={2}
            roughness={0.05}
            metalness={0.95}
            emissive="#345DA7"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </Octahedron>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5} position={[0, 0, 0]}>
        <Ring args={[2.2, 2.6, 96]} ref={waveRef} rotation={[Math.PI / 2.5, 0.2, 0]}>
          <meshStandardMaterial 
            color="#63BCE5" 
            emissive="#4BB4DE" 
            emissiveIntensity={0.6}
            metalness={0.85}
            transparent
            opacity={0.5}
            wireframe={false}
          />
        </Ring>
      </Float>

      {[1, 2, 3].map((i) => {
        const radius = 2.8 + i * 0.6
        const tilt = (i * 0.25) + 0.1
        return (
          <Float key={i} speed={0.4 + i * 0.08} rotationIntensity={0.3} floatIntensity={0.4}>
            <Ring
              args={[radius, radius + 0.06, 80]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2 + tilt * 0.3, tilt * 0.5, i * 0.2]}
            >
              <meshStandardMaterial
                color={i === 1 ? "#3B8AC4" : i === 2 ? "#63BCE5" : "#7ED5EA"}
                emissive={i === 1 ? "#345DA7" : i === 2 ? "#4BB4DE" : "#63BCE5"}
                emissiveIntensity={0.2}
                metalness={0.8}
                transparent
                opacity={0.2 + i * 0.05}
                wireframe={i === 2}
              />
            </Ring>
          </Float>
        )
      })}
      
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 3.8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const colors = ["#4BB4DE", "#63BCE5", "#7ED5EA", "#3B8AC4", "#345DA7", "#4BB4DE", "#63BCE5", "#7ED5EA"]
        return (
          <Float key={i} speed={0.8 + (i * 0.04)} rotationIntensity={0.4} floatIntensity={0.8} 
                 position={[x, Math.sin(angle * 2) * 0.8, z]}>
            <Sphere args={[0.12, 32, 32]}>
              <MeshDistortMaterial 
                color={colors[i % colors.length]} 
                distort={0.3}
                speed={1.5}
                metalness={0.85}
                emissive="#4BB4DE"
                emissiveIntensity={0.3}
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
          <Float key={i + 100} speed={0.6 + (i * 0.03)} rotationIntensity={0.3} floatIntensity={1.2} 
                 position={[x, Math.cos(angle * 3) * 1.2, z]}>
            <Sphere args={[0.08, 16, 16]}>
              <MeshDistortMaterial 
                color="#7ED5EA" 
                distort={0.4}
                speed={2}
                metalness={0.7}
                emissive="#4BB4DE"
                emissiveIntensity={0.3}
                transparent
                opacity={0.6}
              />
            </Sphere>
          </Float>
        )
      })}
      
      <ThreeSparkles count={600} scale={[12, 12, 12]} size={0.06} speed={0.4} color="#7ED5EA" />
      <Stars radius={18} depth={70} count={2000} factor={5} fade />
    </group>
  )
}

// ========== 🌊 OCEAN HERO 3D SCENE ==========
const OceanHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#7ED5EA" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#345DA7" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#4BB4DE" />
        <pointLight position={[0, 8, 0]} intensity={0.9} color="#63BCE5" />
        <OceanHomeScene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  )
}

// ========== 🏄‍♂️ WAVE DIVIDER ==========
const WaveDivider: React.FC<{ position?: 'top' | 'bottom' }> = ({ position = 'bottom' }) => {
  return (
    <div className={`relative w-full h-8 sm:h-12 md:h-16 overflow-hidden ${position === 'top' ? 'rotate-180' : ''}`}>
      <svg
        className="absolute bottom-0 w-full h-8 sm:h-12 md:h-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C300,100 600,0 900,80 C1050,120 1150,40 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradientOcean)"
          className="animate-wave"
        />
        <defs>
          <linearGradient id="waveGradientOcean" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#345DA7" stopOpacity="0.15" />
            <stop offset="25%" stopColor="#3B8AC4" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#4BB4DE" stopOpacity="0.08" />
            <stop offset="75%" stopColor="#63BCE5" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#7ED5EA" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// ========== 🌊 OCEAN BUBBLE PARTICLES ==========
const OceanBubbles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => {
        const size = 4 + Math.random() * 12
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
              background: `radial-gradient(circle at 30% 30%, rgba(75, 180, 222, ${0.1 + Math.random() * 0.15}), rgba(52, 93, 167, 0.02))`,
              border: '1px solid rgba(75, 180, 222, 0.08)',
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
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
      `}</style>
    </div>
  )
}

// ========== 3D CARD COMPONENT ==========
const ThreeDCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState<number>(0)
  const [rotateY, setRotateY] = useState<number>(0)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateYValue = ((x - centerX) / centerX) * 10
    const rotateXValue = ((centerY - y) / centerY) * 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }
  
  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ========== ANIMATED COUNTER ==========
const AnimatedCounter: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState<number>(0)
  
  const numeric = parseInt(value.replace(/\D/g, ''), 10)
  const suffix = value.includes('+') ? '+' : value.includes('h') ? 'h' : ''
  
  useEffect(() => {
    if (isInView && count < numeric) {
      const timer = setTimeout(() => {
        setCount(prev => Math.min(prev + Math.ceil(numeric / 60), numeric))
      }, 16)
      return () => clearTimeout(timer)
    }
  }, [isInView, count, numeric])
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#4BB4DE] to-[#345DA7] rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-2 bg-gradient-to-r from-[#EFDBCB] to-[#7ED5EA] bg-clip-text text-transparent">
          {isInView ? count.toLocaleString() : '0'}{suffix}
        </div>
        <div className="text-xs sm:text-sm text-[#EFDBCB]/70 font-medium">{label}</div>
      </div>
    </motion.div>
  )
}

// ========== MAIN COMPONENT ==========
const Home: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])
  
  const features = [
    { icon: <Shield />, title: 'Secure Identity Verification', description: 'Multi-level verification ensures items are returned to rightful owners.' },
    { icon: <MapPin />, title: 'Location-Based Search', description: 'Find items near you with our advanced location filtering system.' },
    { icon: <Users />, title: 'Trusted Community', description: 'Join thousands of verified users helping reunite lost items.' },
    { icon: <CheckCircle />, title: 'Verified Matches', description: 'AI-powered matching system connects lost and found items.' },
    { icon: <Lock />, title: 'End-to-End Encryption', description: 'Your data and communications are fully encrypted.' },
    { icon: <Clock />, title: '24/7 Support', description: 'Round-the-clock support to help you find your items.' },
  ]
  
  const stats = [
    { 
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#4BB4DE]" strokeWidth={1.5} />, 
      value: '10,000+', 
      label: 'Items Reunited' 
    },
    { 
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#63BCE5]" strokeWidth={1.5} />, 
      value: '50,000+', 
      label: 'Registered Users' 
    },
    { 
      icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#7ED5EA]" strokeWidth={1.5} />, 
      value: '99.9%', 
      label: 'Success Rate' 
    },
    { 
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#4BB4DE]" strokeWidth={1.5} />, 
      value: '48h', 
      label: 'Average Recovery' 
    },
  ]
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.13, delayChildren: 0.2 }
    }
  }
  
  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, type: "spring", stiffness: 120 }
    }
  }
  
  return (
    <Layout showHeader={true} showSidebar={false} showFooter={true}>
      {/* Hero Section - Full Width */}
      <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7]">
        <OceanHeroScene />
        <OceanBubbles />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#150734]/30 via-transparent to-[#0F2557]/40" />
        
        <motion.div 
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="inline-block mb-6 md:mb-8 px-4 md:px-6 py-2 md:py-3 bg-[#4BB4DE]/10 backdrop-blur-md rounded-full border border-[#4BB4DE]/20 shadow-2xl"
              style={{
                background: `linear-gradient(90deg, rgba(75,180,222,0.15), rgba(52,93,167,0.25), rgba(75,180,222,0.15))`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s infinite',
              }}
            >
              <span className="text-[#EFDBCB] text-[10px] sm:text-xs md:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ED5EA] animate-pulse" />
                Revolutionary Lost & Found Platform
                <Waves className="w-3 h-3 sm:w-4 sm:h-4 text-[#4BB4DE]" />
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 px-2"
            >
              <span className="bg-gradient-to-r from-[#EFDBCB] via-[#7ED5EA] to-[#EFDBCB] bg-clip-text text-transparent block sm:inline">
                Find Lost Items
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] bg-clip-text text-transparent block sm:inline">
                Effortlessly Fast
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-[#EFDBCB]/80 max-w-3xl mx-auto mb-8 md:mb-12 backdrop-blur-sm px-4"
            >
              The most secure lost and found platform with multi-level authentication, identity verification, and intelligent matching to reunite you with your belongings.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button size="lg" className="text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734] hover:shadow-2xl hover:shadow-[#4BB4DE]/30 rounded-full font-semibold relative overflow-hidden group w-full sm:w-auto">
                    <span className="relative z-10">Get Started Free</span>
                    <Sparkles className="ml-1 sm:ml-2 inline relative z-10" size={14} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#63BCE5] to-[#7ED5EA] translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link to="/search">
                  <Button variant="outline" size="lg" className="text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2.5 sm:py-3 border-2 bg-white/10 border-[#4BB4DE]/30 text-[#EFDBCB] hover:bg-[#4BB4DE]/20 backdrop-blur-sm rounded-full font-semibold w-full sm:w-auto">
                    <Search className="mr-1 sm:mr-2 inline" size={16} />
                    Explore Items
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-[#4BB4DE]/30 rounded-full flex flex-col items-center justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 sm:w-1.5 sm:h-3 bg-[#4BB4DE]/50 rounded-full" 
            />
            <div className="text-[#4BB4DE]/40 text-[8px] sm:text-xs mt-1">SCROLL</div>
          </div>
        </motion.div>
      </section>

      <WaveDivider position="bottom" />

      {/* How It Works - Full Width */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#EFDBCB] via-[#F5EDE5] to-[#EFDBCB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Canvas>
            <ThreeSparkles count={200} scale={[5, 5, 5]} size={0.05} speed={0.3} color="#345DA7" />
          </Canvas>
        </div>
        
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-[#345DA7]" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#345DA7] to-[#4BB4DE] bg-clip-text text-transparent px-2">
                Revolutionary Process
              </h2>
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#4BB4DE]" />
            </div>
            <p className="text-[#345DA7]/70 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Three groundbreaking steps to reunite lost items with their owners
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {[
              { step: '01', title: 'AI Report & Search', desc: 'Our advanced AI instantly catalogs your lost item and searches millions of listings.', icon: Search, gradient: 'from-[#345DA7] to-[#3B8AC4]' },
              { step: '02', title: 'Blockchain Verification', desc: 'Secure, tamper-proof verification ensuring legitimacy of all claims.', icon: Shield, gradient: 'from-[#3B8AC4] to-[#4BB4DE]' },
              { step: '03', title: 'Instant Match & Connect', desc: 'Real-time matching algorithm connects you instantly with your item.', icon: Zap, gradient: 'from-[#4BB4DE] to-[#63BCE5]' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <ThreeDCard className="relative">
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-8 text-center shadow-2xl border border-[#4BB4DE]/20 overflow-hidden group hover:shadow-[#4BB4DE]/20 transition-all duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl`}>
                        <item.icon className="text-white" size={24} />
                      </div>
                      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#4BB4DE]/20 absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                        {item.step}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#345DA7]">{item.title}</h3>
                      <p className="text-[#345DA7]/70 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider position="top" />

      {/* Features - Full Width */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#0F2557] via-[#345DA7] to-[#0F2557] relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QkJEREUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <OceanBubbles />
        
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Anchor className="w-5 h-5 sm:w-6 sm:h-6 text-[#7ED5EA]" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#EFDBCB] to-[#7ED5EA] bg-clip-text text-transparent px-2">
                Why Choose Secure Finder?
              </h2>
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-[#4BB4DE]" />
            </div>
            <p className="text-[#EFDBCB]/60 text-sm sm:text-base max-w-3xl mx-auto px-4">
              We combine cutting-edge technology with a human touch to help reunite lost items
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <ThreeDCard>
                  <div className="group relative bg-[#0F2557]/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-[#4BB4DE]/20 transition-all duration-500 overflow-hidden border border-[#4BB4DE]/20 hover:border-[#4BB4DE]/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4BB4DE]/10 to-[#63BCE5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="mb-3 sm:mb-4 text-[#4BB4DE] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 inline-block">
                        {React.cloneElement(feature.icon, { size: 28, strokeWidth: 1.5 })}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#EFDBCB] group-hover:text-[#7ED5EA] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#EFDBCB]/60 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0">
                        <ChevronRight size={18} className="text-[#4BB4DE]" />
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Full Width */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QkJEREUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <Canvas className="absolute inset-0 pointer-events-none">
            <Stars radius={10} depth={30} count={500} factor={4} fade />
          </Canvas>
        </div>
        <OceanBubbles />
        
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#4BB4DE]/10 backdrop-blur-sm rounded-full border border-[#4BB4DE]/20 mb-4">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ED5EA]" />
              <span className="text-[8px] sm:text-[10px] text-blue-600 font-medium tracking-wider uppercase">Trusted by 50,000+ Users</span>
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#4BB4DE]" />
            </div>
            
            <h3 className="text-lg sm:text-xl text-[#4BB4DE] font-semibold tracking-widest uppercase">Our Impact</h3>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
              <div className="h-px w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent to-[#4BB4DE]" />
              <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-[#4BB4DE]" />
              <div className="h-px w-8 sm:w-12 md:w-16 bg-gradient-to-l from-transparent to-[#4BB4DE]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.12,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#4BB4DE] via-[#63BCE5] to-[#4BB4DE] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <div className="relative bg-gradient-to-br from-[#0F2557]/90 to-[#150734]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 text-center border border-[#4BB4DE]/15 group-hover:border-transparent transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#4BB4DE]/10 overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-[#4BB4DE]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative flex justify-center mb-2 sm:mb-3">
                    <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-[#4BB4DE]/5 blur-xl group-hover:bg-[#4BB4DE]/10 transition-all duration-500" />
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#4BB4DE]/20 to-[#63BCE5]/10 flex items-center justify-center group-hover:from-[#4BB4DE]/30 group-hover:to-[#63BCE5]/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-lg border border-[#4BB4DE]/10">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <motion.div 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#EFDBCB] drop-shadow-[0_4px_20px_rgba(75,180,222,0.15)]"
                    whileInView={{ scale: 1 }}
                    initial={{ scale: 0.8 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-[10px] sm:text-xs text-[#EFDBCB]/50 mt-1 font-medium tracking-wide">
                    {stat.label}
                  </div>
                  
                  <div className="mt-3 sm:mt-4 flex justify-center">
                    <div className="w-12 sm:w-16 md:w-20 h-1 bg-[#4BB4DE]/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(i + 1) * 25}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 + 0.4 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4BB4DE]/20 to-transparent group-hover:via-[#4BB4DE]/60 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-8 sm:mt-10"
          >
            <div className="flex items-center gap-2 text-[#EFDBCB]/20">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#4BB4DE]/30" />
              <Droplet className="w-3 h-3 sm:w-4 sm:h-4" />
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#4BB4DE]/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Full Width */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#EFDBCB] via-[#F5EDE5] to-[#EFDBCB] relative overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="max-w-4xl mx-auto relative"
          >
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#345DA7] via-[#4BB4DE] to-[#345DA7] rounded-2xl sm:rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden border border-[#4BB4DE]/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Globe className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#345DA7] mx-auto mb-4 md:mb-6" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 bg-gradient-to-r from-[#345DA7] to-[#4BB4DE] bg-clip-text text-transparent px-2">
                Join the Ocean Revolution
              </h2>
              <p className="text-[#345DA7]/70 text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-10 max-w-2xl mx-auto px-4">
                Be part of the future of lost and found technology. Join 50,000+ users already experiencing the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center px-4">
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register">
                    <Button size="lg" className="text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#345DA7] to-[#4BB4DE] text-white hover:shadow-2xl hover:shadow-[#345DA7]/30 rounded-full font-semibold w-full sm:w-auto">
                      Start Your Journey <Diamond className="ml-1 sm:ml-2 inline" size={14} />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="bg-white text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#345DA7] text-[#345DA7] hover:bg-[#4BB4DE]/10 rounded-full font-semibold w-full sm:w-auto">
                      Watch Demo
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
      `}</style>
      
    </Layout>
  )
}

export default Home
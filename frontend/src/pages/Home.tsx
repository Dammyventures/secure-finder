import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, TorusKnot, Ring, Octahedron } from '@react-three/drei'
import { 
  Search, Shield, MapPin, Users, CheckCircle, Lock, Clock, Globe, 
  Sparkles, ChevronRight, Zap, Crown, Diamond, TrendingUp 
} from 'lucide-react'
import Button from '../components/common/UI/Button'
import Layout from '../components/common/Layout/Layout'
import ChatBot from '../components/chat/ChatBot'

// ========== REVOLUTIONARY 3D SCENE ==========
const RevolutionaryHomeScene: React.FC = () => {
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
      
      <TorusKnot args={[2.4, 0.08, 200, 32, 3, 4]} position={[0, 0, 0]} ref={torusRef}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          emissive="#4b0082"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </TorusKnot>
      
      <Ring args={[3.0, 3.2, 64]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
        const radius = 3.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const colors = ["#E5E4E2", "#8b5cf6", "#c4b5fd", "#a78bfa", "#7c3aed", "#6d28d9", "#9b59b6", "#d4a5fc"]
        return (
          <Float key={i} speed={1.2 + (i * 0.05)} rotationIntensity={0.5} floatIntensity={1.2} 
                 position={[x, Math.sin(angle * 2) * 0.6, z]}>
            <Sphere args={[0.16, 48, 48]}>
              <MeshDistortMaterial 
                color={colors[i % colors.length]} 
                distort={0.35}
                speed={1.8}
                metalness={0.9}
                emissive="#4b0082"
                emissiveIntensity={0.5}
              />
            </Sphere>
          </Float>
        )
      })}
      
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 4.8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <Float key={i + 100} speed={0.8 + (i * 0.03)} rotationIntensity={0.3} floatIntensity={0.8} 
                 position={[x, Math.cos(angle * 3) * 1, z]}>
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
      
      <ThreeSparkles count={800} scale={[15, 15, 15]} size={0.08} speed={0.5} color="#E5E4E2" />
      <Stars radius={20} depth={80} count={3000} factor={6} fade />
    </group>
  )
}

// ========== HERO 3D SCENE ==========
const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#E5E4E2" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#E5E4E2" />
        <pointLight position={[0, 6, 0]} intensity={0.7} color="#c4b5fd" />
        <RevolutionaryHomeScene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#4b0082] rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2 md:mb-3 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
          {isInView ? count.toLocaleString() : '0'}{suffix}
        </div>
        <div className="text-sm md:text-lg text-white/80 font-medium">{label}</div>
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
    { value: '10,000+', label: 'Items Reunited' },
    { value: '50,000+', label: 'Registered Users' },
    { value: '99.9%', label: 'Success Rate' },
    { value: '48h', label: 'Average Recovery' },
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
      {/* Hero Section - FIXED RESPONSIVE */}
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082]">
        <Hero3DScene />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        <motion.div 
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative z-20 w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 text-center"
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
              className="inline-block mb-6 md:mb-8 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl"
              style={{
                background: `linear-gradient(90deg, rgba(229,228,226,0.15), rgba(139,92,246,0.25), rgba(229,228,226,0.15))`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s infinite',
              }}
            >
              <span className="text-[#E5E4E2] text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E5E4E2] animate-pulse" />
                Revolutionary Lost & Found Platform
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-[#E5E4E2]" />
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 px-2"
            >
              <span className="bg-gradient-to-r from-[#E5E4E2] via-[#c4b5fd] to-[#E5E4E2] bg-clip-text text-transparent block sm:inline">
                Find Lost Items
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#E5E4E2] bg-clip-text text-transparent block sm:inline">
                Revolutionarily Fast
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 md:mb-12 backdrop-blur-sm px-4"
            >
              Experience the world's most advanced lost and found platform with AI-powered matching and blockchain verification.
              Join 50,000+ satisfied users today.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-2xl rounded-full font-semibold relative overflow-hidden group w-full sm:w-auto">
                    <span className="relative z-10">Get Started Free</span>
                    <Sparkles className="ml-2 inline relative z-10" size={16} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#c4b5fd] to-[#E5E4E2] translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/search">
                  <Button variant="outline" size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full font-semibold w-full sm:w-auto">
                    <Search className="mr-2 inline" size={18} />
                    Explore Items
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/50 rounded-full mt-2" 
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works - FIXED RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Canvas>
            <ThreeSparkles count={200} scale={[5, 5, 5]} size={0.05} speed={0.3} color="#4b0082" />
          </Canvas>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#4b0082] to-[#8b5cf6] bg-clip-text text-transparent px-2">
              Revolutionary Process
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Three groundbreaking steps to reunite lost items with their owners
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              { step: '01', title: 'AI Report & Search', desc: 'Our advanced AI instantly catalogs your lost item and searches millions of listings.', icon: Search, gradient: 'from-[#4b0082] to-[#6d28d9]' },
              { step: '02', title: 'Blockchain Verification', desc: 'Secure, tamper-proof verification ensuring legitimacy of all claims.', icon: Shield, gradient: 'from-[#6d28d9] to-[#8b5cf6]' },
              { step: '03', title: 'Instant Match & Connect', desc: 'Real-time matching algorithm connects you instantly with your item.', icon: Zap, gradient: 'from-[#8b5cf6] to-[#c4b5fd]' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <ThreeDCard className="relative">
                  <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-purple-100 overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl`}>
                        <item.icon className="text-white" size={32} />
                      </div>
                      <div className="text-6xl sm:text-7xl md:text-8xl font-black text-purple-50 absolute -top-3 -right-3 sm:-top-4 sm:-right-4 opacity-50">
                        {item.step}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 mt-2 sm:mt-4 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features - FIXED RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-purple-50 to-white relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#4b0082] to-[#8b5cf6] bg-clip-text text-transparent px-2">
              Why Choose Secure Finder?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-4">
              We combine cutting-edge technology with a human touch to help reunite lost items
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <ThreeDCard>
                  <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4b0082]/5 to-[#8b5cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="mb-4 sm:mb-5 text-[#4b0082] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 inline-block">
                        {React.cloneElement(feature.icon, { size: 36, strokeWidth: 1.5 })}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-[#4b0082] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                      <div className="mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0">
                        <ChevronRight size={20} className="text-[#8b5cf6]" />
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats - FIXED RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 relative bg-gradient-to-r from-[#4b0082] via-[#6d28d9] to-[#4b0082] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 pointer-events-none">
          <Canvas>
            <Stars radius={5} depth={10} count={1000} factor={3} fade />
          </Canvas>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, i) => (
              <AnimatedCounter key={i} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA - FIXED RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="max-w-4xl mx-auto relative"
          >
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#4b0082] via-[#8b5cf6] to-[#4b0082] rounded-2xl sm:rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-r from-purple-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden border border-purple-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Globe className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#4b0082] mx-auto mb-4 md:mb-6" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 bg-gradient-to-r from-[#4b0082] to-[#8b5cf6] bg-clip-text text-transparent px-2">
                Join the Revolution
              </h2>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto px-4">
                Be part of the future of lost and found technology. Join 50,000+ users already experiencing the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center px-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register">
                    <Button size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#4b0082] to-[#8b5cf6] text-white hover:shadow-2xl rounded-full font-semibold w-full sm:w-auto">
                      Start Your Journey <Diamond className="ml-2 inline" size={16} />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="bg-white text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#4b0082] text-[#4b0082] hover:bg-purple-50 rounded-full font-semibold w-full sm:w-auto">
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
      `}</style>
      
      <ChatBot />
    </Layout>
  )
}

export default Home
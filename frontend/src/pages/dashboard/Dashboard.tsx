import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Stars, 
  Sparkles as ThreeSparkles, 
  TorusKnot,
  Points,
  PointMaterial,
  Ring
} from '@react-three/drei'
import {
  Package,
  Shield,
  DollarSign,
  Clock,
  MapPin,
  Bell,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Award,
  Heart,
  Zap,
  Crown,
  Diamond,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  Users,
  Activity,
  Calendar
} from 'lucide-react'
import Button from '../../components/common/UI/Button'
import ItemCard from '../../components/items/ItemCard'
import { useAuth } from '../../contexts/AuthContext'
import type { Item } from '../../types/item.types'

// ========== ✨ NEW: COSMIC PARTICLE GALAXY FOR DASHBOARD ==========
const DashboardParticleGalaxy: React.FC = () => {
  const pointsRef = useRef<any>(null)
  const galaxyRef = useRef<any>(null)
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const radius = 2 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.3
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  })

  const [colorPositions] = useState(() => {
    const colors = new Float32Array(2000 * 3)
    const palette = [
      [0.956, 0.992, 1.0],   // #F4FDFF
      [0.11, 0.267, 0.557],   // #1C448E
      [0.576, 0.545, 0.631],  // #938BA1
      [0.956, 0.992, 1.0],   // #F4FDFF
    ]
    for (let i = 0; i < 2000; i++) {
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
      pointsRef.current.rotation.y = t * 0.01
      pointsRef.current.rotation.x = Math.sin(t * 0.015) * 0.03
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.015
      galaxyRef.current.rotation.x = Math.sin(t * 0.01) * 0.02
    }
  })

  return (
    <group ref={galaxyRef}>
      {/* Main Particle Galaxy */}
      <Points ref={pointsRef} positions={particlePositions} colors={colorPositions} stride={3}>
        <PointMaterial
          transparent
          opacity={0.6}
          size={0.025}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </Points>

      {/* Core Orb */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <Sphere args={[0.6, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#1C448E"
            distort={0.2}
            speed={1.5}
            roughness={0.05}
            metalness={0.95}
            emissive="#938BA1"
            emissiveIntensity={0.7}
            transparent
            opacity={0.5}
          />
        </Sphere>
      </Float>

      {/* Inner Ring */}
      <Ring args={[0.9, 1.1, 64]} position={[0, 0, 0]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshStandardMaterial
          color="#F4FDFF"
          emissive="#1C448E"
          emissiveIntensity={0.2}
          metalness={0.9}
          transparent
          opacity={0.3}
        />
      </Ring>

      {/* Orbiting Rings */}
      {[1, 2].map((i) => {
        const radius = 1.4 + i * 0.4
        return (
          <Float key={i} speed={0.3 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.3}>
            <Ring
              args={[radius, radius + 0.03, 80]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2 + i * 0.3, i * 0.3, 0]}
            >
              <meshStandardMaterial
                color={i === 1 ? "#938BA1" : "#1C448E"}
                emissive={i === 1 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.1}
                metalness={0.8}
                transparent
                opacity={0.15}
                wireframe={i === 2}
              />
            </Ring>
          </Float>
        )
      })}

      {/* Floating Orbs */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.8 + Math.random() * 1.5
        const height = (Math.random() - 0.5) * 2
        return (
          <Float
            key={i + 100}
            speed={0.4 + Math.random() * 0.3}
            rotationIntensity={0.8}
            floatIntensity={0.8}
            position={[
              Math.cos(angle + i * 0.3) * radius,
              height,
              Math.sin(angle + i * 0.3) * radius
            ]}
          >
            <Sphere args={[0.04 + Math.random() * 0.04, 16, 16]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                distort={0.4}
                speed={2}
                metalness={0.9}
                emissive={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.3}
              />
            </Sphere>
          </Float>
        )
      })}

      <ThreeSparkles count={300} scale={[10, 10, 10]} size={0.04} speed={0.3} color="#F4FDFF" />
      <Stars radius={15} depth={50} count={1500} factor={4} fade />
    </group>
  )
}

// ========== 🌊 FLUID AURA BACKGROUND ==========
const FluidAuraBackground: React.FC = () => {
  const groupRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.06) * 0.015
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => {
        const size = 2 + i * 1.8
        const opacity = 0.025 - i * 0.005
        return (
          <Float
            key={i}
            speed={0.2 + i * 0.03}
            rotationIntensity={0.08}
            floatIntensity={0.2 + i * 0.03}
            position={[0, -0.3 + i * 0.2, -1.5 - i * 0.4]}
          >
            <Sphere args={[size, 32, 32]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                distort={0.5 + i * 0.06}
                speed={0.3 + i * 0.03}
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={opacity}
                emissive={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                emissiveIntensity={0.06}
              />
            </Sphere>
          </Float>
        )
      })}
    </group>
  )
}

// ========== ANIMATED STAT CARD - UPDATED COLORS ==========
const AnimatedStatCard: React.FC<{
  icon: React.ReactNode
  title: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down'
  color: string
  delay: number
  link?: string
  linkText?: string
}> = ({ icon, title, value, trend, trendDirection, color, delay, link, linkText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className="relative bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-2xl p-6 border border-[#F4FDFF]/10 overflow-hidden hover:border-[#F4FDFF]/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4FDFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${trendDirection === 'up' ? 'text-[#F4FDFF]' : 'text-[#938BA1]'} bg-[#F4FDFF]/10 px-2 py-1 rounded-full`}>
              <TrendingUp size={12} className={`mr-1 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
              {trend}
            </div>
          )}
        </div>
        
        <motion.h3 
          className="text-3xl font-bold text-[#F4FDFF] mb-1"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {value}
        </motion.h3>
        <p className="text-[#F4FDFF]/50 text-sm mb-3">{title}</p>
        
        {link && (
          <Link to={link} className="inline-flex items-center text-xs text-[#F4FDFF]/30 hover:text-[#F4FDFF]/70 transition-colors group-hover:text-[#F4FDFF]">
            {linkText || 'View details'}
            <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
        
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#F4FDFF]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}

// ========== MAIN DASHBOARD COMPONENT ==========
const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
  const [stats, setStats] = useState({
    itemsReported: 0,
    itemsClaimed: 0,
    activeClaims: 0,
    rewardsEarned: 0,
    verificationScore: 0,
    avgResolutionTime: 0,
  })
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          itemsReported: 12,
          itemsClaimed: 5,
          activeClaims: 3,
          rewardsEarned: 250,
          verificationScore: user?.verificationLevel === 'advanced' ? 95 : 75,
          avgResolutionTime: 48,
        })

        const mockItems: Item[] = [
          {
            id: '1',
            title: 'Lost iPhone 14 Pro',
            description: 'Black iPhone 14 Pro lost near Central Park',
            category: 'electronics',
            itemType: 'lost',
            status: 'open',
            location: {
              type: 'Point',
              coordinates: [40.7829, -73.9654],
              address: 'Central Park, New York',
              city: 'New York',
              country: 'USA',
            },
            dateLostFound: new Date().toISOString(),
            images: [],
            identifyingFeatures: ['Black case', 'Cracked screen corner'],
            reward: 100,
            reportedBy: { 
              id: 'user1', 
              fullName: 'You', 
              email: 'you@example.com', 
              phone: '+1234567890',
              profileImage: undefined 
            },
            claimedBy: undefined,
            secureCode: '',
            isAnonymous: false,
            metadata: { color: 'Black', brand: 'Apple', model: 'iPhone 14 Pro' },
            verificationScore: 85,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Found Wallet',
            description: 'Brown leather wallet found at Starbucks',
            category: 'bags',
            itemType: 'found',
            status: 'open',
            location: {
              type: 'Point',
              coordinates: [40.7489, -73.9680],
              address: 'Starbucks, 5th Avenue',
              city: 'New York',
              country: 'USA',
            },
            dateLostFound: new Date().toISOString(),
            images: [],
            identifyingFeatures: ['Brown leather', 'Multiple cards inside'],
            reward: 0,
            reportedBy: { 
              id: 'user2', 
              fullName: 'Jane Smith', 
              email: 'jane@example.com', 
              phone: '+1234567891',
              profileImage: undefined 
            },
            claimedBy: undefined,
            secureCode: '',
            isAnonymous: false,
            metadata: { color: 'Brown', brand: 'Unknown', material: 'Leather' },
            verificationScore: 90,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        setRecentItems(mockItems)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const getVerificationLevel = () => {
    if (!user) return 'Basic'
    return user.verificationLevel.charAt(0).toUpperCase() + user.verificationLevel.slice(1)
  }

  const getVerificationColor = () => {
    if (!user) return 'from-[#938BA1] to-[#1C448E]'
    switch (user.verificationLevel) {
      case 'basic': return 'from-[#938BA1] to-[#1C448E]'
      case 'intermediate': return 'from-[#1C448E] to-[#938BA1]'
      case 'advanced': return 'from-[#F4FDFF] to-[#938BA1]'
      default: return 'from-[#938BA1] to-[#1C448E]'
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F4FDFF]/30 border-t-[#F4FDFF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#F4FDFF]/50">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] overflow-hidden">
      
      {/* 3D Background - New Galaxy */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} color="#F4FDFF" />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#938BA1" />
          <pointLight position={[2, -3, 4]} intensity={0.4} color="#1C448E" />
          <pointLight position={[0, 4, 0]} intensity={0.5} color="#F4FDFF" />
          <DashboardParticleGalaxy />
          <FluidAuraBackground />
        </Canvas>
      </div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C448E]/30 via-transparent to-[#1C448E]/40" />
      
      {/* Content */}
      <div className="relative z-10 px-4 md:px-6 lg:px-8 py-6">
        
        {/* Welcome Header with Animation */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8 p-4 bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-2xl border border-[#F4FDFF]/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-[#1C448E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#F4FDFF]">Welcome back, {user?.fullName}!</h2>
                    <p className="text-[#F4FDFF]/50 text-sm">You've helped reunite {stats.itemsClaimed} items this month. Great job! 🎉</p>
                  </div>
                </div>
                <button onClick={() => setShowWelcome(false)} className="text-[#F4FDFF]/30 hover:text-[#F4FDFF]/70 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Section */}
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#F4FDFF]/40 text-sm mt-1"
            >
              Overview of your activity and statistics
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                <Bell size={18} className="mr-2" />
                Notifications
                <span className="ml-2 w-5 h-5 bg-[#938BA1] rounded-full text-xs flex items-center justify-center text-[#1C448E]">3</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/report/lost">
                <Button variant="primary" className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl hover:shadow-[#938BA1]/20">
                  <Plus size={18} className="mr-2" />
                  Report Item
                  <Sparkles size={14} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Verification Status Alert */}
        {!user?.identityVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-[#938BA1]/10 backdrop-blur-2xl rounded-2xl border border-[#938BA1]/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#938BA1]/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-[#938BA1]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F4FDFF]">Identity Verification Required</h3>
                  <p className="text-[#F4FDFF]/50 text-sm">
                    Verify your identity to unlock full platform features and increase trust score
                  </p>
                </div>
              </div>
              <Link to="/verify">
                <Button className="bg-[#938BA1] text-[#1C448E] hover:bg-[#F4FDFF] transition-colors">
                  <Shield size={18} className="mr-2" />
                  Start Verification
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          <AnimatedStatCard
            icon={<Package size={24} className="text-white" />}
            title="Items Reported"
            value={stats.itemsReported}
            trend="+24.5%"
            trendDirection="up"
            color="from-[#1C448E] to-[#938BA1]"
            delay={0.1}
            link="/my-items"
            linkText="View all items"
          />
          
          <AnimatedStatCard
            icon={<CheckCircle size={24} className="text-white" />}
            title="Items Claimed"
            value={stats.itemsClaimed}
            trend="+18.2%"
            trendDirection="up"
            color="from-[#938BA1] to-[#1C448E]"
            delay={0.2}
            link="/my-claims"
            linkText="View claims"
          />
          
          <AnimatedStatCard
            icon={<DollarSign size={24} className="text-white" />}
            title="Rewards Earned"
            value={`$${stats.rewardsEarned}`}
            trend="+$150"
            trendDirection="up"
            color="from-[#F4FDFF] to-[#938BA1]"
            delay={0.3}
            link="/rewards"
            linkText="Claim rewards"
          />
          
          <AnimatedStatCard
            icon={<Award size={24} className="text-white" />}
            title="Verification Score"
            value={`${stats.verificationScore}%`}
            color={`${getVerificationColor()}`}
            delay={0.4}
            link="/verify"
            linkText="Upgrade now"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <AnimatedStatCard
            icon={<Clock size={24} className="text-white" />}
            title="Active Claims"
            value={stats.activeClaims}
            color="from-[#1C448E] to-[#0F2A5E]"
            delay={0.5}
            link="/claims"
            linkText="Manage claims"
          />
          
          <AnimatedStatCard
            icon={<Activity size={24} className="text-white" />}
            title="Avg Resolution"
            value={`${stats.avgResolutionTime}h`}
            color="from-[#938BA1] to-[#1C448E]"
            delay={0.6}
            link="/analytics"
            linkText="View analytics"
          />
          
          <AnimatedStatCard
            icon={<Users size={24} className="text-white" />}
            title="Community Impact"
            value="+245"
            trend="+12%"
            trendDirection="up"
            color="from-[#F4FDFF] to-[#938BA1]"
            delay={0.7}
            link="/community"
            linkText="See impact"
          />
        </div>

        {/* Quick Actions and Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-2xl p-6 border border-[#F4FDFF]/10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-[#F4FDFF]" />
                <h3 className="text-lg font-bold text-[#F4FDFF]">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: Plus, text: 'Report Lost Item', path: '/report/lost', color: 'from-[#1C448E] to-[#938BA1]' },
                  { icon: Search, text: 'Report Found Item', path: '/report/found', color: 'from-[#938BA1] to-[#1C448E]' },
                  { icon: Search, text: 'Search Items', path: '/search', color: 'from-[#F4FDFF] to-[#938BA1]' },
                  { icon: Shield, text: 'Upgrade Verification', path: '/verify', color: 'from-[#1C448E] to-[#0F2A5E]' },
                ].map((action, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={action.path}>
                      <Button variant="outline" fullWidth className="justify-start border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 group">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${action.color} mr-3`}>
                          <action.icon size={14} className="text-white" />
                        </div>
                        {action.text}
                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-2xl p-6 border border-[#F4FDFF]/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#F4FDFF]" />
                  <h3 className="text-lg font-bold text-[#F4FDFF]">Recent Items Near You</h3>
                </div>
                <Link to="/search">
                  <Button variant="outline" size="sm" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                    <Filter size={14} className="mr-2" />
                    View All
                    <ArrowRight size={12} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              {recentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + idx * 0.1 }}
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-[#F4FDFF]/20 mx-auto mb-4" />
                  <h3 className="text-[#F4FDFF] font-medium mb-2">No recent items</h3>
                  <p className="text-[#F4FDFF]/40 text-sm mb-6">Start by reporting a lost or found item</p>
                  <Link to="/report/lost">
                    <Button className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20">
                      <Plus size={18} className="mr-2" />
                      Report Your First Item
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity and Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8"
        >
          {/* Location Activity */}
          <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-2xl p-6 border border-[#F4FDFF]/10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#F4FDFF]" />
              <h3 className="text-[#F4FDFF] font-bold">Your Area Activity</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Items reported in your city', value: '156', change: '+12' },
                { label: 'Resolved cases', value: '89%', change: '+5%' },
                { label: 'Average reward', value: '$75', change: '+$15' },
                { label: 'Active seekers near you', value: '24', change: '+8' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + idx * 0.1 }}
                  className="flex justify-between items-center py-2 border-b border-[#F4FDFF]/10"
                >
                  <span className="text-[#F4FDFF]/50 text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4FDFF] font-medium">{item.value}</span>
                    <span className="text-[#938BA1] text-xs">{item.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-3">
              <Link to="/explore" className="text-sm text-[#938BA1] hover:text-[#F4FDFF] transition-colors inline-flex items-center gap-1">
                Explore local items
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-br from-[#1C448E]/20 to-[#938BA1]/20 backdrop-blur-2xl rounded-2xl p-6 border border-[#F4FDFF]/10">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#F4FDFF]" />
              <h3 className="text-[#F4FDFF] font-bold">Security Tips</h3>
              <Crown className="w-4 h-4 text-[#F4FDFF] ml-auto" />
            </div>
            <ul className="space-y-3">
              {[
                'Always verify user identity before meeting',
                'Meet in public, well-lit areas for exchanges',
                'Use secure codes for item verification',
                'Report suspicious activity immediately',
              ].map((tip, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + idx * 0.1 }}
                  className="flex items-start gap-2 text-[#F4FDFF]/60 text-sm"
                >
                  <CheckCircle size={14} className="text-[#938BA1] mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 pt-3 flex items-center justify-between">
              <span className="text-xs text-[#F4FDFF]/30">✓ Trust Score: High</span>
              <Link to="/security" className="text-sm text-[#938BA1] hover:text-[#F4FDFF] transition-colors inline-flex items-center gap-1">
                More tips
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Missing X icon import
const X: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default Dashboard
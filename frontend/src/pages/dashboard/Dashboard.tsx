import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, TorusKnot } from '@react-three/drei'
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

// ========== 3D BACKGROUND FOR DASHBOARD ==========
const Dashboard3DBackground: React.FC = () => {
  const groupRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.8} position={[-4, -2, -8]}>
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial 
            color="#8b5cf6"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.85}
            emissive="#4b0082"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={0.6} rotationIntensity={0.4} floatIntensity={0.6} position={[5, 1, -10]}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial 
            color="#E5E4E2"
            distort={0.3}
            speed={1.2}
            roughness={0.15}
            metalness={0.9}
            emissive="#c4b5fd"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <TorusKnot args={[3.5, 0.08, 200, 32, 3, 4]} position={[0, -1, -12]}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          emissive="#4b0082"
          emissiveIntensity={0.3}
          metalness={0.85}
          roughness={0.15}
          transparent
          opacity={0.4}
        />
      </TorusKnot>
      
      <ThreeSparkles count={300} scale={[12, 12, 12]} size={0.05} speed={0.3} color="#E5E4E2" />
      <Stars radius={15} depth={50} count={1500} factor={5} fade />
    </group>
  )
}

// ========== ANIMATED STAT CARD ==========
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
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${trendDirection === 'up' ? 'text-green-400' : 'text-red-400'} bg-white/10 px-2 py-1 rounded-full`}>
              <TrendingUp size={12} className={`mr-1 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
              {trend}
            </div>
          )}
        </div>
        
        <motion.h3 
          className="text-3xl font-bold text-white mb-1"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {value}
        </motion.h3>
        <p className="text-white/60 text-sm mb-3">{title}</p>
        
        {link && (
          <Link to={link} className="inline-flex items-center text-xs text-white/40 hover:text-white/80 transition-colors group-hover:text-white">
            {linkText || 'View details'}
            <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
        
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
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
    if (!user) return 'from-gray-500 to-gray-600'
    switch (user.verificationLevel) {
      case 'basic': return 'from-gray-500 to-gray-600'
      case 'intermediate': return 'from-blue-500 to-cyan-500'
      case 'advanced': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] overflow-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#E5E4E2" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
          <Dashboard3DBackground />
        </Canvas>
      </div>
      
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
              className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Welcome back, {user?.fullName}!</h2>
                    <p className="text-white/60 text-sm">You've helped reunite {stats.itemsClaimed} items this month. Great job! 🎉</p>
                  </div>
                </div>
                <button onClick={() => setShowWelcome(false)} className="text-white/40 hover:text-white/80">
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
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-sm mt-1"
            >
              Overview of your activity and statistics
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Bell size={18} className="mr-2" />
                Notifications
                <span className="ml-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/report/lost">
                <Button variant="primary" className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl">
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
            className="mb-8 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400">Identity Verification Required</h3>
                  <p className="text-yellow-300/80 text-sm">
                    Verify your identity to unlock full platform features and increase trust score
                  </p>
                </div>
              </div>
              <Link to="/verify">
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
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
            color="from-blue-500 to-cyan-500"
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
            color="from-green-500 to-emerald-500"
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
            color="from-purple-500 to-pink-500"
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
            color="from-orange-500 to-red-500"
            delay={0.5}
            link="/claims"
            linkText="Manage claims"
          />
          
          <AnimatedStatCard
            icon={<Activity size={24} className="text-white" />}
            title="Avg Resolution"
            value={`${stats.avgResolutionTime}h`}
            color="from-teal-500 to-cyan-500"
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
            color="from-indigo-500 to-purple-500"
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
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-[#E5E4E2]" />
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: Plus, text: 'Report Lost Item', path: '/report/lost', color: 'from-blue-500 to-cyan-500' },
                  { icon: Search, text: 'Report Found Item', path: '/report/found', color: 'from-green-500 to-emerald-500' },
                  { icon: Search, text: 'Search Items', path: '/search', color: 'from-purple-500 to-pink-500' },
                  { icon: Shield, text: 'Upgrade Verification', path: '/verify', color: 'from-orange-500 to-red-500' },
                ].map((action, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={action.path}>
                      <Button variant="outline" fullWidth className="justify-start border-white/20 text-white hover:bg-white/10 group">
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
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#E5E4E2]" />
                  <h3 className="text-lg font-bold text-white">Recent Items Near You</h3>
                </div>
                <Link to="/search">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
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
                  <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No recent items</h3>
                  <p className="text-white/50 text-sm mb-6">Start by reporting a lost or found item</p>
                  <Link to="/report/lost">
                    <Button className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]">
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
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#E5E4E2]" />
              <h3 className="text-white font-bold">Your Area Activity</h3>
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
                  className="flex justify-between items-center py-2 border-b border-white/10"
                >
                  <span className="text-white/60 text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{item.value}</span>
                    <span className="text-green-400 text-xs">{item.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-3">
              <Link to="/explore" className="text-sm text-[#E5E4E2] hover:text-white transition-colors inline-flex items-center gap-1">
                Explore local items
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#E5E4E2]" />
              <h3 className="text-white font-bold">Security Tips</h3>
              <Crown className="w-4 h-4 text-yellow-400 ml-auto" />
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
                  className="flex items-start gap-2 text-white/70 text-sm"
                >
                  <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 pt-3 flex items-center justify-between">
              <span className="text-xs text-white/40">✓ Trust Score: High</span>
              <Link to="/security" className="text-sm text-[#E5E4E2] hover:text-white transition-colors inline-flex items-center gap-1">
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
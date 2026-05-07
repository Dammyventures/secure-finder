import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Sparkles as ThreeSparkles } from '@react-three/drei'
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  Home,
  Shield,
  LogOut,
  Settings,
  UserCircle,
  LayoutDashboard,
  PlusCircle,
  ChevronDown,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useUIStore } from '../../../store/ui.store'
import { useNotifications } from '../../../contexts/NotificationContext'
import Button from '../UI/Button'
import Input from '../UI/Input'

// ========== 3D BACKGROUND FOR HEADER ==========
const Header3DEffect: React.FC = () => {
  const groupRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5} position={[-2, -1, -5]}>
        <Sphere args={[0.3, 32, 32]}>
          <MeshDistortMaterial 
            color="#8b5cf6"
            distort={0.3}
            speed={1}
            roughness={0.2}
            metalness={0.85}
            emissive="#4b0082"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6} position={[2.5, -0.5, -4]}>
        <Sphere args={[0.25, 32, 32]}>
          <MeshDistortMaterial 
            color="#E5E4E2"
            distort={0.4}
            speed={1.2}
            roughness={0.15}
            metalness={0.9}
            emissive="#c4b5fd"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <ThreeSparkles count={50} scale={[5, 5, 5]} size={0.04} speed={0.3} color="#E5E4E2" />
    </group>
  )
}

// ========== HEADER COMPONENT ==========
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { toggleSidebar, sidebarOpen } = useUIStore()
  const { notifications, unreadCount, markAllAsRead } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setShowUserMenu(false)
  }
  
  const getUserInitials = () => {
    if (!user?.fullName) return 'U'
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const hasProfileImage = () => {
    return user && 'profileImage' in user && user.profileImage
  }
  
  // Navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ]
  
  return (
    <>
      {/* 3D Canvas Background */}
      <div className="fixed top-0 left-0 right-0 h-20 -z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <Header3DEffect />
        </Canvas>
      </div>
      
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-gradient-to-r from-[#4b0082]/95 via-[#6d28d9]/95 to-[#4b0082]/95 backdrop-blur-xl shadow-2xl' 
            : 'bg-gradient-to-r from-[#4b0082] via-[#6d28d9] to-[#4b0082]'
        } border-b border-white/10`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Logo and navigation */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 lg:hidden transition-all duration-300"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/" className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Shield className="text-[#E5E4E2]" size={28} />
                  </motion.div>
                  <div className="hidden sm:block">
                    <span className="text-xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                      Secure
                    </span>
                    <span className="text-xl font-bold text-[#E5E4E2]">Finder</span>
                  </div>
                  <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
                </Link>
              </motion.div>
              
              {/* Navigation links for desktop */}
              <nav className="hidden md:flex items-center space-x-1 ml-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 flex items-center gap-2 group"
                    >
                      <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            
            {/* Center section - Search */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 max-w-md mx-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <motion.div
                  animate={{ scale: searchFocused ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="text"
                    placeholder="Search for lost items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    isSearch
                    size="sm"
                    fullWidth
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#E5E4E2] focus:ring-[#E5E4E2]/20"
                  />
                </motion.div>
                <AnimatePresence>
                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-white/20 z-50"
                    >
                      <div className="text-xs text-white/60 p-2">Popular searches: lost keys, wallet, phone</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
            
            {/* Right section - User actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 relative transition-all duration-300"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                    />
                  )}
                </motion.button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-[#4b0082] to-[#6d28d9] backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50"
                    >
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={markAllAsRead}
                              className="text-xs text-[#E5E4E2] hover:text-white transition-colors"
                            >
                              Mark all as read
                            </motion.button>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-white/50 text-sm">
                            No notifications
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification, idx) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300 ${
                                !notification.read ? 'bg-white/5' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                  notification.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {notification.type === 'success' ? '✓' :
                                   notification.type === 'error' ? '✗' : 'ℹ'}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-white text-sm">{notification.title}</p>
                                  <p className="text-xs text-white/60 mt-1">{notification.message}</p>
                                  <p className="text-xs text-white/40 mt-2">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 5 && (
                        <div className="p-4 border-t border-white/20 text-center">
                          <Link
                            to="/notifications"
                            className="text-xs text-[#E5E4E2] hover:text-white transition-colors"
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* User profile or auth buttons */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    {hasProfileImage() ? (
                      <img
                        src={(user as any).profileImage}
                        alt={user.fullName || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#E5E4E2]"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-full flex items-center justify-center">
                        <span className="text-[#4b0082] font-bold text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                    <ChevronDown size={14} className="text-white/70" />
                  </motion.button>
                  
                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-[#4b0082] to-[#6d28d9] backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50"
                      >
                        <div className="p-2">
                          <div className="px-4 py-3 border-b border-white/20 mb-2">
                            <p className="text-white font-semibold text-sm">{user.fullName || 'User'}</p>
                            <p className="text-white/50 text-xs mt-1">{user.email}</p>
                          </div>
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => {
                              navigate('/profile')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          >
                            <UserCircle size={16} />
                            Profile
                          </motion.button>
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => {
                              navigate('/dashboard')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </motion.button>
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => {
                              navigate('/settings')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          >
                            <Settings size={16} />
                            Settings
                          </motion.button>
                          <hr className="my-2 border-white/20" />
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                          >
                            <LogOut size={16} />
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-lg"
                  >
                    Sign Up
                    <Sparkles size={14} className="ml-1" />
                  </Button>
                </motion.div>
              )}
              
              {/* Report button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/report/lost')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg"
                >
                  <PlusCircle size={14} className="mr-1" />
                  Report Item
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Animated gradient bottom border */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E5E4E2] to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.header>
      
      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </>
  )
}

export default Header
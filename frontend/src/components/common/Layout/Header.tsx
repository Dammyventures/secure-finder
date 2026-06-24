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
  Zap,
  Waves
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useSidebar } from '../../../contexts/SidebarContext'
import { useNotifications } from '../../../contexts/NotificationContext'
import Button from '../UI/Button'

// ========== 🌊 OCEAN 3D BACKGROUND FOR HEADER ==========
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
            color="#345DA7"
            distort={0.3}
            speed={1}
            roughness={0.2}
            metalness={0.85}
            emissive="#0F2557"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6} position={[2.5, -0.5, -4]}>
        <Sphere args={[0.25, 32, 32]}>
          <MeshDistortMaterial 
            color="#4BB4DE"
            distort={0.4}
            speed={1.2}
            roughness={0.15}
            metalness={0.9}
            emissive="#63BCE5"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <ThreeSparkles count={50} scale={[5, 5, 5]} size={0.04} speed={0.3} color="#7ED5EA" />
    </group>
  )
}

// ========== HEADER COMPONENT - OCEAN THEME ==========
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { isOpen: sidebarOpen, toggleSidebar } = useSidebar()
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
            ? 'bg-[#0F2557]/95 backdrop-blur-xl shadow-2xl' 
            : 'bg-gradient-to-r from-[#150734] via-[#0F2557] to-[#345DA7]'
        } border-b border-[#4BB4DE]/10`}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left section - Logo and navigation */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0">
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="p-1.5 sm:p-2 rounded-md text-[#4BB4DE]/70 hover:text-[#4BB4DE] hover:bg-[#4BB4DE]/10 lg:hidden transition-all duration-300 flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
              </button>
              
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0"
              >
                <Link to="/" className="flex items-center gap-1 sm:gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <Shield className="text-[#4BB4DE]" size={22} />
                  </motion.div>
                  <div className="hidden xs:block">
                    <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] bg-clip-text text-transparent">
                      Secure
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-[#EFDBCB]">Finder</span>
                  </div>
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ED5EA] animate-pulse flex-shrink-0" />
                </Link>
              </motion.div>
              
              {/* Navigation links - Desktop */}
              <nav className="hidden md:flex items-center gap-0.5 ml-2 lg:ml-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="text-[#EFDBCB]/70 hover:text-[#EFDBCB] px-2 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:bg-[#4BB4DE]/10 flex items-center gap-1.5 group whitespace-nowrap"
                    >
                      <item.icon size={14} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            
            {/* Center section - Search (Hidden on mobile, visible on tablet+) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:block flex-1 max-w-xs lg:max-w-md mx-2 md:mx-3 lg:mx-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <motion.div
                  animate={{ scale: searchFocused ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4BB4DE]/40 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#4BB4DE]/5 border border-[#4BB4DE]/15 rounded-xl text-[#EFDBCB] placeholder-[#EFDBCB]/30 focus:border-[#4BB4DE] focus:ring-2 focus:ring-[#4BB4DE]/20 transition-all outline-none"
                  />
                </motion.div>
                <AnimatePresence>
                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-[#0F2557]/95 backdrop-blur-xl rounded-xl p-2 border border-[#4BB4DE]/20 z-50"
                    >
                      <div className="text-[10px] sm:text-xs text-[#EFDBCB]/50 p-1.5 sm:p-2">
                        Popular: lost keys, wallet, phone
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
            
            {/* Right section - User actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              
              {/* Mobile Search Button */}
              <button
                onClick={() => navigate('/search')}
                className="sm:hidden p-1.5 rounded-full text-[#4BB4DE]/60 hover:text-[#4BB4DE] hover:bg-[#4BB4DE]/10 transition-all duration-300"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 sm:p-2 rounded-full text-[#EFDBCB]/60 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 relative transition-all duration-300"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-full" />
                  )}
                </button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-gradient-to-br from-[#0F2557] to-[#150734] backdrop-blur-xl rounded-xl shadow-2xl border border-[#4BB4DE]/20 z-50 max-h-[80vh] overflow-y-auto"
                    >
                      <div className="p-3 sm:p-4 border-b border-[#4BB4DE]/10">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#EFDBCB] text-sm sm:text-base">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-[10px] sm:text-xs text-[#4BB4DE] hover:text-[#63BCE5] transition-colors"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-[#EFDBCB]/40 text-xs sm:text-sm">
                            No notifications
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification, idx) => (
                            <div
                              key={notification.id}
                              className={`p-3 sm:p-4 border-b border-[#4BB4DE]/5 hover:bg-[#4BB4DE]/5 cursor-pointer transition-all duration-300 ${
                                !notification.read ? 'bg-[#4BB4DE]/5' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                                  notification.type === 'success' ? 'bg-[#4BB4DE]/20 text-[#4BB4DE]' :
                                  notification.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                  'bg-[#345DA7]/20 text-[#345DA7]'
                                }`}>
                                  {notification.type === 'success' ? '✓' :
                                   notification.type === 'error' ? '✗' : 'ℹ'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-[#EFDBCB] text-xs sm:text-sm truncate">{notification.title}</p>
                                  <p className="text-[10px] sm:text-xs text-[#EFDBCB]/50 mt-0.5 line-clamp-2">{notification.message}</p>
                                  <p className="text-[10px] text-[#EFDBCB]/30 mt-1">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 5 && (
                        <div className="p-3 sm:p-4 border-t border-[#4BB4DE]/10 text-center">
                          <Link
                            to="/notifications"
                            className="text-[10px] sm:text-xs text-[#4BB4DE] hover:text-[#63BCE5] transition-colors"
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
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 sm:gap-2 p-1 rounded-full hover:bg-[#4BB4DE]/10 transition-all duration-300"
                    aria-label="User menu"
                  >
                    {hasProfileImage() ? (
                      <img
                        src={(user as any).profileImage}
                        alt={user.fullName || 'User'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-[#4BB4DE]"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-full flex items-center justify-center">
                        <span className="text-[#150734] font-bold text-xs sm:text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                    <ChevronDown size={12} className="text-[#EFDBCB]/50 hidden sm:block" />
                  </button>
                  
                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-gradient-to-br from-[#0F2557] to-[#150734] backdrop-blur-xl rounded-xl shadow-2xl border border-[#4BB4DE]/20 z-50"
                      >
                        <div className="p-1.5 sm:p-2">
                          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-[#4BB4DE]/10 mb-1 sm:mb-2">
                            <p className="text-[#EFDBCB] font-semibold text-xs sm:text-sm truncate">{user.fullName || 'User'}</p>
                            <p className="text-[#EFDBCB]/40 text-[10px] sm:text-xs mt-0.5 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigate('/profile')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#EFDBCB]/70 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 rounded-lg transition-all duration-300"
                          >
                            <UserCircle size={14} className="sm:w-4 sm:h-4" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate('/dashboard')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#EFDBCB]/70 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 rounded-lg transition-all duration-300"
                          >
                            <LayoutDashboard size={14} className="sm:w-4 sm:h-4" />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate('/settings')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#EFDBCB]/70 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 rounded-lg transition-all duration-300"
                          >
                            <Settings size={14} className="sm:w-4 sm:h-4" />
                            Settings
                          </button>
                          <hr className="my-1 sm:my-2 border-[#4BB4DE]/10" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#4BB4DE]/60 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 rounded-lg transition-all duration-300"
                          >
                            <LogOut size={14} className="sm:w-4 sm:h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="border-[#4BB4DE]/30 text-[#EFDBCB] hover:bg-[#4BB4DE]/10 hover:border-[#4BB4DE]/50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734] hover:shadow-lg hover:shadow-[#4BB4DE]/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                  >
                    <span className="hidden xs:inline">Sign Up</span>
                    <span className="xs:hidden">Sign Up</span>
                    <Sparkles size={12} className="ml-0.5 sm:ml-1" />
                  </Button>
                </div>
              )}
              
              {/* Report button - Desktop only */}
              <div className="hidden lg:block">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/report/lost')}
                  className="bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734] hover:shadow-lg hover:shadow-[#4BB4DE]/20 text-sm px-4 py-1.5"
                >
                  <PlusCircle size={14} className="mr-1" />
                  Report Item
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated gradient bottom border */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4BB4DE] to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
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
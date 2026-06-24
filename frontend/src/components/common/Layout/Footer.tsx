import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, Ring } from '@react-three/drei'
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, 
  Shield, Heart, Globe, ChevronRight, Clock, Award, Zap, Diamond, Crown, TrendingUp,
  Waves, Anchor, Ship, Compass, Droplet
} from 'lucide-react'

// ========== 🌊 OCEAN 3D BACKGROUND FOR FOOTER ==========
const Footer3DBackground: React.FC = () => {
  const groupRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1} position={[-3, -2, -5]}>
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial 
            color="#345DA7"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.85}
            emissive="#4BB4DE"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2} position={[3, -1, -6]}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial 
            color="#4BB4DE"
            distort={0.5}
            speed={1.8}
            roughness={0.15}
            metalness={0.9}
            emissive="#63BCE5"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.8} position={[0, 2, -7]}>
        <Ring args={[0.5, 0.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#7ED5EA" 
            emissive="#4BB4DE" 
            emissiveIntensity={0.6}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </Ring>
      </Float>
      
      <ThreeSparkles count={200} scale={[10, 10, 10]} size={0.05} speed={0.3} color="#7ED5EA" />
      <Stars radius={12} depth={40} count={800} factor={4} fade />
    </group>
  )
}

// ========== 🌊 OCEAN FOOTER COMPONENT ==========
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ]
  
  const services = [
    { name: 'Report Lost Item', path: '/report' },
    { name: 'Search Items', path: '/search' },
    { name: 'My Claims', path: '/my-claims' },
    { name: 'Verification', path: '/verify' },
    { name: 'Support Center', path: '/support' },
    { name: 'Privacy Policy', path: '/privacy' },
  ]
  
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-[#7ED5EA]' },
    { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-[#7ED5EA]' },
    { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-[#7ED5EA]' },
    { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-[#7ED5EA]' },
  ]
  
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }
  
  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  }
  
  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7] text-[#EFDBCB] pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 overflow-hidden"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-0 opacity-20 sm:opacity-30">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#7ED5EA" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4BB4DE" />
          <Footer3DBackground />
        </Canvas>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-[#4BB4DE] rounded-full mix-blend-multiply filter blur-3xl opacity-10 sm:opacity-20"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-[#63BCE5] rounded-full mix-blend-multiply filter blur-3xl opacity-5 sm:opacity-10"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      {/* Top decorative line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4BB4DE] to-transparent"
      />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4BB4DE]/10 backdrop-blur-sm rounded-full border border-[#4BB4DE]/20">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ED5EA] animate-pulse" />
            <span className="text-[9px] sm:text-xs font-semibold text-[#EFDBCB]">Premium Trusted Platform</span>
            <Waves className="w-3 h-3 sm:w-4 sm:h-4 text-[#4BB4DE]" />
          </div>
        </motion.div>
        
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#4BB4DE]" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] bg-clip-text text-transparent">
                Secure Finder
              </span>
            </motion.div>
            <p className="text-[#EFDBCB]/60 text-xs sm:text-sm leading-relaxed max-w-xs">
              A revolutionary platform to report and claim lost items with AI-powered verification. 
              Your items are safe with us.
            </p>
            <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#4BB4DE]/10 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-[#4BB4DE]/20 backdrop-blur-sm`}
                >
                  <social.icon size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-[#EFDBCB]">
              <ChevronRight size={16} className="text-[#4BB4DE] mr-1" />
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-[#EFDBCB]/60 hover:text-[#EFDBCB] transition-all duration-300 flex items-center group text-sm"
                  >
                    <motion.span 
                      className="w-0 group-hover:w-1.5 h-0.5 bg-[#4BB4DE] transition-all duration-300 mr-0 group-hover:mr-1.5"
                      whileHover={{ width: 6 }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-[#EFDBCB]">
              <ChevronRight size={16} className="text-[#4BB4DE] mr-1" />
              Our Services
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path}
                    className="text-[#EFDBCB]/60 hover:text-[#EFDBCB] transition-all duration-300 flex items-center group text-sm"
                  >
                    <motion.span 
                      className="w-0 group-hover:w-1.5 h-0.5 bg-[#4BB4DE] transition-all duration-300 mr-0 group-hover:mr-1.5"
                      whileHover={{ width: 6 }}
                    />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-[#EFDBCB]">
              <ChevronRight size={16} className="text-[#4BB4DE] mr-1" />
              Contact Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <motion.li 
                className="flex items-start gap-2 sm:gap-3 text-[#EFDBCB]/60 text-xs sm:text-sm"
                whileHover={{ x: 5 }}
              >
                <MapPin size={14} className="text-[#4BB4DE] mt-0.5 flex-shrink-0" />
                <span className="break-words">123 Security Street, Tech City</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2 sm:gap-3 text-[#EFDBCB]/60 text-xs sm:text-sm"
                whileHover={{ x: 5 }}
              >
                <Phone size={14} className="text-[#4BB4DE] flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-[#EFDBCB] transition-colors">
                  +1 (234) 567-890
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2 sm:gap-3 text-[#EFDBCB]/60 text-xs sm:text-sm"
                whileHover={{ x: 5 }}
              >
                <Mail size={14} className="text-[#4BB4DE] flex-shrink-0" />
                <a href="mailto:support@securefinder.com" className="hover:text-[#EFDBCB] transition-colors break-all">
                  support@securefinder.com
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2 sm:gap-3 text-[#EFDBCB]/60 text-xs sm:text-sm"
                whileHover={{ x: 5 }}
              >
                <Clock size={14} className="text-[#4BB4DE] flex-shrink-0" />
                <span>24/7 Customer Support</span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Stats/Badges Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-[#4BB4DE]/10 pt-6 sm:pt-8 md:pt-10 mb-6 sm:mb-8 md:mb-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { value: '99.9%', label: 'Success Rate', icon: Award, gradient: 'from-[#4BB4DE] to-[#345DA7]' },
              { value: '50K+', label: 'Active Users', icon: Globe, gradient: 'from-[#345DA7] to-[#0F2557]' },
              { value: '100%', label: 'Secure & Safe', icon: Shield, gradient: 'from-[#4BB4DE] to-[#63BCE5]' },
              { value: '10K+', label: 'Items Reunited', icon: Heart, gradient: 'from-[#345DA7] to-[#4BB4DE]' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={statVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative">
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative bg-[#4BB4DE]/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#4BB4DE]/15 group-hover:border-[#4BB4DE]/30 transition-all duration-300">
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#4BB4DE] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <motion.p 
                      className="text-lg sm:text-xl md:text-2xl font-bold text-[#EFDBCB]"
                      initial={{ scale: 0.5 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[9px] sm:text-xs text-[#EFDBCB]/40 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-[#4BB4DE]/10 pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-[#EFDBCB]/60 flex items-center gap-2 justify-center sm:justify-start">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#4BB4DE] animate-pulse" />
                Subscribe to our newsletter for updates
              </p>
            </div>
            <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-48 md:w-56 lg:w-64 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4BB4DE]/5 border border-[#4BB4DE]/20 rounded-xl text-[#EFDBCB] placeholder-[#EFDBCB]/30 text-xs sm:text-sm focus:outline-none focus:border-[#4BB4DE] focus:ring-2 focus:ring-[#4BB4DE]/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734] rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#4BB4DE]/20 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="border-t border-[#4BB4DE]/10 pt-4 sm:pt-5 md:pt-6 mt-2 text-center text-[#EFDBCB]/40 text-[10px] sm:text-xs"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-3 h-3 text-[#4BB4DE]" />
              © {currentYear} Secure Finder. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              <Link to="/privacy" className="hover:text-[#EFDBCB] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#EFDBCB] transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-[#EFDBCB] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
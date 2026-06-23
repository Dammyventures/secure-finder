import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, Ring } from '@react-three/drei'
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, 
  Shield, Heart, Globe, ChevronRight, Clock, Award, Zap, Diamond, Crown, TrendingUp 
} from 'lucide-react'

// ========== 3D BACKGROUND FOR FOOTER - UPDATED COLORS ==========
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
            color="#1C448E"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.85}
            emissive="#938BA1"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2} position={[3, -1, -6]}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial 
            color="#938BA1"
            distort={0.5}
            speed={1.8}
            roughness={0.15}
            metalness={0.9}
            emissive="#F4FDFF"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.8} position={[0, 2, -7]}>
        <Ring args={[0.5, 0.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#F4FDFF" 
            emissive="#938BA1" 
            emissiveIntensity={0.6}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </Ring>
      </Float>
      
      <ThreeSparkles count={200} scale={[10, 10, 10]} size={0.05} speed={0.3} color="#F4FDFF" />
      <Stars radius={12} depth={40} count={800} factor={4} fade />
    </group>
  )
}

// ========== FOOTER COMPONENT - REFRESHED ==========
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
    { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-[#F4FDFF]' },
    { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-[#F4FDFF]' },
    { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-[#F4FDFF]' },
    { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-[#F4FDFF]' },
  ]
  
  // Fixed variants with proper typing
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
      className="relative bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] text-[#F4FDFF] pt-20 pb-8 overflow-hidden"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F4FDFF" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#938BA1" />
          <Footer3DBackground />
        </Canvas>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#938BA1] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F4FDFF] rounded-full mix-blend-multiply filter blur-3xl opacity-10"
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
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F4FDFF] to-transparent"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4FDFF]/10 backdrop-blur-sm rounded-full border border-[#F4FDFF]/20">
            <Crown className="w-4 h-4 text-[#F4FDFF] animate-pulse" />
            <span className="text-xs font-semibold text-[#F4FDFF]">Premium Trusted Platform</span>
            <Diamond className="w-3 h-3 text-[#938BA1]" />
          </div>
        </motion.div>
        
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ x: 5 }}
            >
              <Shield className="w-8 h-8 text-[#F4FDFF]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                Secure Finder
              </span>
            </motion.div>
            <p className="text-[#F4FDFF]/70 text-sm leading-relaxed">
              A revolutionary platform to report and claim lost items with AI-powered verification. 
              Your items are safe with us.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-[#F4FDFF]/10 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-[#F4FDFF]/20 backdrop-blur-sm`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#F4FDFF]">
              <ChevronRight size={18} className="text-[#938BA1] mr-1" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-[#F4FDFF]/70 hover:text-[#F4FDFF] transition-all duration-300 flex items-center group"
                  >
                    <motion.span 
                      className="w-0 group-hover:w-2 h-0.5 bg-[#F4FDFF] transition-all duration-300 mr-0 group-hover:mr-2"
                      whileHover={{ width: 8 }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#F4FDFF]">
              <ChevronRight size={18} className="text-[#938BA1] mr-1" />
              Our Services
            </h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path}
                    className="text-[#F4FDFF]/70 hover:text-[#F4FDFF] transition-all duration-300 flex items-center group"
                  >
                    <motion.span 
                      className="w-0 group-hover:w-2 h-0.5 bg-[#F4FDFF] transition-all duration-300 mr-0 group-hover:mr-2"
                      whileHover={{ width: 8 }}
                    />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#F4FDFF]">
              <ChevronRight size={18} className="text-[#938BA1] mr-1" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-start space-x-3 text-[#F4FDFF]/70"
                whileHover={{ x: 5 }}
              >
                <MapPin size={18} className="text-[#938BA1] mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Security Street, Tech City, TC 12345</span>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 text-[#F4FDFF]/70"
                whileHover={{ x: 5 }}
              >
                <Phone size={18} className="text-[#938BA1] flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm hover:text-[#F4FDFF] transition-colors">
                  +1 (234) 567-890
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 text-[#F4FDFF]/70"
                whileHover={{ x: 5 }}
              >
                <Mail size={18} className="text-[#938BA1] flex-shrink-0" />
                <a href="mailto:support@securefinder.com" className="text-sm hover:text-[#F4FDFF] transition-colors">
                  support@securefinder.com
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 text-[#F4FDFF]/70"
                whileHover={{ x: 5 }}
              >
                <Clock size={18} className="text-[#938BA1] flex-shrink-0" />
                <span className="text-sm">24/7 Customer Support</span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Stats/Badges Section with 3D Hover Effects */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-[#F4FDFF]/10 pt-10 mb-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '99.9%', label: 'Success Rate', icon: Award, gradient: 'from-[#938BA1] to-[#1C448E]' },
              { value: '50K+', label: 'Active Users', icon: Globe, gradient: 'from-[#1C448E] to-[#0F2A5E]' },
              { value: '100%', label: 'Secure & Safe', icon: Shield, gradient: 'from-[#938BA1] to-[#F4FDFF]' },
              { value: '10K+', label: 'Items Reunited', icon: Heart, gradient: 'from-[#1C448E] to-[#938BA1]' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={statVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative">
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#F4FDFF]/20 group-hover:border-[#F4FDFF]/40 transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-8 h-8 text-[#F4FDFF] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <motion.p 
                      className="text-2xl md:text-3xl font-bold text-[#F4FDFF]"
                      initial={{ scale: 0.5 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-[#F4FDFF]/50 mt-1">{stat.label}</p>
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
          className="border-t border-[#F4FDFF]/10 pt-10 pb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-[#F4FDFF]/70 flex items-center gap-2 justify-center md:justify-start">
                <Zap className="w-4 h-4 text-[#F4FDFF] animate-pulse" />
                Subscribe to our newsletter for updates
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-[#F4FDFF]/10 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/40 focus:outline-none focus:border-[#F4FDFF] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
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
          className="border-t border-[#F4FDFF]/10 pt-6 mt-2 text-center text-[#F4FDFF]/50 text-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-[#938BA1]" />
              © {currentYear} Secure Finder. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-[#F4FDFF] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#F4FDFF] transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-[#F4FDFF] transition-colors">
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
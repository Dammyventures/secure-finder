import React, { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Award, 
  Heart, 
  Globe, 
  Clock, 
  CheckCircle,
  Zap,
  Lock,
  MapPin,
  Bell,
  Sparkles,
  Crown,
  Diamond,
  ArrowRight,
  Star,
  Quote,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/UI/Button'

const About: React.FC = () => {
  const { scrollYProgress } = useScroll()

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5])

  const stats = [
    { value: '50,000+', label: 'Active Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { value: '10,000+', label: 'Items Reunited', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { value: '99.9%', label: 'Success Rate', icon: Award, color: 'from-green-500 to-emerald-500' },
    { value: '48h', label: 'Avg Recovery Time', icon: Clock, color: 'from-orange-500 to-red-500' },
    { value: '150+', label: 'Countries Served', icon: Globe, color: 'from-purple-500 to-indigo-500' },
    { value: '24/7', label: 'Customer Support', icon: Bell, color: 'from-yellow-500 to-amber-500' },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Advanced identity verification ensures items are returned to rightful owners securely.',
      color: '#8b5cf6'
    },
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm matches lost items with found items instantly.',
      color: '#fbbf24'
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description: 'Smart location tracking helps find items in your vicinity.',
      color: '#10b981'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'Your data and communications are fully encrypted and secure.',
      color: '#ef4444'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of verified users helping each other.',
      color: '#06b6d4'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your needs.',
      color: '#f59e0b'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      bio: 'Former tech executive passionate about community safety'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      bio: 'AI and blockchain expert with 15+ years experience'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      bio: 'Former logistics director focused on user experience'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      bio: 'Full-stack developer passionate about clean code'
    }
  ]

  const milestones = [
    { year: '2022', title: 'Company Founded', description: 'Started with a vision to reunite lost items', icon: Star },
    { year: '2023', title: 'Launch', description: 'Platform launched with 1,000+ beta users', icon: Sparkles },
    { year: '2024', title: 'Global Expansion', description: 'Expanded to 150+ countries worldwide', icon: Globe },
    { year: '2025', title: '1M+ Items Reunited', description: 'Major milestone in community impact', icon: Crown },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const timelineVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    })
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082]">
      
      {/* Main Content - Full width with no side padding */}
      <div className="w-full">
        
        {/* Hero Section - Full Width */}
        <section className="relative w-full overflow-hidden pt-20 pb-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10" />
          
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 w-full max-w-6xl mx-auto text-center px-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl mb-6"
            >
              <Shield className="w-10 h-10 text-[#4b0082]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                Revolutionizing
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#c4b5fd] to-[#E5E4E2] bg-clip-text text-transparent">
                Lost & Found
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
            >
              We're on a mission to reunite people with their lost belongings using cutting-edge AI technology,
              blockchain verification, and a passionate community of helpers worldwide.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl px-8">
                  Join Our Mission
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section - Full Width */}
        <section className="w-full py-16 bg-white/5 backdrop-blur-sm">
          <div className="w-full max-w-7xl mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Section - Full Width */}
        <section className="w-full py-20">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                  <Crown className="w-4 h-4 text-[#E5E4E2]" />
                  <span className="text-xs text-white/80">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Making the World a
                  <span className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent"> Little Smaller</span>
                </h2>
                <p className="text-white/60 text-lg mb-6 leading-relaxed">
                  Every day, thousands of valuable items are lost and never found. We believe that
                  technology can bridge the gap between loss and recovery, creating a global community
                  dedicated to helping each other.
                </p>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  Our platform combines AI-powered matching, blockchain verification, and a passionate
                  community to ensure that lost items find their way back home.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm">Trusted by 50,000+ users worldwide</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <Quote className="w-12 h-12 text-[#E5E4E2] mb-4 opacity-50" />
                  <p className="text-white/80 text-lg italic mb-4">
                    "I lost my grandmother's wedding ring and thought I'd never see it again.
                    Secure Finder helped me connect with the person who found it. I'm forever grateful."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Sarah Thompson</p>
                      <p className="text-white/40 text-sm">Verified User</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Full Width */}
        <section className="w-full py-20 bg-white/5">
          <div className="w-full max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                <Diamond className="w-4 h-4 text-[#E5E4E2]" />
                <span className="text-xs text-white/80">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="text-white/50 mt-2 max-w-2xl mx-auto">
                We combine cutting-edge technology with human compassion
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Milestones Section - Full Width */}
        <section className="w-full py-20">
          <div className="w-full max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Our Journey</h2>
              <p className="text-white/50">Key milestones in our story</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#E5E4E2] to-transparent hidden md:block" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={timelineVariants}
                    className={`flex flex-col md:flex-row items-center gap-6 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <milestone.icon className="w-5 h-5 text-[#E5E4E2]" />
                          <span className="text-2xl font-bold text-[#E5E4E2]">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-white/50">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] flex items-center justify-center z-10">
                      <CheckCircle className="w-6 h-6 text-[#4b0082]" />
                    </div>
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - Full Width */}
        <section className="w-full py-20 bg-white/5">
          <div className="w-full max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                <Users className="w-4 h-4 text-[#E5E4E2]" />
                <span className="text-xs text-white/80">Our Team</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                The Minds Behind the Magic
              </h2>
              <p className="text-white/50 mt-2">Passionate individuals dedicated to your success</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#E5E4E2]/20"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#E5E4E2] text-sm mb-2">{member.role}</p>
                  <p className="text-white/40 text-xs">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Full Width */}
        <section className="w-full py-20">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
            >
              <Crown className="w-16 h-16 text-[#E5E4E2] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already helping reunite lost items with their owners.
                Together, we can make the world a little smaller.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl px-8">
                    Get Started Now
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                    Contact Us
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Full Width */}
        <footer className="w-full border-t border-white/10 py-8">
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#E5E4E2]" />
                <span className="text-white font-bold">Secure Finder</span>
                <span className="text-white/40 text-sm">© 2025. All rights reserved.</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-white/40 hover:text-[#E5E4E2] transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-white/40 hover:text-[#E5E4E2] transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-white/40 hover:text-[#E5E4E2] transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-white/40 hover:text-[#E5E4E2] transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
              <div className="flex gap-4">
                <a href="/privacy" className="text-white/40 hover:text-[#E5E4E2] text-sm transition-colors">Privacy</a>
                <a href="/terms" className="text-white/40 hover:text-[#E5E4E2] text-sm transition-colors">Terms</a>
                <a href="/contact" className="text-white/40 hover:text-[#E5E4E2] text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default About
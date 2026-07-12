import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Award, 
  Heart, 
  Clock, 
  CheckCircle,
  MapPin,
  Bell,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  Bus,
  Coffee,
  Wifi,
  Phone
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/UI/Button'

const About: React.FC = () => {
  const stats = [
    { value: '5,000+', label: 'Caleb Students', icon: Users },
    { value: '2,500+', label: 'Items Reunited', icon: Heart },
    { value: '98%', label: 'Success Rate', icon: Award },
    { value: '12h', label: 'Avg Recovery Time', icon: Clock },
    { value: '100+', label: 'Lost Reports/Month', icon: Bell },
    { value: '24/7', label: 'Campus Support', icon: Shield },
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'Lost Textbooks & Notes',
      description: 'Quickly report and find lost course materials, textbooks, and lecture notes around campus.',
      color: '#1C448E'
    },
    {
      icon: Phone,
      title: 'Electronics Recovery',
      description: 'Reunite with lost phones, laptops, and tablets in Caleb University lecture halls and libraries.',
      color: '#938BA1'
    },
    {
      icon: MapPin,
      title: 'Campus Location Finder',
      description: 'Pinpoint exactly where items were lost or found across Caleb University campus.',
      color: '#1C448E'
    },
    {
      icon: Bus,
      title: 'Shuttle & Transport Items',
      description: 'Recover items left behind in campus shuttles, buses, and transportation hubs.',
      color: '#938BA1'
    },
    {
      icon: Coffee,
      title: 'Cafeteria & Common Areas',
      description: 'Find personal items lost in the student center, cafeterias, and common gathering spots.',
      color: '#1C448E'
    },
    {
      icon: Wifi,
      title: 'Real-Time Notifications',
      description: 'Get instant alerts when your lost item is found or when someone reports a found item near you.',
      color: '#938BA1'
    }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Report Your Lost Item',
      description: 'Create a detailed report with the item\'s description, location, and time lost on campus.'
    },
    {
      step: '2',
      title: 'Browse Found Items',
      description: 'Check the found items section to see if someone has already found your belongings.'
    },
    {
      step: '3',
      title: 'Get Matched',
      description: 'Our system automatically matches your lost report with found items in the same location.'
    },
    {
      step: '4',
      title: 'Reunite & Recover',
      description: 'Connect with the finder and arrange a pickup on campus to get your item back.'
    }
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

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
      
      <div className="w-full">
        
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden pt-20 pb-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10" />
          
          <motion.div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] rounded-2xl shadow-xl mb-6"
            >
              <GraduationCap className="w-10 h-10 text-[#1C448E]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                Your Caleb University
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#938BA1] to-[#F4FDFF] bg-clip-text text-transparent">
                Lost & Found Hub
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#F4FDFF]/80 max-w-3xl mx-auto mb-8"
            >
              A dedicated platform for Caleb University students to report lost items, 
              find missing belongings, and connect with fellow students across campus.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/report-lost">
                <Button size="lg" className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl px-8">
                  Report a Lost Item
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="lg" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 px-8">
                  Browse Found Items
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-[#F4FDFF]/5 backdrop-blur-sm">
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
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-[#1C448E] to-[#938BA1] rounded-xl flex items-center justify-center shadow-lg">
                    <stat.icon className="w-6 h-6 text-[#F4FDFF]" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-[#F4FDFF]">{stat.value}</div>
                  <div className="text-xs text-[#F4FDFF]/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20">
          <div className="w-full max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4FDFF]/10 rounded-full mb-4">
                <School className="w-4 h-4 text-[#F4FDFF]" />
                <span className="text-xs text-[#F4FDFF]/80">For Caleb Students</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-[#F4FDFF]/50 mt-2 max-w-2xl mx-auto">
                Four simple steps to reunite with your lost belongings
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20 text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] flex items-center justify-center text-[#1C448E] font-bold text-xl mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-[#F4FDFF] mb-2">{step.title}</h3>
                    <p className="text-[#F4FDFF]/50 text-sm">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#F4FDFF]/20">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-[#F4FDFF]/5">
          <div className="w-full max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                Why Caleb Students Love Us
              </h2>
              <p className="text-[#F4FDFF]/50 mt-2 max-w-2xl mx-auto">
                Features designed specifically for the Caleb University community
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
                  className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F4FDFF]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#F4FDFF] mb-2">{feature.title}</h3>
                  <p className="text-[#F4FDFF]/50 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-20">
          <div className="w-full max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-[#F4FDFF]/10 backdrop-blur-xl rounded-3xl p-12 border border-[#F4FDFF]/20 text-center"
            >
              <Heart className="w-16 h-16 text-[#F4FDFF] mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl text-[#F4FDFF]/80 italic mb-6">
                "I lost my laptop in the library during exams and thought all my work was gone forever. 
                Thanks to this platform, a fellow Caleb student found it and returned it within 4 hours!"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#1C448E] to-[#938BA1] rounded-full flex items-center justify-center text-[#F4FDFF] font-bold">
                  CE
                </div>
                <div className="text-left">
                  <p className="text-[#F4FDFF] font-medium">Chidi Eze</p>
                  <p className="text-[#F4FDFF]/40 text-sm">Caleb Student • Class of 2026</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-[#F4FDFF]/5">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#F4FDFF] mb-4">
                Lost Something on Campus?
              </h2>
              <p className="text-[#F4FDFF]/60 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of Caleb students who are helping each other recover lost items. 
                Don't wait - report your lost item now and get back to what matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/report-lost">
                  <Button size="lg" className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl px-8">
                    Report Lost Item
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" size="lg" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 px-8">
                    Browse Found Items
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-[#F4FDFF]/10 py-8">
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#F4FDFF]" />
                <span className="text-[#F4FDFF] font-bold">Secure Finder</span>
                <span className="text-[#F4FDFF]/40 text-sm">© 2026. All rights reserved.</span>
              </div>
              <div className="flex gap-4">
                <a href="/privacy" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Terms of Use</a>
                <a href="/contact" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default About
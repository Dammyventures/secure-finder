import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Headphones,
  Shield,
  Crown,
  Diamond,
  Sparkles,
  Globe,
  Users,
  Award
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/UI/Button'
import ChatBot from '../components/chat/ChatBot'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Caleb University, Lagos Nigeria.'],
      color: 'from-[#1C448E] to-[#0F2A5E]'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+234 811 305 2127', '+234 915 444 4915', 'Mon-Fri, 9am-6pm EST'],
      color: 'from-[#938BA1] to-[#7A8BB8]'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['agboolacatherine2026@gmail.com', 'damilolaogunleye2019@gmail.com'],
      color: 'from-[#1C448E] to-[#938BA1]'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: ['24/7 Emergency Support', 'Live Chat: 24/7', 'Phone Support: 9am-9pm EST'],
      color: 'from-[#0F2A5E] to-[#1C448E]'
    }
  ]

  const faqs = [
    {
      question: 'How does identity verification work?',
      answer: 'Our verification process uses AI-powered document analysis and blockchain technology to ensure your identity is authentic and secure.'
    },
    {
      question: 'How long does it take to find a lost item?',
      answer: 'Average recovery time is 48 hours, but this varies based on location and item type. Our AI matching system works 24/7.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes! We use end-to-end encryption and never share your data with third parties without your consent.'
    },
    {
      question: 'What happens if someone claims my item?',
      answer: 'We have a secure verification process to ensure items are returned to the rightful owner.'
    }
  ]

  const stats = [
    { value: '99.9%', label: 'Customer Satisfaction', icon: Award },
    { value: '< 24h', label: 'Avg Response Time', icon: Clock },
    { value: '50K+', label: 'Happy Users', icon: Users },
    { value: '150+', label: 'Countries Served', icon: Globe },
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
      
      {/* Main Content */}
      <div className="w-full">
        
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden pt-20 pb-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10" />
          
          <motion.div 
            className="relative z-10 w-full max-w-6xl mx-auto text-center px-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] rounded-2xl shadow-xl mb-6"
            >
              <MessageCircle className="w-10 h-10 text-[#1C448E]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                Get in Touch
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[#F4FDFF]/70 max-w-3xl mx-auto mb-8"
            >
              We're here to help! Reach out to us anytime for support, inquiries, or feedback.
              Our team is available 24/7 to assist you. You can also chat with our AI assistant
              using the chat button at the bottom right.
            </motion.p>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="w-full py-8 bg-[#F4FDFF]/5 backdrop-blur-sm">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-[#F4FDFF] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#F4FDFF]">{stat.value}</div>
                  <div className="text-xs text-[#F4FDFF]/50">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="w-full py-16">
          <div className="w-full max-w-7xl mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40 transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                    <info.icon className="w-7 h-7 text-[#F4FDFF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F4FDFF] mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-[#F4FDFF]/60 text-sm">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="w-full py-16 bg-[#F4FDFF]/5">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#F4FDFF]/20"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4FDFF]/10 rounded-full mb-4">
                    <Mail className="w-4 h-4 text-[#F4FDFF]" />
                    <span className="text-xs text-[#F4FDFF]/80">Send us a message</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#F4FDFF]">We'd Love to Hear From You</h2>
                  <p className="text-[#F4FDFF]/50 mt-2">Fill out the form and we'll get back to you within 24 hours</p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#938BA1]/20 border border-[#938BA1]/30 rounded-xl p-6 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-[#938BA1] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#F4FDFF] mb-2">Message Sent!</h3>
                    <p className="text-[#F4FDFF]/60">Thank you for reaching out. We'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[#F4FDFF]/5 border rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none ${
                          errors.name ? 'border-red-500' : 'border-[#F4FDFF]/20'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[#F4FDFF]/5 border rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none ${
                          errors.email ? 'border-red-500' : 'border-[#F4FDFF]/20'
                        }`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[#F4FDFF]/5 border rounded-xl text-[#F4FDFF] focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none ${
                          errors.subject ? 'border-red-500' : 'border-[#F4FDFF]/20'
                        }`}
                      >
                        <option value="" className="bg-[#1C448E]">Select a subject</option>
                        <option value="General Inquiry" className="bg-[#1C448E]">General Inquiry</option>
                        <option value="Support" className="bg-[#1C448E]">Technical Support</option>
                        <option value="Partnership" className="bg-[#1C448E]">Partnership Opportunity</option>
                        <option value="Feedback" className="bg-[#1C448E]">Feedback</option>
                        <option value="Report Issue" className="bg-[#1C448E]">Report an Issue</option>
                      </select>
                      {errors.subject && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 bg-[#F4FDFF]/5 border rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none resize-none ${
                          errors.message ? 'border-red-500' : 'border-[#F4FDFF]/20'
                        }`}
                        placeholder="How can we help you?"
                      />
                      {errors.message && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl py-3"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Map & Social Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Map Placeholder */}
                <div className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#F4FDFF]/20">
                  <div className="h-64 bg-gradient-to-br from-[#1C448E]/20 to-[#938BA1]/20 flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-[#F4FDFF] mx-auto mb-2" />
                      <p className="text-[#F4FDFF]/60">Interactive Map</p>
                      <p className="text-[#F4FDFF]/40 text-sm">Caleb University, Lagos Nigeria.</p>
                    </div>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#F4FDFF]/20 rounded-full" />
                      <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-[#F4FDFF]/20 rounded-full" />
                      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-[#F4FDFF]/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Social Connect */}
                <div className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#F4FDFF]" />
                    <h3 className="text-lg font-bold text-[#F4FDFF]">Connect With Us</h3>
                  </div>
                  <p className="text-[#F4FDFF]/50 text-sm mb-6">
                    Follow us on social media for updates, news, and community stories
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 bg-[#F4FDFF]/10 rounded-xl flex items-center justify-center hover:bg-[#F4FDFF]/20 transition-all duration-300 group">
                      <Facebook className="w-5 h-5 text-[#F4FDFF]/60 group-hover:text-[#F4FDFF]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-[#F4FDFF]/10 rounded-xl flex items-center justify-center hover:bg-[#F4FDFF]/20 transition-all duration-300 group">
                      <Twitter className="w-5 h-5 text-[#F4FDFF]/60 group-hover:text-[#F4FDFF]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-[#F4FDFF]/10 rounded-xl flex items-center justify-center hover:bg-[#F4FDFF]/20 transition-all duration-300 group">
                      <Instagram className="w-5 h-5 text-[#F4FDFF]/60 group-hover:text-[#F4FDFF]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-[#F4FDFF]/10 rounded-xl flex items-center justify-center hover:bg-[#F4FDFF]/20 transition-all duration-300 group">
                      <Linkedin className="w-5 h-5 text-[#F4FDFF]/60 group-hover:text-[#F4FDFF]" />
                    </a>
                  </div>
                </div>

                {/* Live Chat CTA */}
                <div className="bg-gradient-to-r from-[#1C448E]/20 to-[#938BA1]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Headphones className="w-10 h-10 text-[#F4FDFF]" />
                    <div>
                      <h3 className="text-lg font-bold text-[#F4FDFF]">Live Support 24/7</h3>
                      <p className="text-[#F4FDFF]/50 text-sm">Chat with our AI assistant or human support</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      // Trigger chat bot - look for chat button and click it
                      const chatButton = document.querySelector('.fixed.bottom-6.right-6') as HTMLElement;
                      if (chatButton) {
                        chatButton.click();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Live Chat
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16">
          <div className="w-full max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4FDFF]/10 rounded-full mb-4">
                <Diamond className="w-4 h-4 text-[#F4FDFF]" />
                <span className="text-xs text-[#F4FDFF]/80">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-[#F4FDFF]/50 mt-2">Find quick answers to common questions</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#F4FDFF]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-[#F4FDFF] mb-2">{faq.question}</h3>
                  <p className="text-[#F4FDFF]/50 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-[#F4FDFF]/5">
          <div className="w-full max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-[#F4FDFF]/10 backdrop-blur-xl rounded-3xl p-12 border border-[#F4FDFF]/20"
            >
              <Crown className="w-16 h-16 text-[#F4FDFF] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#F4FDFF] mb-4">
                Still Have Questions?
              </h2>
              <p className="text-[#F4FDFF]/60 text-lg mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is ready to help
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    const chatButton = document.querySelector('.fixed.bottom-6.right-6') as HTMLElement;
                    if (chatButton) {
                      chatButton.click();
                    }
                  }}
                  size="lg" 
                  className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl px-8"
                >
                  <Headphones className="mr-2 h-4 w-4" />
                  Chat with Support
                </Button>
                <Link to="/">
                  <Button variant="outline" size="lg" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 px-8">
                    <Globe className="mr-2 h-4 w-4" />
                    Back to Home
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
                <Shield className="w-6 h-6 text-[#F4FDFF]" />
                <span className="text-[#F4FDFF] font-bold">Secure Finder</span>
                <span className="text-[#F4FDFF]/40 text-sm">© 2026. All rights reserved.</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
              <div className="flex gap-4">
                <a href="/privacy" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Privacy</a>
                <a href="/terms" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Terms</a>
                <a href="/contact" className="text-[#F4FDFF]/40 hover:text-[#F4FDFF] text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Chat Bot - Floating on all pages */}
      <ChatBot />
    </div>
  )
}

export default Contact
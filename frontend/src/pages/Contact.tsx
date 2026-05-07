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
      details: ['123 Security Street', 'Tech City, TC 12345', 'United States'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (234) 567-8900', '+1 (234) 567-8901', 'Mon-Fri, 9am-6pm EST'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@securefinder.com', 'careers@securefinder.com', 'press@securefinder.com'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: ['24/7 Emergency Support', 'Live Chat: 24/7', 'Phone Support: 9am-9pm EST'],
      color: 'from-orange-500 to-red-500'
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
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082]">
      
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
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl mb-6"
            >
              <MessageCircle className="w-10 h-10 text-[#4b0082]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                Get in Touch
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
            >
              We're here to help! Reach out to us anytime for support, inquiries, or feedback.
              Our team is available 24/7 to assist you. You can also chat with our AI assistant
              using the chat button at the bottom right.
            </motion.p>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="w-full py-8 bg-white/5 backdrop-blur-sm">
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
                  <stat.icon className="w-8 h-8 text-[#E5E4E2] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
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
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-white/60 text-sm">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="w-full py-16 bg-white/5">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                    <Mail className="w-4 h-4 text-[#E5E4E2]" />
                    <span className="text-xs text-white/80">Send us a message</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">We'd Love to Hear From You</h2>
                  <p className="text-white/50 mt-2">Fill out the form and we'll get back to you within 24 hours</p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/60">Thank you for reaching out. We'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none ${
                          errors.name ? 'border-red-500' : 'border-white/20'
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
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none ${
                          errors.email ? 'border-red-500' : 'border-white/20'
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
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none ${
                          errors.subject ? 'border-red-500' : 'border-white/20'
                        }`}
                      >
                        <option value="" className="bg-[#4b0082]">Select a subject</option>
                        <option value="General Inquiry" className="bg-[#4b0082]">General Inquiry</option>
                        <option value="Support" className="bg-[#4b0082]">Technical Support</option>
                        <option value="Partnership" className="bg-[#4b0082]">Partnership Opportunity</option>
                        <option value="Feedback" className="bg-[#4b0082]">Feedback</option>
                        <option value="Report Issue" className="bg-[#4b0082]">Report an Issue</option>
                      </select>
                      {errors.subject && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none resize-none ${
                          errors.message ? 'border-red-500' : 'border-white/20'
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
                      className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl py-3"
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
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                  <div className="h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-[#E5E4E2] mx-auto mb-2" />
                      <p className="text-white/60">Interactive Map</p>
                      <p className="text-white/40 text-sm">123 Security Street, Tech City</p>
                    </div>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full" />
                      <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-white/20 rounded-full" />
                      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Social Connect */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#E5E4E2]" />
                    <h3 className="text-lg font-bold text-white">Connect With Us</h3>
                  </div>
                  <p className="text-white/50 text-sm mb-6">
                    Follow us on social media for updates, news, and community stories
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                      <Facebook className="w-5 h-5 text-white/60 group-hover:text-[#E5E4E2]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                      <Twitter className="w-5 h-5 text-white/60 group-hover:text-[#E5E4E2]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                      <Instagram className="w-5 h-5 text-white/60 group-hover:text-[#E5E4E2]" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                      <Linkedin className="w-5 h-5 text-white/60 group-hover:text-[#E5E4E2]" />
                    </a>
                  </div>
                </div>

                {/* Live Chat CTA */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Headphones className="w-10 h-10 text-[#E5E4E2]" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Live Support 24/7</h3>
                      <p className="text-white/50 text-sm">Chat with our AI assistant or human support</p>
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
                    className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                <Diamond className="w-4 h-4 text-[#E5E4E2]" />
                <span className="text-xs text-white/80">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-white/50 mt-2">Find quick answers to common questions</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-white/50 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-white/5">
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
                Still Have Questions?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
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
                  className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl px-8"
                >
                  <Headphones className="mr-2 h-4 w-4" />
                  Chat with Support
                </Button>
                <Link to="/">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                    <Globe className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
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

      {/* Chat Bot - Floating on all pages */}
      <ChatBot />
    </div>
  )
}

export default Contact
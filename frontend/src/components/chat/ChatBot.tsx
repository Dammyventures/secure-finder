// src/components/chat/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Shield, 
  Search, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Heart,
  Users,
  Crown,
  Waves
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'action' | 'link'
}

interface QuickReply {
  text: string
  action: string
  icon?: React.ReactNode
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        text: "🌊 Hello! I'm your Secure AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([greeting])
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1)
      }
    }
  }, [messages, isOpen])

  // Reset unread when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      inputRef.current?.focus()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (text: string, sender: 'user' | 'bot', type?: 'text' | 'action' | 'link') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type
    }
    setMessages(prev => [...prev, newMessage])
    scrollToBottom()
  }

  const simulateTyping = async (response: string) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
    setIsTyping(false)
    addMessage(response, 'bot')
  }

  const getBotResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Lost Item related
    if (lowerMessage.includes('lost') || lowerMessage.includes('lose') || lowerMessage.includes('missing')) {
      if (lowerMessage.includes('report') || lowerMessage.includes('how')) {
        await simulateTyping("To report a lost item, click the 'Report Lost Item' button on your dashboard or go to the homepage. You'll need to provide details like item description, location, and photos. Our AI will then match it with found items in our database. Would you like me to guide you there? 🔍")
        addQuickReplies([
          { text: '📝 Report Lost Item', action: 'report_lost' },
          { text: '🔍 Search Found Items', action: 'search_found' },
          { text: '❓ Tips for reporting', action: 'tips_lost' }
        ])
      } else {
        await simulateTyping("I'm sorry you lost something! Here's what you can do:\n\n1️⃣ Report your lost item immediately\n2️⃣ Check our database for matches\n3️⃣ Set up notifications for when similar items are found\n\nWould you like to report a lost item now? 📍")
        addQuickReplies([
          { text: '✅ Report Lost Item', action: 'report_lost' },
          { text: '🔔 Set up notifications', action: 'notifications' },
          { text: '📋 View my lost items', action: 'view_items' }
        ])
      }
    }
    // Found Item related
    else if (lowerMessage.includes('found') || lowerMessage.includes('find')) {
      await simulateTyping("Great! If you've found an item, here's what to do:\n\n1️⃣ Report the found item\n2️⃣ Add clear photos and description\n3️⃣ Set a secure location for return\n\nThis helps reunite items with their owners faster! Want to report a found item now? 🎯")
      addQuickReplies([
        { text: '📦 Report Found Item', action: 'report_found' },
        { text: '🏆 My found items', action: 'my_found' },
        { text: '💰 Reward guidelines', action: 'reward_info' }
      ])
    }
    // Verification related
    else if (lowerMessage.includes('verify') || lowerMessage.includes('verification') || lowerMessage.includes('identity')) {
      await simulateTyping("Identity verification is crucial for security! It helps us ensure items are returned to the right owners. The process takes about 5-10 minutes and requires:\n\n✅ Government ID photo\n✅ Selfie verification\n✅ Optional video call\n\nYour data is fully encrypted and secure. Ready to start verification? 🔒")
      addQuickReplies([
        { text: '🛡️ Start Verification', action: 'verify' },
        { text: '📋 Verification status', action: 'verify_status' },
        { text: '❓ Why verify?', action: 'why_verify' }
      ])
    }
    // Claim related
    else if (lowerMessage.includes('claim') || lowerMessage.includes('claimed')) {
      await simulateTyping("To claim an item that matches yours:\n\n1️⃣ Find the item in search results\n2️⃣ Click 'Claim Item'\n3️⃣ Provide proof of ownership\n4️⃣ Complete verification\n5️⃣ Arrange pickup/delivery\n\nOur secure code system ensures only rightful owners get their items back. Need help with a claim? 📋")
      addQuickReplies([
        { text: '🔍 Search my item', action: 'search' },
        { text: '📝 My claims', action: 'my_claims' },
        { text: '❓ Claim process', action: 'claim_process' }
      ])
    }
    // Search help
    else if (lowerMessage.includes('search') || lowerMessage.includes('find item')) {
      await simulateTyping("Our smart search helps you find items easily! You can filter by:\n\n📍 Location radius\n📂 Category (electronics, bags, etc.)\n🔄 Item type (lost/found)\n💰 Reward amount\n📅 Date range\n\nTry our advanced filters for better results! What would you like to search for? 🔎")
      addQuickReplies([
        { text: '🔍 Search items', action: 'search' },
        { text: '🗺️ Search near me', action: 'nearby' },
        { text: '📊 Search tips', action: 'search_tips' }
      ])
    }
    // Notifications
    else if (lowerMessage.includes('notif') || lowerMessage.includes('alert')) {
      await simulateTyping("Stay updated with real-time notifications! You'll receive alerts when:\n\n🔔 Items matching yours are found\n✅ Verification status changes\n💬 New messages about your items\n🎯 Matches found nearby\n\nYou can customize notification preferences in your profile settings. Would you like to adjust your notification settings? 📱")
      addQuickReplies([
        { text: '⚙️ Notification Settings', action: 'settings' },
        { text: '🔔 Enable all', action: 'enable_all' },
        { text: '❓ Notification types', action: 'notification_types' }
      ])
    }
    // Dashboard help
    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('account')) {
      await simulateTyping("Your dashboard is your command center! From there you can:\n\n📊 View your activity stats\n📦 Manage your items\n✅ Track verification status\n💬 See messages\n🏆 Check rewards\n\nWant to visit your dashboard now? 🚀")
      addQuickReplies([
        { text: '📊 Go to Dashboard', action: 'dashboard' },
        { text: '📈 View stats', action: 'stats' },
        { text: '⚙️ Account settings', action: 'settings' }
      ])
    }
    // Rewards
    else if (lowerMessage.includes('reward') || lowerMessage.includes('earn')) {
      await simulateTyping("Our reward system encourages community participation! You earn points when:\n\n💰 Your reported items get claimed\n🏆 You help others find items\n⭐ You maintain high verification score\n🎯 You resolve claims quickly\n\nReward points can be redeemed for premium features or donated to charity! Want to check your rewards? 🎁")
      addQuickReplies([
        { text: '🏆 My Rewards', action: 'rewards' },
        { text: '📊 Leaderboard', action: 'leaderboard' },
        { text: '❓ How to earn more', action: 'earn_more' }
      ])
    }
    // Security
    else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('protect')) {
      await simulateTyping("Your security is our top priority! We protect you with:\n\n🔒 End-to-end encryption\n🛡️ Two-factor authentication\n✅ Identity verification\n📱 Secure messaging\n📍 Safe meeting recommendations\n\nAlways verify user identity before meeting and use public locations for exchanges. Need security tips? 🛡️")
      addQuickReplies([
        { text: '🔐 Security Tips', action: 'security_tips' },
        { text: '⚙️ Enable 2FA', action: 'two_factor' },
        { text: '📋 Privacy Policy', action: 'privacy' }
      ])
    }
    // General greeting
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      await simulateTyping("🌊 Hey there! I'm your Secure AI assistant. I can help you with:\n\n🔍 Finding lost/found items\n✅ Verification process\n💬 Claims and messages\n📊 Dashboard navigation\n🎯 Search tips\n\nWhat would you like to know?")
      addQuickReplies([
        { text: '🔍 Find my lost item', action: 'search' },
        { text: '📝 Report an item', action: 'report' },
        { text: '🛡️ Verification help', action: 'verify' }
      ])
    }
    // FAQ
    else if (lowerMessage.includes('faq') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
      await simulateTyping("Here are common questions I can answer:\n\n❓ How to report lost/found items\n❓ Identity verification process\n❓ How claims work\n❓ Search tips and tricks\n❓ Notification settings\n❓ Rewards system\n\nJust ask me anything! What would you like to know? 📚")
      addQuickReplies([
        { text: '❓ FAQ', action: 'faq' },
        { text: '📞 Contact Support', action: 'support' },
        { text: '📖 User Guide', action: 'guide' }
      ])
    }
    // Default response
    else {
      await simulateTyping("🌊 I can help you with:\n\n🔍 Finding lost/found items - ask me about search\n✅ Identity verification - ask about verification\n📝 Reporting items - ask how to report\n💬 Claims process - ask about claims\n🔔 Notifications - ask about alerts\n\nWhat specific help do you need? I'm here 24/7! 💫")
      addQuickReplies([
        { text: '🔍 Search items', action: 'search' },
        { text: '📝 Report item', action: 'report' },
        { text: '✅ Verification', action: 'verify' },
        { text: '📞 Contact Support', action: 'support' }
      ])
    }
  }

  const addQuickReplies = (replies: QuickReply[]) => {
    const quickReplies = replies.map(reply => reply.text).join(' • ')
    setMessages(prev => [...prev, {
      id: `quick-${Date.now()}`,
      text: quickReplies,
      sender: 'bot',
      timestamp: new Date(),
      type: 'action'
    }])
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const userMessage = inputText.trim()
    addMessage(userMessage, 'user')
    setInputText('')

    await getBotResponse(userMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = async (action: string) => {
    const actionMap: Record<string, string> = {
      'report_lost': 'I want to report a lost item',
      'report_found': 'I found an item and want to report it',
      'search': 'Help me search for items',
      'verify': 'How do I verify my identity?',
      'dashboard': 'Take me to my dashboard',
      'settings': 'How do I change my notification settings?',
      'rewards': 'Tell me about rewards',
      'support': 'I need to contact support',
      'nearby': 'Show me items near me',
      'my_claims': 'Show my active claims',
      'security_tips': 'Give me security tips',
      'two_factor': 'How to enable two-factor authentication?',
      'privacy': 'What is your privacy policy?',
      'leaderboard': 'Show me the community leaderboard',
      'earn_more': 'How can I earn more rewards?',
      'faq': 'Show me frequently asked questions',
      'guide': 'Show me the user guide',
      'notification_types': 'What notifications can I get?',
      'enable_all': 'Enable all notifications',
      'why_verify': 'Why do I need to verify?',
      'verify_status': 'Check my verification status',
      'tips_lost': 'Tips for reporting lost items',
      'reward_info': 'Tell me about rewards',
      'view_items': 'View my reported items',
      'my_found': 'View my found items',
      'claim_process': 'How does claiming work?',
      'search_tips': 'Tips for better search results',
      'stats': 'Show my account statistics'
    }

    const message = actionMap[action] || action
    addMessage(message, 'user')
    await getBotResponse(message)
  }

  const renderQuickReplies = (text: string) => {
    const replies = text.split(' • ')
    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
        {replies.map((reply, idx) => {
          let action = ''
          if (reply.includes('Report Lost')) action = 'report_lost'
          else if (reply.includes('Search Found')) action = 'search_found'
          else if (reply.includes('Tips for reporting')) action = 'tips_lost'
          else if (reply.includes('Verify')) action = 'verify'
          else if (reply.includes('Report Found')) action = 'report_found'
          else if (reply.includes('Search items')) action = 'search'
          else if (reply.includes('near me')) action = 'nearby'
          else if (reply.includes('Dashboard')) action = 'dashboard'
          else if (reply.includes('Settings')) action = 'settings'
          else if (reply.includes('Rewards')) action = 'rewards'
          else if (reply.includes('Contact Support')) action = 'support'
          else if (reply.includes('FAQ')) action = 'faq'
          else if (reply.includes('Guide')) action = 'guide'
          else if (reply.includes('Enable all')) action = 'enable_all'
          else if (reply.includes('Claim process')) action = 'claim_process'
          else if (reply.includes('Search tips')) action = 'search_tips'
          else if (reply.includes('Statistics')) action = 'stats'
          else if (reply.includes('Two-factor')) action = 'two_factor'
          else if (reply.includes('Security Tips')) action = 'security_tips'
          else if (reply.includes('Privacy')) action = 'privacy'
          else if (reply.includes('Leaderboard')) action = 'leaderboard'
          else if (reply.includes('earn more')) action = 'earn_more'
          
          return (
            <button
              key={idx}
              onClick={() => handleQuickAction(action)}
              className="px-2.5 py-1.5 sm:px-3 bg-[#4BB4DE]/10 hover:bg-[#4BB4DE]/20 rounded-full text-[10px] sm:text-xs text-[#EFDBCB] transition-all duration-200 border border-[#4BB4DE]/20 hover:border-[#4BB4DE]/40"
            >
              {reply}
            </button>
          )
        })}
      </div>
    )
  }

  // Chat content to render inside portal
  const chatContent = (
    <>
      {/* Chat Button - Fixed Position Floating */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[99999] w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-full shadow-2xl shadow-[#4BB4DE]/30 flex items-center justify-center group hover:shadow-[#4BB4DE]/50 transition-all duration-300 cursor-pointer"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7ED5EA] rounded-full text-[#150734] text-[10px] sm:text-xs flex items-center justify-center animate-pulse font-bold">
            {unreadCount}
          </span>
        )}
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#150734]" />
        <div className="absolute inset-0 rounded-full bg-[#7ED5EA]/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Chat Window - Fixed Position Floating */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-[99999] w-[92vw] sm:w-[90vw] md:w-[400px] max-w-md h-[500px] sm:h-[550px] md:h-[600px] bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7] rounded-2xl shadow-2xl shadow-[#4BB4DE]/20 border border-[#4BB4DE]/20 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Secure Theme */}
            <div className="bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-10 bg-[#150734] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#4BB4DE]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#150734] text-sm sm:text-base truncate">Secure AI</h3>
                  <p className="text-[10px] sm:text-xs text-[#150734]/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                    Online • 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#150734]/20 rounded-full flex items-center justify-center hover:bg-[#150734]/30 transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#150734]" />
              </button>
            </div>

            {/* Messages - Secure Theme */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2.5 sm:p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] text-[#150734]'
                        : 'bg-[#4BB4DE]/10 backdrop-blur-sm text-[#EFDBCB] border border-[#4BB4DE]/20'
                    }`}
                  >
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-[#4BB4DE]" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        {message.type === 'action' && renderQuickReplies(message.text)}
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-[#150734]" />
                      )}
                    </div>
                    <p className="text-[8px] sm:text-[10px] opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#4BB4DE]/10 backdrop-blur-sm rounded-2xl p-3 border border-[#4BB4DE]/20">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4BB4DE]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4BB4DE]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4BB4DE]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Secure Theme */}
            <div className="p-2.5 sm:p-4 border-t border-[#4BB4DE]/20 bg-[#0F2557]/50 flex-shrink-0">
              <div className="flex gap-1.5 sm:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4BB4DE]/5 border border-[#4BB4DE]/20 rounded-xl text-[#EFDBCB] placeholder-[#EFDBCB]/30 text-xs sm:text-sm focus:border-[#4BB4DE] focus:ring-2 focus:ring-[#4BB4DE]/20 transition-all outline-none min-w-0"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="w-8 h-8 sm:w-9 sm:h-10 md:w-10 md:h-10 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4BB4DE]/30 transition-all flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#150734]" />
                </button>
              </div>
              <p className="text-center text-[8px] sm:text-[10px] text-[#EFDBCB]/30 mt-2 sm:mt-3">
                🌊 Secure AI • Your data is encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  // Use portal to render at the root level
  if (!mounted) return null
  return createPortal(chatContent, document.body)
}

export default ChatBot
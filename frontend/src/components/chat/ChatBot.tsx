// src/components/chat/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react'
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
  Crown
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        text: "👋 Hello! I'm your AI assistant. How can I help you today?",
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
      await simulateTyping("Hey there! 👋 I'm your AI assistant. I can help you with:\n\n🔍 Finding lost/found items\n✅ Verification process\n💬 Claims and messages\n📊 Dashboard navigation\n🎯 Search tips\n\nWhat would you like to know?")
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
      await simulateTyping("I can help you with:\n\n🔍 Finding lost/found items - ask me about search\n✅ Identity verification - ask about verification\n📝 Reporting items - ask how to report\n💬 Claims process - ask about claims\n🔔 Notifications - ask about alerts\n\nWhat specific help do you need? I'm here 24/7! 💫")
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
    // Store quick replies for rendering
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

  // Parse quick replies from message text
  const renderQuickReplies = (text: string) => {
    const replies = text.split(' • ')
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {replies.map((reply, idx) => {
          // Map display text to action
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
          else if (reply.includes('Claim process')) action = 'claim_process'
          
          return (
            <button
              key={idx}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white transition-all duration-200"
            >
              {reply}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-full shadow-2xl flex items-center justify-center group"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
        <MessageCircle className="w-6 h-6 text-[#4b0082]" />
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[600px] bg-gradient-to-br from-[#4b0082] to-[#6d28d9] rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4b0082] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#E5E4E2]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4b0082]">AI Assistant</h3>
                  <p className="text-xs text-[#4b0082]/70">Online • 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-[#4b0082]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        {message.type === 'action' && renderQuickReplies(message.text)}
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/20 bg-white/5">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 text-[#4b0082]" />
                </button>
              </div>
              <p className="text-center text-[10px] text-white/30 mt-3">
                AI assistant • Your data is encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBot
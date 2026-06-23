import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Grid, 
  List, 
  Sliders, 
  X, 
  TrendingUp, 
  Clock, 
  Award, 
  Sparkles, 
  Shield, 
  Diamond,
  Crown,
  ArrowRight,
  Tag,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import SearchFilters from '../../components/items/SearchFilters'
import ItemList from '../../components/items/ItemList'
import ItemMap from '../../components/maps/ItemMap'
import Button from '../../components/common/UI/Button'
import type { Item } from '../../types/item.types'

const SearchItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [filters, setFilters] = useState<any>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [filters])

  const fetchItems = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockItems: Item[] = Array.from({ length: 12 }, (_, i) => ({
        id: `item_${i + 1}`,
        title: i % 2 === 0 ? `Lost iPhone ${13 + i}` : `Found Wallet ${i + 1}`,
        description: i % 2 === 0 
          ? `Silver iPhone ${13 + i} lost in downtown area` 
          : `Brown leather wallet found at coffee shop`,
        category: i % 2 === 0 ? 'electronics' : 'bags',
        itemType: i % 2 === 0 ? 'lost' : 'found',
        status: i % 3 === 0 ? 'open' : i % 3 === 1 ? 'claimed' : 'resolved',
        location: {
          type: 'Point' as const,
          coordinates: [
            -74.0060 + (Math.random() - 0.5) * 0.1,
            40.7128 + (Math.random() - 0.5) * 0.1
          ] as [number, number],
          address: `New York Location ${i + 1}`,
          city: 'New York',
          country: 'USA',
        },
        dateLostFound: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        identifyingFeatures: i % 2 === 0 ? ['Silver color', 'Cracked screen'] : ['Brown leather', 'Multiple cards'],
        reward: i % 2 === 0 ? Math.floor(Math.random() * 200) + 50 : 0,
        reportedBy: {
          id: `user_${i}`,
          fullName: i % 2 === 0 ? 'John Doe' : 'Jane Smith',
          email: i % 2 === 0 ? 'john.doe@example.com' : 'jane.smith@example.com',
          phone: i % 2 === 0 ? '+1234567890' : '+0987654321',
        },
        claimedBy: i % 3 === 2 ? {
          id: `user_${i + 1}`,
          fullName: 'Claimant User',
          email: 'claimant@example.com',
          phone: '+1122334455',
          profileImage: undefined,
        } : undefined,
        secureCode: '',
        isAnonymous: i % 5 === 0,
        metadata: {
          color: i % 2 === 0 ? 'Silver' : 'Brown',
          brand: i % 2 === 0 ? 'Apple' : 'Unknown',
          model: i % 2 === 0 ? `iPhone ${13 + i}` : '',
        },
        verificationScore: Math.floor(Math.random() * 40) + 60,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }))

      let filteredItems = mockItems
      
      if (filters.type) {
        filteredItems = filteredItems.filter(item => item.itemType === filters.type)
      }
      
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category)
      }
      
      if (filters.query) {
        const query = filters.query.toLowerCase()
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.identifyingFeatures.some(feature => feature.toLowerCase().includes(query))
        )
      }

      setItems(filteredItems)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchFilters: any) => {
    setFilters(searchFilters)
  }

  const handleItemClick = (item: Item) => {
    window.location.href = `/items/${item.id}`
  }

  const handleMapItemClick = (itemId: string) => {
    window.location.href = `/items/${itemId}`
  }

  const itemLocations = items.map(item => ({
    id: item.id,
    lat: item.location.coordinates[1],
    lng: item.location.coordinates[0],
    title: item.title,
    type: item.itemType,
    category: item.category,
    status: item.status,
    date: item.dateLostFound,
    address: item.location.address,
  }))

  const stats = [
    { icon: TrendingUp, label: 'Total Items', value: items.length, color: 'from-[#1C448E] to-[#938BA1]' },
    { icon: Award, label: 'Found Items', value: items.filter(i => i.itemType === 'found').length, color: 'from-[#938BA1] to-[#F4FDFF]' },
    { icon: Clock, label: 'Lost Items', value: items.filter(i => i.itemType === 'lost').length, color: 'from-[#1C448E] to-[#0F2A5E]' },
    { icon: MapPin, label: 'Near You', value: Math.floor(items.length * 0.7), color: 'from-[#938BA1] to-[#1C448E]' },
  ]

  // Quick filter buttons
  const quickFilters = [
    { label: 'Lost Items', value: 'lost', icon: AlertCircle, color: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400' },
    { label: 'Found Items', value: 'found', icon: CheckCircle, color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400' },
    { label: 'Electronics', value: 'electronics', icon: Tag, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400' },
    { label: 'Documents', value: 'documents', icon: Shield, color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400' },
    { label: 'Jewelry', value: 'jewelry', icon: Diamond, color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400' },
  ]

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] overflow-x-hidden">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C448E]/30 via-transparent to-[#1C448E]/40 pointer-events-none" />
      
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
        >
          <div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#F4FDFF] to-[#938BA1] rounded-xl flex items-center justify-center shadow-lg relative">
                <Shield className="w-5 h-5 text-[#1C448E]" />
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-3 h-3 text-[#F4FDFF]" />
                </motion.div>
              </div>
              <span className="text-[#F4FDFF] text-sm font-semibold">Item Discovery</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent"
            >
              Search Items
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#F4FDFF]/40 mt-1 text-sm"
            >
              Find lost and found items in your area
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 backdrop-blur-sm"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <div className="flex bg-[#F4FDFF]/10 backdrop-blur-sm rounded-xl p-1 border border-[#F4FDFF]/20">
              {[
                { mode: 'grid', icon: Grid, label: 'Grid View' },
                { mode: 'list', icon: List, label: 'List View' },
                { mode: 'map', icon: MapPin, label: 'Map View' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === mode 
                      ? 'bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] shadow-lg' 
                      : 'text-[#F4FDFF]/50 hover:text-[#F4FDFF] hover:bg-[#F4FDFF]/10'
                  }`}
                  title={label}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-[#F4FDFF] shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={20} className="opacity-80" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search Bar - Clean & Functional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search items by title, description..."
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="w-full px-5 py-3.5 pl-12 bg-[#F4FDFF]/5 backdrop-blur-sm border border-[#F4FDFF]/15 rounded-2xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20 focus:border-[#F4FDFF] transition-all duration-300 shadow-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" size={20} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <kbd className="px-2 py-1 text-xs bg-[#F4FDFF]/10 rounded-lg text-[#F4FDFF]/40 border border-[#F4FDFF]/10">
                ⌘K
              </kbd>
            </div>
          </div>
        </motion.div>

        {/* Quick Filters - Clean Glass Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          <span className="text-sm text-[#F4FDFF]/40 flex items-center mr-2 font-medium">Quick filters:</span>
          {quickFilters.map((filter, idx) => (
            <motion.button
              key={filter.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilters({ ...filters, category: filters.category === filter.value ? undefined : filter.value })}
              className={`
                px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300
                backdrop-blur-xl border 
                ${filters.category === filter.value 
                  ? `bg-gradient-to-r ${filter.color} border-opacity-100 shadow-lg` 
                  : `bg-[#F4FDFF]/5 hover:bg-[#F4FDFF]/10 border-[#F4FDFF]/10 text-[#F4FDFF]/50 hover:text-[#F4FDFF]`
                }
              `}
            >
              <div className="flex items-center gap-2">
                <filter.icon size={14} />
                {filter.label}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Advanced Filters - Clean Toggle Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#F4FDFF]/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-[#F4FDFF]" />
                    <h3 className="font-semibold text-[#F4FDFF] text-lg">Advanced Filters</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {(filters.type || filters.category || filters.query) && (
                      <button
                        onClick={() => setFilters({})}
                        className="text-sm text-[#F4FDFF]/40 hover:text-[#F4FDFF]/70 flex items-center gap-1 transition-colors px-3 py-1 rounded-lg bg-[#F4FDFF]/5 hover:bg-[#F4FDFF]/10"
                      >
                        <X size={14} />
                        Clear all
                      </button>
                    )}
                    <div className="flex items-center gap-2 bg-[#F4FDFF]/5 px-3 py-1.5 rounded-lg border border-[#F4FDFF]/10">
                      <span className="text-xs text-[#F4FDFF]/40">Active filters:</span>
                      <span className="text-xs font-medium text-[#F4FDFF]">
                        {Object.keys(filters).filter(k => filters[k]).length || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <SearchFilters onSearch={handleSearch} loading={loading} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"
        >
          <div className="text-[#F4FDFF]/50 text-sm">
            Found <span className="font-bold text-[#F4FDFF]">{items.length}</span> items
            {filters.type && <span className="ml-2 px-2 py-1 bg-[#938BA1]/20 rounded-full text-xs text-[#F4FDFF]/70">Type: {filters.type}</span>}
            {filters.category && <span className="ml-2 px-2 py-1 bg-[#938BA1]/20 rounded-full text-xs text-[#F4FDFF]/70">Category: {filters.category}</span>}
            {filters.query && <span className="ml-2 px-2 py-1 bg-[#938BA1]/20 rounded-full text-xs text-[#F4FDFF]/70">Search: "{filters.query}"</span>}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#F4FDFF]/40">Sort by:</span>
            <div className="relative">
              <select className="text-sm border border-[#F4FDFF]/20 rounded-xl px-4 py-1.5 pr-8 bg-[#1C448E]/50 backdrop-blur-sm text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20 focus:border-[#F4FDFF] appearance-none cursor-pointer">
                <option className="bg-[#1C448E]">Newest First</option>
                <option className="bg-[#1C448E]">Nearest First</option>
                <option className="bg-[#1C448E]">Highest Reward</option>
                <option className="bg-[#1C448E]">Most Relevant</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/40 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Content - Glass Cards */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1C448E]/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#938BA1]/15 shadow-xl"
            >
              <ItemMap
                items={itemLocations}
                center={[40.7128, -74.0060]}
                zoom={12}
                onItemClick={handleMapItemClick}
                showFilters={false}
                radius={filters.radius ? parseInt(filters.radius) : undefined}
              />
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Custom Item Cards with Different Glass Styles */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#F4FDFF]/5 rounded-2xl p-6 h-64 border border-[#F4FDFF]/10" />
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, idx) => {
                    // Different glass styles based on item type
                    let glassStyle = ''
                    let badgeColor = ''
                    let statusIcon = null
                    let statusColor = ''

                    if (item.itemType === 'lost') {
                      glassStyle = 'bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/40'
                      badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      statusIcon = <AlertCircle size={14} />
                      statusColor = 'text-orange-400'
                    } else {
                      glassStyle = 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-green-500/20 hover:border-green-500/40'
                      badgeColor = 'bg-green-500/20 text-green-400 border-green-500/30'
                      statusIcon = <CheckCircle size={14} />
                      statusColor = 'text-green-400'
                    }

                    // Status specific styling
                    let statusBadge = ''
                    let statusBadgeColor = ''
                    if (item.status === 'claimed') {
                      statusBadge = 'Claimed'
                      statusBadgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    } else if (item.status === 'resolved') {
                      statusBadge = 'Resolved'
                      statusBadgeColor = 'bg-green-500/20 text-green-400 border-green-500/30'
                    } else {
                      statusBadge = 'Open'
                      statusBadgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => handleItemClick(item)}
                        className={`
                          cursor-pointer rounded-2xl p-5 border shadow-xl transition-all duration-300
                          ${glassStyle}
                        `}
                      >
                        {/* Header with Badges */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor}`}>
                              {item.itemType === 'lost' ? 'Lost' : 'Found'}
                            </span>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadgeColor}`}>
                              {statusBadge}
                            </span>
                          </div>
                          {item.reward && item.reward > 0 && (
                            <span className="text-sm font-bold text-[#F4FDFF] bg-[#F4FDFF]/10 px-3 py-1 rounded-full border border-[#F4FDFF]/20">
                              ${item.reward}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#F4FDFF] mb-1 line-clamp-1">
                          {item.title}
                        </h3>

                        {/* Category */}
                        <p className="text-xs text-[#F4FDFF]/40 mb-2 flex items-center gap-1">
                          <Tag size={12} />
                          {item.category}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-[#F4FDFF]/60 mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Features */}
                        {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.identifyingFeatures.slice(0, 2).map((feature, fi) => (
                              <span key={fi} className="text-xs px-2 py-1 bg-[#F4FDFF]/5 rounded-full text-[#F4FDFF]/40 border border-[#F4FDFF]/10">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#F4FDFF]/10">
                          <div className="flex items-center gap-3 text-xs text-[#F4FDFF]/40">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              {item.location.address?.split(',')[0] || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#F4FDFF]/30">
                            <User size={12} />
                            {item.reportedBy.fullName}
                          </div>
                        </div>

                        {/* Verification Badge */}
                        {item.verificationScore && item.verificationScore > 80 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1">
                            <Shield size={12} className="text-green-400" />
                            <span className="text-xs text-green-400">Verified</span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-[#1C448E]/40 backdrop-blur-xl rounded-2xl border border-[#938BA1]/15 shadow-xl mt-6"
                >
                  <div className="w-24 h-24 bg-[#938BA1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-12 h-12 text-[#F4FDFF]/30" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F4FDFF] mb-2">No items found</h3>
                  <p className="text-[#F4FDFF]/40 mb-6 max-w-md mx-auto">
                    {filters.query || filters.type || filters.category
                      ? 'Try adjusting your search filters or search in a different area.'
                      : 'Be the first to report a lost or found item in your area!'}
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button variant="outline" onClick={() => setFilters({})} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                      Clear Filters
                    </Button>
                    <Button variant="primary" className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-xl hover:shadow-[#938BA1]/20">
                      <MapPin size={18} className="mr-2" />
                      Search Nearby
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section - Clean Glass */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-[#1C448E]/30 to-[#938BA1]/15 backdrop-blur-xl rounded-2xl p-5 border border-[#938BA1]/15 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-[#F4FDFF]" />
            <h3 className="font-semibold text-[#F4FDFF]">Search Tips</h3>
            <Diamond size={14} className="text-[#938BA1] ml-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 bg-[#F4FDFF]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4FDFF]/20 transition-colors">
                <SearchIcon size={16} className="text-[#F4FDFF]" />
              </div>
              <div>
                <h4 className="font-medium text-[#F4FDFF] text-sm">Use Specific Keywords</h4>
                <p className="text-xs text-[#F4FDFF]/40 mt-1">
                  Try searching for specific features like "black iPhone" or "brown wallet"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 bg-[#F4FDFF]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4FDFF]/20 transition-colors">
                <Filter size={16} className="text-[#F4FDFF]" />
              </div>
              <div>
                <h4 className="font-medium text-[#F4FDFF] text-sm">Filter by Location</h4>
                <p className="text-xs text-[#F4FDFF]/40 mt-1">
                  Use the map view to see items in specific areas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 bg-[#F4FDFF]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#F4FDFF]/20 transition-colors">
                <MapPin size={16} className="text-[#F4FDFF]" />
              </div>
              <div>
                <h4 className="font-medium text-[#F4FDFF] text-sm">Check Nearby Areas</h4>
                <p className="text-xs text-[#F4FDFF]/40 mt-1">
                  Items may have been found or lost in neighboring locations
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SearchItems
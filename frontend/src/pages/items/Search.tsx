import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, Filter, MapPin, Grid, List, Sliders, X, TrendingUp, Clock, Award, Sparkles, Shield, Diamond } from 'lucide-react'
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
  const [showFilters, setShowFilters] = useState(true)

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
    { icon: TrendingUp, label: 'Total Items', value: items.length, color: 'from-blue-500 to-cyan-500' },
    { icon: Award, label: 'Found Items', value: items.filter(i => i.itemType === 'found').length, color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'Lost Items', value: items.filter(i => i.itemType === 'lost').length, color: 'from-orange-500 to-red-500' },
    { icon: MapPin, label: 'Near You', value: Math.floor(items.length * 0.7), color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] overflow-x-hidden">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
        >
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#E5E4E2]" />
              </div>
              <span className="text-[#E5E4E2] text-sm font-semibold">Item Discovery</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent"
            >
              Search Items
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50 mt-1 text-sm"
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
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
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
                      ? 'bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
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
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={20} className="opacity-80" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-[#E5E4E2]" />
                    <h3 className="font-semibold text-white">Advanced Filters</h3>
                  </div>
                  {(filters.type || filters.category || filters.query) && (
                    <button
                      onClick={() => setFilters({})}
                      className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors"
                    >
                      <X size={14} />
                      Clear all
                    </button>
                  )}
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
          <div className="text-white/60 text-sm">
            Found <span className="font-bold text-[#E5E4E2]">{items.length}</span> items
            {filters.type && <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs">Type: {filters.type}</span>}
            {filters.category && <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs">Category: {filters.category}</span>}
            {filters.query && <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs">Search: "{filters.query}"</span>}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">Sort by:</span>
            <select className="text-sm border border-white/20 rounded-xl px-3 py-1.5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#E5E4E2]/20 focus:border-[#E5E4E2]">
              <option className="bg-[#4b0082]">Newest First</option>
              <option className="bg-[#4b0082]">Nearest First</option>
              <option className="bg-[#4b0082]">Highest Reward</option>
              <option className="bg-[#4b0082]">Most Relevant</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20"
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
              <ItemList
                items={items}
                loading={loading}
                onItemClick={handleItemClick}
                emptyMessage={
                  filters.query || filters.type || filters.category
                    ? 'No items match your search criteria'
                    : 'No items found in your area'
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        {!loading && items.length === 0 && viewMode !== 'map' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mt-6"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-12 h-12 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              {filters.query || filters.type || filters.category
                ? 'Try adjusting your search filters or search in a different area.'
                : 'Be the first to report a lost or found item in your area!'}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button variant="outline" onClick={() => setFilters({})} className="border-white/20 text-white hover:bg-white/10">
                Clear Filters
              </Button>
              <Button variant="primary" className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] hover:shadow-xl">
                <MapPin size={18} className="mr-2" />
                Search Nearby
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-[#E5E4E2]" />
            <h3 className="font-semibold text-white">Search Tips</h3>
            <Diamond size={14} className="text-[#E5E4E2] ml-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <SearchIcon size={16} className="text-[#E5E4E2]" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Use Specific Keywords</h4>
                <p className="text-xs text-white/50 mt-1">
                  Try searching for specific features like "black iPhone" or "brown wallet"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Filter size={16} className="text-[#E5E4E2]" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Filter by Location</h4>
                <p className="text-xs text-white/50 mt-1">
                  Use the map view to see items in specific areas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-[#E5E4E2]" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Check Nearby Areas</h4>
                <p className="text-xs text-white/50 mt-1">
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
import React, { useState } from 'react'
import { Search, Filter, MapPin, Calendar, Tag, X } from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import Select from '../common/UI/Select'

interface SearchFiltersProps {
  onSearch: (filters: any) => void
  loading?: boolean
  initialFilters?: {
    query?: string
    type?: string
    category?: string
    dateFrom?: string
    dateTo?: string
    location?: string
    radius?: string
  }
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearch,
  loading = false,
  initialFilters = {},
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [filters, setFilters] = useState({
    query: initialFilters.query || '',
    type: initialFilters.type || '',
    category: initialFilters.category || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    location: initialFilters.location || '',
    radius: initialFilters.radius || '10',
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'documents', label: 'Documents' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'bags', label: 'Bags & Wallets' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'keys', label: 'Keys' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' },
  ]

  const itemTypes = [
    { value: '', label: 'All Types' },
    { value: 'lost', label: 'Lost Items' },
    { value: 'found', label: 'Found Items' },
  ]

  const radiusOptions = [
    { value: '1', label: '1 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '25', label: '25 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
    { value: 'all', label: 'Anywhere' },
  ]

  const handleChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const resetFilters = () => {
    const resetValues = {
      query: '',
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      location: '',
      radius: '10',
    }
    setFilters(resetValues)
    onSearch({})
    setIsAdvancedOpen(false)
  }

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'radius' && value === '10') return false
      return value !== ''
    })
  }

  const clearFilter = (filterName: string) => {
    setFilters(prev => ({ ...prev, [filterName]: '' }))
  }

  const getFilterLabel = (key: string, value: string): string => {
    const labels: Record<string, Record<string, string>> = {
      type: {
        lost: 'Lost Items',
        found: 'Found Items',
      },
      category: {
        electronics: 'Electronics',
        documents: 'Documents',
        jewelry: 'Jewelry',
        bags: 'Bags & Wallets',
        clothing: 'Clothing',
        keys: 'Keys',
        pets: 'Pets',
        other: 'Other',
      },
      radius: {
        '1': 'Within 1 km',
        '5': 'Within 5 km',
        '10': 'Within 10 km',
        '25': 'Within 25 km',
        '50': 'Within 50 km',
        '100': 'Within 100 km',
        'all': 'Anywhere',
      },
    }

    return labels[key]?.[value] || value
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <Input
                placeholder="Search items by title, description, or features..."
                value={filters.query}
                onChange={(e) => handleChange('query', e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="whitespace-nowrap"
            disabled={loading}
          >
            <Filter size={20} className="mr-2" />
            {isAdvancedOpen ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={loading}
            className="whitespace-nowrap"
          >
            <Search size={20} className="mr-2" />
            Search
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (key === 'radius' && value === '10')) return null
              
              let displayValue = value
              if (key === 'dateFrom' || key === 'dateTo') {
                displayValue = new Date(value).toLocaleDateString()
              } else if (key === 'type' || key === 'category' || key === 'radius') {
                displayValue = getFilterLabel(key, value)
              }

              const filterLabel: Record<string, string> = {
                query: 'Search',
                type: 'Type',
                category: 'Category',
                dateFrom: 'From Date',
                dateTo: 'To Date',
                location: 'Location',
                radius: 'Radius',
              }

              return (
                <div
                  key={key}
                  className="inline-flex items-center bg-white border border-blue-200 rounded-full px-3 py-1 text-sm"
                >
                  <span className="font-medium text-blue-700 mr-1">
                    {filterLabel[key]}:
                  </span>
                  <span className="text-gray-700 mr-2">{displayValue}</span>
                  <button
                    type="button"
                    onClick={() => clearFilter(key)}
                    className="text-gray-400 hover:text-red-600"
                    disabled={loading}
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={20} className="text-gray-400 mt-5" />
                </div>
                <Select
                  label="Item Type"
                  value={filters.type}
                  onChange={(value) => handleChange('type', value)}
                  options={itemTypes}
                  disabled={loading}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={20} className="text-gray-400 mt-5" />
                </div>
                <Select
                  label="Category"
                  value={filters.category}
                  onChange={(value) => handleChange('category', value)}
                  options={categories}
                  disabled={loading}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-gray-400 mt-5" />
                </div>
                <Select
                  label="Search Radius"
                  value={filters.radius}
                  onChange={(value) => handleChange('radius', value)}
                  options={radiusOptions}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-gray-400 mt-5" />
                </div>
                <Input
                  label="From Date"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleChange('dateFrom', e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-gray-400 mt-5" />
                </div>
                <Input
                  label="To Date"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleChange('dateTo', e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={20} className="text-gray-400 mt-5" />
              </div>
              <Input
                label="Location (City/Area)"
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter city, area, or postal code"
                disabled={loading}
                className="pl-10"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset All
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => {
                  onSearch(filters)
                  setIsAdvancedOpen(false)
                }}
                isLoading={loading}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick filters:</span>
          <button
            type="button"
            onClick={() => {
              const newFilters = { ...filters, type: 'lost', category: '' }
              setFilters(newFilters)
              onSearch(newFilters)
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.type === 'lost'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Lost Items
          </button>
          <button
            type="button"
            onClick={() => {
              const newFilters = { ...filters, type: 'found', category: '' }
              setFilters(newFilters)
              onSearch(newFilters)
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.type === 'found'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Found Items
          </button>
          <button
            type="button"
            onClick={() => {
              const newFilters = { ...filters, type: '', category: 'electronics' }
              setFilters(newFilters)
              onSearch(newFilters)
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.category === 'electronics'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Electronics
          </button>
          <button
            type="button"
            onClick={() => {
              const newFilters = { ...filters, type: '', category: 'documents' }
              setFilters(newFilters)
              onSearch(newFilters)
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.category === 'documents'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Documents
          </button>
          <button
            type="button"
            onClick={() => {
              const newFilters = { ...filters, type: '', category: 'jewelry' }
              setFilters(newFilters)
              onSearch(newFilters)
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.category === 'jewelry'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Jewelry
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchFilters